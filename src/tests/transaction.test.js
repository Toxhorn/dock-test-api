import jest from 'jest-mock'
import TransactionService from '../services/TransactionService.js'

describe('API tests', () => {
  let transaction
  let account
  let response
  let transactionService

  beforeEach(async () => {
    transactionService = new TransactionService()
    account = {
      idPessoa: 1,
      saldo: 5,
      flagAtivo: true,
      limiteSaqueDiario: 100,
      tipoConta: 2
    }
    response = {
      saldoAnterior: 5,
      novoSaldo: 5
    }
    transaction = {
      idConta: 1,
      valor: 10
    }
  })

  describe('Transaction endpoints', () => {
    test.each(['deposit', 'withdraw'])('Should %s with valid data', async type => {
      transactionService.accountRepository.accounts.findUnique = jest.fn(() => account)
      transactionService.accountRepository.accounts.update = jest.fn(() => account)
      transactionService.transactionRepository.transactions.create = jest.fn(() => transaction)
      transactionService.transactionRepository.transactions.groupBy = jest.fn(() => 10)
      const data = await transactionService.transaction(transaction, type)

      expect(data).toEqual(response)
    })

    test.each(['deposit', 'withdraw'])('Should %s with invalid data', async type => {
      try {
        transaction.valor = '10'
        await transactionService.transaction(transaction, type)
      } catch (error) {
        expect(error.message).toEqual('ValidationError: valor must be a monetary value')
      }
    })

    test.each([100, 110])('Should throw a daily withdraw limit', async sum => {
      try {
        transactionService.accountRepository.accounts.findUnique = jest.fn(() => account)
        transactionService.accountRepository.accounts.update = jest.fn(() => account)
        transactionService.transactionRepository.transactions.create = jest.fn(() => transaction)
        transactionService.transactionRepository.transactions.groupBy = jest.fn(() => sum)
        await transactionService.transaction(transaction, 'withdraw')
      } catch (error) {
        expect(error.message).toEqual(`Daily withdraw limit ${account.limiteSaqueDiario} has been reached`)
      }
    })

    it('Should throw account not found', async () => {
      try {
        transactionService.accountRepository.accounts.findUnique = jest.fn(() => null)
        await transactionService.transaction(transaction)
      } catch (error) {
        expect(error.message).toEqual('Account not found')
      }
    })

    it('Should throw account is blocked', async () => {
      try {
        account.flagAtivo = false
        transactionService.accountRepository.accounts.findUnique = jest.fn(() => account)
        await transactionService.transaction(transaction)
      } catch (error) {
        expect(error.message).toEqual(`Operation not allowed account ${account.idConta} is blocked`)
      }
    })
  })
})
