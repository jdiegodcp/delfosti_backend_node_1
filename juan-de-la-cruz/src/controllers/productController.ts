// @ts-nocheck
import asyncHandler from 'express-async-handler'
import { AppDataSource } from '../data-source'
import { Product } from '../entity/Product'
import { NewProduct } from '../types'
import { toNewProduct } from '../utils/methods'
import { ObjectId } from 'mongodb'

export const getProducts = asyncHandler(async (_request, response) => {
  const allProducts = await AppDataSource.getMongoRepository(Product).find({})
  return response.send(allProducts)
})

export const getProduct = asyncHandler(async (request, response) => {
  const results = await AppDataSource.getRepository(Product).findOneBy({
    _id: new ObjectId(request.params.id)
  })

  return results === null ? response.status(200).json({}) : response.send(results)
})

export const getProductByName = asyncHandler(async (request, response) => {
  const results = await AppDataSource.getRepository(Product).find({
    productName: request.params.id
  })

  return results === null ? response.status(200).json({}) : response.send(results)
})

export const saveProduct = asyncHandler(async (request, response) => {
  const newProduct: NewProduct = toNewProduct(request.body)
  try {
    const productInserted = AppDataSource.getMongoRepository(Product).create(newProduct)
    const results = await AppDataSource.getMongoRepository(Product).save(productInserted)
    return response.send(results)
  } catch (error) {
    throw new Error('Error', error.message)
  }
})
