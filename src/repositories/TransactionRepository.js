import moment from 'moment'
import Prisma from '@prisma/client'

const { PrismaClient } = Prisma

export default class AccountRepository {
  constructor () {
    this.transactions = new PrismaClient().transacao
  }

  async create (transaction) {
    return await this.transactions.create({ data: transaction })
  }

  async getTodayTotalWithdraw (accountId) {
    const aggregation = await this.transactions.groupBy({
      by: ['idConta'],
      where: {
        idConta: accountId,
        tipoTransacao: 0,
        dataTransacao: {
          gt: moment().startOf('day').toISOString(),
          lt: moment().endOf('day').toISOString()
        }
      },
      _sum: {
        valor: true
      }
    })
    return aggregation[0]._sum.valor
  }
}
