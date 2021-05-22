import Prisma from '@prisma/client'
const { PrismaClient } = Prisma

export default class Person {
  constructor () {
    this.persons = new PrismaClient().pessoa
  }

  async findAll () {
    return await this.persons.findMany()
  }

  async findOne (id) {
    return await this.persons.findUnique({
      where: { idPessoa: Number(id) }
    })
  }

  async create (person) {
    return await this.persons.create({ data: person })
  }
}
