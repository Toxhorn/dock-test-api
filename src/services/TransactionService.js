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

  validate (object) {
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
  }

  async validateAccount (account) {
    if (!account) throw new Error('Account not found')
    const { idConta, flagAtivo } = account
    // Check if account exists and is active
    if (!flagAtivo) throw new Error(`Operation not allowed account ${idConta} is blocked`)
  }

  async validateWithdrawLimit (account) {
    const { idConta, limiteSaqueDiario } = account
    const sum = await this.transactionRepository.getTodayTotalWithdraw(idConta)
    if (sum >= limiteSaqueDiario) throw new Error(`Daily withdraw limit ${limiteSaqueDiario} has been reached`)
  }

  async transaction (payload, type) {
    this.validate(payload)

    const account = await this.accountRepository.findOne(payload.idConta)
    await this.validateAccount(account)
    if (type === 'withdraw') await this.validateWithdrawLimit(account)

    account.saldo = parseFloat(account.saldo)
    account.limiteSaqueDiario = parseFloat(account.limiteSaqueDiario)

    // Deposit type is 1 and withdraw type is 0
    payload.tipoTransacao = type === 'deposit' ? 1 : 0
    payload.dataTransacao = moment().toISOString()
    await this.transactionRepository.create(payload)

    let newTotal
    if (type === 'deposit') newTotal = account.saldo + payload.valor
    else newTotal = account.saldo - payload.valor

    const newAccount = await this.accountRepository.updateField(payload.idConta, { saldo: newTotal })

    return {
      saldoAnterior: parseFloat(account.saldo),
      novoSaldo: parseFloat(newAccount.saldo)
    }
  }
}
