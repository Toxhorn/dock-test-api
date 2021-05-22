import { Router } from 'express'
import person from '../controllers/PersonController.js'
import account from '../controllers/AccountController.js'

const router = Router()

person(router)
account(router)

export default router
