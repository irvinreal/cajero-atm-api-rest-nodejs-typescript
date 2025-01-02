import mongoose from 'mongoose'
import app from './app'

const PORT = process.env.PORT ?? 3000

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    app.listen(PORT)
    console.log(`Server running in PORT: ${PORT}`)
  })
  .catch((err) => console.log('__', err))
