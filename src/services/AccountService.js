import Joi from 'joi'
import moment from 'moment'

import validationUtils from '../utils/validationUtils.js'
import PersonRepository from '../repositories/PersonRepository.js'
import AccountRepository from '../repositories/AccountRepository.js'
import TransactionRepository from '../repositories/TransactionRepository.js'

export default class AccountService {
  constructor () {
    this.personRepository = new PersonRepository()
    this.accountRepository = new AccountRepository()
    this.transactionRepository = new TransactionRepository()
  }

  validate (object) {
    const validateMoney = (value, helper) => {
      const isValid = validationUtils.money(value)
      if (!isValid) return helper.message(helper.state.path + ' must be a monetary value')
      return true
    }

    const schema = Joi.object({
      idPessoa: Joi.number().required(),
      saldo: Joi.custom(validateMoney).required(),
      limiteSaqueDiario: Joi.custom(validateMoney).required(),
      // 1 - Conta Corrente, 2 - Poupança
      tipoConta: Joi.number().valid(1, 2).required()
    })

    const { error } = schema.validate(object)
    if (error) throw new Error(error)
  }

  async getExtract (accountId, params) {
    const { iniDate, endDate } = params
    if (iniDate && !validationUtils.date(iniDate)) throw new Error('Param iniDate must be a valid date')
    if (endDate && !validationUtils.date(endDate)) throw new Error('Param endDate must be a valid date')

    const result = await this.accountRepository.findOne(accountId)
    if (!result) throw new Error(`Cannot find an account with id ${accountId}`)

    result.extrato = await this.transactionRepository.getTransactionsByAccount(accountId, params)
    return result
  }

  async getOne (accountId) {
    const result = await this.accountRepository.findOne(accountId)
    if (!result) throw new Error(`Cannot find an account with id ${accountId}`)

    result.saldo = parseFloat(result.saldo)
    result.limiteSaqueDiario = parseFloat(result.limiteSaqueDiario)
    return result
  }

  async changeStatus (accountId, status) {
    const result = await this.accountRepository.findOne(accountId)
    if (!result) throw new Error(`Cannot find an account with id ${accountId}`)
    return this.accountRepository.updateField(accountId, { flagAtivo: status })
  }

  async create (account) {
    this.validate(account)

    // Check if person exists
    const personExists = await this.personRepository.findOne(account.idPessoa)
    if (!personExists) throw new Error(`Cannot find a person with id ${account.idPessoa}`)

    // Check if this person has an account
    const accountExists = await this.accountRepository.findByPerson(account.idPessoa)
    if (accountExists) throw new Error('This person already has an account')

    account.flagAtivo = true
    account.dataCriacao = moment().toISOString()
    account.pessoa = { connect: { idPessoa: account.idPessoa } }
    delete account.idPessoa
    const result = await this.accountRepository.create(account)
    result.saldo = parseFloat(result.saldo)
    result.limiteSaqueDiario = parseFloat(result.limiteSaqueDiario)
    return result
  }
}
