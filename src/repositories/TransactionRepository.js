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

  async getTransactionsByAccount (accountId, params) {
    let filter = {}
    const { iniDate, endDate } = params

    if (iniDate && endDate) {
      filter = {
        dataTransacao: {
          gt: moment(iniDate).startOf('day').toISOString(),
          lt: moment(endDate).endOf('day').toISOString()
        }
      }
    }

    return await this.transactions.findMany({
      where: Object.assign(filter, {
        idConta: Number(accountId)
      })
    })
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
    return aggregation[0] ? aggregation[0]._sum.valor : 0
  }
}
