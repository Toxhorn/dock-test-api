import { Router } from 'express'
import person from '../controllers/PersonController.js'

const router = Router()

person(router)

export default router
