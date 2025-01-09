import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import accountRoutes from './routes/accountRoutes'
import authRoutes from './routes/authRoutes'
import DBConnection from './DBConnection'
import buildLogger from './plugins/logger'

const PORT = process.env.PORT ?? 3000
const ACCEPTED_ORIGINS = [
  'https://landing-cajero-atm.vercel.app/',
  'https://landing-cajero-atm.vercel.app/login',
  'https://landing-cajero-atm.vercel.app/register',
  '*'
]

dotenv.config()

const app = express()

// const logger = buildLogger('index.ts')
// logger.log('hola mundo')
// logger.error('Este es un error...')

app.use(bodyParser.json())
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Referer', )
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

// DBConnection()
// Todo: change MONGODB -> json file

const newUserCamila = {
  name: 'camila',
  password: 'camilita',
  amount: 0
}

// const newUserFernando = {
//   name: 'fernando',
//   password: 'fer12345',
//   amount: 25000
// }

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`)
  // createUser(newUserCamila)
})
