import Joi from 'joi'
import moment from 'moment'

import validationUtils from '../utils/validationUtils.js'
import PersonRepository from '../repositories/PersonRepository.js'
import AccountRepository from '../repositories/AccountRepository.js'

export default class AccountService {
  constructor () {
    this.personRepository = new PersonRepository()
    this.accountRepository = new AccountRepository()
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

  async getOne (id) {
    const result = await this.accountRepository.findOne(id)

    if (!result) throw new Error('Cannot find an account with id ' + id)

    result.saldo = parseFloat(result.saldo)
    result.limiteSaqueDiario = parseFloat(result.limiteSaqueDiario)
    return result
  }

  async create (account) {
    this.validate(account)

    // Check if person exists
    const personExists = await this.personRepository.findOne(account.idPessoa)
    if (!personExists) throw new Error('Cannot find a person with id ' + account.idPessoa)

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
