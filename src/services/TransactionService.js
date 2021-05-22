import Joi from 'joi'
import moment from 'moment'

import validationUtils from '../utils/validationUtils.js'
import AccountRepository from '../repositories/AccountRepository.js'
import TransactionRepository from '../repositories/TransactionRepository.js'

export default class AccountService {
  constructor () {
    this.accountRepository = new AccountRepository()
    this.transactionRepository = new TransactionRepository()
  }

  async validate (object) {
    const validateMoney = (value, helper) => {
      const isValid = validationUtils.money(value)
      if (!isValid) return helper.message(helper.state.path + ' must be a monetary value')
      return true
    }

    const schema = Joi.object({
      idConta: Joi.number().required(),
      valor: Joi.custom(validateMoney).required()
    })

    const { error } = schema.validate(object)
    if (error) throw new Error(error)

    // Check if account exists
    const accountExists = await this.accountRepository.findByPerson(object.idConta)
    if (!accountExists) throw new Error(`Account ${object.idConta} not found`)
    if (!accountExists.flagAtivo) throw new Error(`Operation not allowed ${object.idConta} is blocked`)
    return accountExists
  }

  async transaction (payload, type) {
    if (!['deposit', 'withdraw'].includes(type)) throw new Error('Valid transactions are deposit or withdraw')
    const previousAccount = await this.validate(payload)
    previousAccount.saldo = parseFloat(previousAccount.saldo)
    previousAccount.limiteSaqueDiario = parseFloat(previousAccount.limiteSaqueDiario)

    const sum = await this.transactionRepository.getTodayTotalWithdraw(payload.idConta)
    console.log('aaaaaa', sum)
    if (type === 'withdraw' && sum > previousAccount.limiteSaqueDiario) {
      throw new Error(`Daily withdraw limit ${previousAccount.limiteSaqueDiario} has been reached`)
    }

    // Deposit type is 1 and withdraw type is 0
    payload.tipoTransacao = type === 'deposit' ? 1 : 0
    payload.dataTransacao = moment().toISOString()
    await this.transactionRepository.create(payload)

    let newTotal
    if (type === 'deposit') newTotal = previousAccount.saldo + payload.valor
    else newTotal = previousAccount.saldo - payload.valor

    const newAccount = await this.accountRepository.updateTotal(payload.idConta, newTotal)

    return {
      saldoAnterior: parseFloat(previousAccount.saldo),
      novoSaldo: parseFloat(newAccount.saldo)
    }
  }
}
