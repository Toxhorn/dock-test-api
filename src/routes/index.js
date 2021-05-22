import { Router } from 'express'
import person from '../controllers/PersonController.js'
import account from '../controllers/AccountController.js'
import transaction from '../controllers/TransactionController.js'

const router = Router()

person(router)
account(router)
transaction(router)

export default router
