import jest from 'jest-mock'
import AccountService from '../services/AccountService.js'

describe('API tests', () => {
  let account
  let person
  let accountService

  beforeEach(async () => {
    accountService = new AccountService()
    account = {
      idPessoa: 1,
      saldo: 5,
      limiteSaqueDiario: 100,
      tipoConta: 2
    }
    person = {
      nome: 'Joana da Silva',
      cpf: '10299449033',
      dataNascimento: new Date('1994-05-03T00:00:00')
    }
  })

  describe('Account endpoints', () => {
    it('Create an account with valid data', async () => {
      accountService.personRepository.persons.findUnique = jest.fn(() => person)
      accountService.accountRepository.accounts.create = jest.fn(() => account)
      accountService.accountRepository.accounts.findFirst = jest.fn(() => null)
      const data = await accountService.create(account)

      expect(data).toBe(account)
    })

    it('Should throw for invalid entry', async () => {
      try {
        account.limiteSaqueDiario = '10'
        await accountService.create(account)
      } catch (error) {
        expect(error.message).toEqual('ValidationError: limiteSaqueDiario must be a monetary value')
      }
    })

    test.each([
      ['person not found', null, null, 'Cannot find a person with id 1'],
      ['person already has an account', {}, {}, 'This person already has an account']
    ])('Should throw for %s', async (description, findPerson, findAccount, errorExpected) => {
      try {
        accountService.accountRepository.accounts.create = jest.fn(() => account)
        accountService.personRepository.persons.findUnique = jest.fn(() => findPerson)
        accountService.accountRepository.accounts.findFirst = jest.fn(() => findAccount)
        await accountService.create(account)
      } catch (error) {
        expect(error.message).toEqual(errorExpected)
      }
    })

    it('Should activate an account', async () => {
      accountService.accountRepository.accounts.findUnique = jest.fn(() => account)
      accountService.accountRepository.accounts.update = jest.fn(() => account)
      await accountService.changeStatus(1, 1)
    })

    it('Should activate an account throwing accoun not found', async () => {
      try {
        accountService.accountRepository.accounts.findUnique = jest.fn(() => null)
        await accountService.changeStatus(1, 1)
      } catch (error) {
        expect(error.message).toEqual('Cannot find an account with id 1')
      }
    })

    it('Get one account', async done => {
      accountService.accountRepository.accounts.findUnique = jest.fn(() => account)
      await accountService.getOne(1)
      done()
    })

    it('Get one account throwing for account not found', async () => {
      try {
        accountService.accountRepository.accounts.findUnique = jest.fn(() => null)
        await accountService.getOne(1)
      } catch (error) {
        expect(error.message).toEqual('Cannot find an account with id 1')
      }
    })

    it('Get account extract', async done => {
      accountService.accountRepository.accounts.findUnique = jest.fn(() => account)
      accountService.transactionRepository.transactions.findMany = jest.fn(() => [])
      await accountService.getExtract(1, {})
      done()
    })

    test.each([
      ['account not found', {}, false, 'Cannot find an account with id 1'],
      ['invalid date param', { iniDate: '12-12-2020', endDate: '12-12-2020' }, true, 'Param iniDate must be a valid date'],
      ['invalid date param', { iniDate: '2020-12-12', endDate: '12-12-2020' }, true, 'Param endDate must be a valid date'],
      ['person already has an account', {}, {}, 'This person already has an account']
    ])('Should get an extract throwing for %s', async (description, params, sendAccount, errorExpected) => {
      try {
        accountService.accountRepository.accounts.findUnique = jest.fn(() => sendAccount ? account : null)
        accountService.transactionRepository.transactions.findMany = jest.fn(() => [])
        await accountService.getExtract(1, params)
      } catch (error) {
        expect(error.message).toEqual(errorExpected)
      }
    })

    it('Should get an extract throwing for account not found', async () => {
      try {
        accountService.accountRepository.accounts.findUnique = jest.fn(() => null)
        await accountService.getExtract(1, {})
      } catch (error) {
        expect(error.message).toEqual('Cannot find an account with id 1')
      }
    })
  })
})
