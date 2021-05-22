import Prisma from '@prisma/client'
const { PrismaClient } = Prisma

export default class AccountRepository {
  constructor () {
    this.accounts = new PrismaClient().conta
  }

  async findOne (id) {
    return await this.accounts.findUnique({
      where: { idConta: Number(id) }
    })
  }

  async findByPerson (personId) {
    return await this.accounts.findFirst({
      where: { idPessoa: Number(personId) }
    })
  }

  async create (account) {
    return await this.accounts.create({ data: account })
  }
}
