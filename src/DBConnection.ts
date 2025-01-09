import mongoose from 'mongoose'
import app from './index'

const PORT = process.env.PORT ?? 3500

function DBConnection() {
  mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
      app.listen(PORT)
      console.log(`Server running in PORT: ${PORT}`)
    })
    .catch(err => console.log('__', err))
}

export default DBConnection
