import TransactionService from '../services/TransactionService.js'

export default (app) => {
  app.post('/transaction/deposit', async (req, res, next) => {
    try {
      const service = new TransactionService()
      const result = await service.transaction(req.body, 'deposit')
      res.json(result)
    } catch (error) {
      next(error)
    }
  })

  app.post('/transaction/withdraw', async (req, res, next) => {
    try {
      const service = new TransactionService()
      const result = await service.transaction(req.body, 'withdraw')
      res.json(result)
    } catch (error) {
      next(error)
    }
  })
}
