import AccountService from '../services/AccountService.js'

export default (app) => {
  app.get('/account/:id', async (req, res, next) => {
    try {
      const service = new AccountService()
      const result = await service.getOne(req.params.id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  })

  app.post('/account', async (req, res, next) => {
    try {
      const service = new AccountService()
      const result = await service.create(req.body)
      res.json(result)
    } catch (error) {
      next(error)
    }
  })
}
