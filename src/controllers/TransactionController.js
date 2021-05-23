import TransactionService from '../services/TransactionService.js'

export default (app) => {
  app.post('/transaction/:type', async (req, res, next) => {
    try {
      const operation = req.params.type
      const service = new TransactionService()

      if (!['withdraw', 'deposit'].includes(operation)) throw new Error('Transaction type must be withdraw or deposit')

      const result = await service.transaction(req.body, operation)

      res.json(result)
    } catch (error) {
      next(error)
    }
  })
}
