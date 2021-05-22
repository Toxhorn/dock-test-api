import Joi from 'joi'
import moment from 'moment'

import validationUtils from '../utils/validationUtils.js'
import PersonRepository from '../repositories/PersonRepository.js'

export default class PersonService {
  constructor () {
    this.personRepository = new PersonRepository()
  }

  validate (person) {
    const validateCpf = (value, helper) => {
      const isValid = validationUtils.cpf(value)
      if (!isValid) return helper.message('Invalid CPF')
      return true
    }

    const validateDate = (value, helper) => {
      const isValid = validationUtils.date(value)
      if (!isValid) return helper.message('Invalid date for ' + helper.state.path)
      return true
    }

    const schema = Joi.object({
      nome: Joi.string().required(),
      cpf: Joi.string().custom(validateCpf).required(),
      dataNascimento: Joi.custom(validateDate).required()
    })

    const { error } = schema.validate(person)
    if (error) throw new Error(error)
  }

  getAll () {
    return this.personRepository.findAll()
  }

  async getOne (id) {
    const result = await this.personRepository.findOne(id)
    if (!result) throw new Error(`Cannot find a person with ${id}`)
    return result
  }

  create (person) {
    this.validate(person)
    person.dataNascimento = moment(person.dataNascimento).toISOString()
    return this.personRepository.create(person)
  }
}
