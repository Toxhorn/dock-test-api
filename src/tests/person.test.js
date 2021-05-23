import jest from 'jest-mock'
import PersonService from '../services/PersonService.js'

describe('API tests', () => {
  let person
  let personService

  beforeEach(async () => {
    personService = new PersonService()
    person = {
      nome: 'Joana da Silva',
      cpf: '10299449033',
      dataNascimento: new Date('1994-05-03T00:00:00')
    }
  })

  describe('Person endpoints', () => {
    it('Create with valid data', async () => {
      personService.personRepository.persons.create = jest.fn(() => person)
      const data = await personService.create(person)

      expect(data).toBe(person)
    })

    it('Create a person throwing invalid dataNascimento', async () => {
      try {
        person.dataNascimento = '12-12-2020'
        personService.create(person)
      } catch (error) {
        expect(error.message).toEqual('ValidationError: Invalid date for dataNascimento')
      }
    })

    test.each([
      '00000000000', '99999999999', '12345678912', '10299449034'
    ])('Create a person throwing invalid cpf', async (cpf) => {
      try {
        person.cpf = cpf
        personService.create(person)
      } catch (error) {
        expect(error.message).toEqual('ValidationError: Invalid CPF')
      }
    })

    it('Get all persons', async done => {
      personService.personRepository.persons.findMany = jest.fn(() => person)
      await personService.getAll()
      done()
    })

    it('Get one person', async done => {
      personService.personRepository.persons.findUnique = jest.fn(() => person)
      await personService.getOne(1)
      done()
    })

    it('Get one person throwing for person not found', async () => {
      try {
        personService.personRepository.persons.findUnique = jest.fn(() => null)
        await personService.getOne(1)
      } catch (error) {
        expect(error.message).toEqual('Cannot find a person with 1')
      }
    })
  })
})
