import PersonService from '../services/PersonService.js'

export default (app) => {
  app.get('/person', async (req, res, next) => {
    try {
      const service = new PersonService()
      const result = await service.getAll()
      res.json(result)
    } catch (error) {
      next(error)
    }
  })

  app.get('/person/:id', async (req, res, next) => {
    try {
      const service = new PersonService()
      const result = await service.getOne(req.params.id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  })

  app.post('/person', async (req, res, next) => {
    try {
      const service = new PersonService()
      const result = await service.create(req.body)
      res.json(result)
    } catch (error) {
      next(error)
    }
  })
}
