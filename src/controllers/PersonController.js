import PersonSevice from '../services/PersonService.js'

export default (app) => {
  app.get('/person', async (req, res, next) => {
    try {
      const personService = new PersonSevice()
      const result = await personService.getAll()
      res.json(result)
    } catch (error) {
      next(error)
    }
  })

  app.get('/person/:id', async (req, res, next) => {
    try {
      const personService = new PersonSevice()
      const result = await personService.getOne(req.params.id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  })

  app.post('/person', async (req, res, next) => {
    try {
      const personService = new PersonSevice()
      const result = await personService.create(req.body)
      res.json(result)
    } catch (error) {
      next(error)
    }
  })
}
