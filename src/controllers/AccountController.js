export default (app) => {
  app.get('/account', (req, res, next) =>
    console.log('conta')
  )
}
