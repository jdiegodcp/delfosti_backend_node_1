// @ts-nocheck
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { AppDataSource } from '../data-source'
import { Order } from '../entity/Order'
import { toNewOrder } from '../utils/methods'
import { NewOrderEntry } from '../types'
import { ObjectId } from 'mongodb'
import { Product } from '../entity/Product'
import dotenv from 'dotenv'
import path from 'path'
import { saveStates } from '../controllers/stateController'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const getOrders = asyncHandler(async (_request, response) => {
  const allOrders = await AppDataSource.getMongoRepository(Order).find({})
  return response.send(allOrders)
})

export const getOrder = asyncHandler(async (request, response) => {
  const results = await AppDataSource.getRepository(Order).findOneBy({
    _id: new ObjectId(request.params.id)
  })

  return results === null ? response.status(200).json({}) : response.send(results)
})

export const saveOrder = asyncHandler(async (request, response) => {
  const authorization = request.get('authorization')
  let token = ''
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (authorization !== null && authorization.toLowerCase().startsWith('bearer') !== null) {
    token = authorization.substring(7)
  }
  let decodedToken
  try {
    jwt.verify(token, process.env.JWT_SECRET === null || process.env.JWT_SECRET === undefined ? '123' : process.env.JWT_SECRET, (err, decoded) => {
      if (err != null) {
        console.error('Token verification failed:', err)
      } else {
        console.log('Decoded Payload:', decoded)
        decodedToken = decoded
      }
    })
  } catch (error) {
    console.log(error)
  }
  if (token === null || decodedToken.userCode === null) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const newOrder: NewOrderEntry = toNewOrder(request.body)
  newOrder.sellerCode = decodedToken.userCode
  try {
    const orderInserted = AppDataSource.getMongoRepository(Order).create(newOrder)
    const results = await AppDataSource.getMongoRepository(Order).save(orderInserted)

    const stateSave = { ...request }
    const responseSave = { ...response }
    stateSave.body.orderNumber = await results.orderNumber.toString()
    stateSave.body.userCode = newOrder.sellerCode
    stateSave.body.state = 'Por atender'
    saveStates(stateSave, responseSave)
    return response.send(results)
  } catch (error) {
    throw new Error('Error')
  }
})

export const getOrderWithProductsDetails = asyncHandler(async (_request, response) => {
  const allOrders = await AppDataSource.getMongoRepository(Order).find({})
  const filteredDocuments = allOrders === null ? [{}] : allOrders

  if (filteredDocuments.length === 0) {
    return response.status(200).json({})
  }

  const orderInDetail = { ...filteredDocuments }

  for (let index = 0; index < filteredDocuments.length; index++) {
    const results: Product[] = []
    for (const document of filteredDocuments[index].productsList) {
      const result = await AppDataSource.getMongoRepository(Product).find({ where: { _id: new ObjectId(document) } })
      if (result !== null) {
        results.push(result)
      }
    }
    orderInDetail[index].productsList = results
  }

  return response.send(Object.values(orderInDetail))
})
