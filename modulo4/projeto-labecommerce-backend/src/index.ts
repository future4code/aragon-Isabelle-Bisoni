import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ping } from './endpoints/ping'
import { createUser } from './endpoints/createUser'
import { getUsers } from './endpoints/getUsers'
import { insertProduct } from './endpoints/insertProduct'
import { getProducts } from './endpoints/getProducts'
import { registerPurchase } from './endpoints/registerPurchase'
import { getPurchases } from './endpoints/getPurchases'

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())

app.listen(process.env.PORT || 3003, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3003}`)
})

app.get("/ping", ping)

// Endpoint 1
app.post('/users', createUser)

// Endpoint 2
app.get('/users', getUsers)

// Endpoint 3
app.post('/products', insertProduct)

// Endpoint 4
app.get('/products', getProducts)

// Endpoint 5
app.post('/purchases', registerPurchase)

// Endpoint 6
app.get('/users/:user_id/purchases', getPurchases)