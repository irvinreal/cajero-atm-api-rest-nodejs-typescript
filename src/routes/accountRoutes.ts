import express from 'express'

import { deposit, transfer, withdraw } from '../controllers/accountController'
import { auth } from '../middlewares/auth'

const router = express.Router()

router.patch('/deposit', auth, deposit)

router.patch('/withdraw', auth, withdraw)

router.post('/transfer', auth, transfer)

export default router
