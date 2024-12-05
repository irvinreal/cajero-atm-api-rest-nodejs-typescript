import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import accountRoutes from './routes/accountRoutes'
import authRoutes from './routes/authRoutes'

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Routes
// Crear cuenta ( Autenticación )
app.use('/auth', authRoutes)
// Movimientos ( Depositos, Retiros, Transferencias )
app.use('/auth/my-account', accountRoutes)

export default app
