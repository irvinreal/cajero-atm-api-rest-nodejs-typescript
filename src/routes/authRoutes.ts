import express from 'express'
import { getUserInfo, login, register } from '../controllers/authController'
import { auth } from '../middlewares/auth'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/my-account', auth, getUserInfo)

export default router
