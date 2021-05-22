import express from 'express'

import routes from './routes/index.js'

const { PORT = 4000 } = process.env

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-type,Accept,x-access-token'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

app.use(routes)

const clientErrorHandler = (err, req, res, next) => {
  console.log(err.message)
  res.status(500).json({ message: err.message || 'E500' })
}

app.use(clientErrorHandler)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
