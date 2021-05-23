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

  app.get('/account/extract/:id', async (req, res, next) => {
    try {
      const service = new AccountService()
      const result = await service.getExtract(req.params.id, req.query)
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

  app.patch('/account/status/:accountId/:status', async (req, res, next) => {
    try {
      const status = req.params.status
      if (!['1', '0'].includes(status)) throw new Error('Account status must be 0 for deactivate or 1 for activate')
      const service = new AccountService()
      const result = await service.changeStatus(req.params.accountId, Boolean(status))
      res.json(result)
    } catch (error) {
      next(error)
    }
  })
}
