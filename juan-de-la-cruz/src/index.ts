import express from 'express'
import orderRouter from './routes/orders'
import userRouter from './routes/users'
import productRouter from './routes/products'
import stateRouter from './routes/states'
import loginRouter from './routes/login'
import dotenv from 'dotenv'
import path from 'path'
import { AppDataSource } from './data-source'

dotenv.config({ path: path.resolve(__dirname, '../.env') })
const PORT = process.env.PORT === null || process.env.PORT === undefined ? 3000 : process.env.PORT

const app = express()
app.use(express.json())

// Timezone should be the default International timezone
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })

app.use('/api/orders', orderRouter)

app.use('/api/users', userRouter)

app.use('/api/products', productRouter)

app.use('/api/states', stateRouter)

app.use('/api/login', loginRouter)

app.listen(PORT, () => {
  console.log(`Servidor está en el puerto ${PORT}`)
})
