// @ts-nocheck
import asyncHandler from 'express-async-handler'
import { AppDataSource } from '../data-source'
import { User } from '../entity/User'
import { toNewUser } from '../utils/methods'
import { NewUserEntry } from '../types'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

export const getUsers = asyncHandler(async (_request, response) => {
  const allUsers = await AppDataSource.getMongoRepository(User).find({})
  return response.send(allUsers)
})

export const getUser = asyncHandler(async (request, response) => {
  const results = await AppDataSource.getRepository(User).findOneBy({
    _id: new ObjectId(request.params.id)
  })

  return results === null ? response.status(200).json({}) : response.send(results)
})

export const getUserByRol = asyncHandler(async (request, response) => {
  const results = await AppDataSource.getRepository(User).find({
    role: request.params.id
  })

  return results === null ? response.status(200).json({}) : response.send(results)
})

export const saveUser = asyncHandler(async (request, response) => {
  const { userName } = request.body
  const userExisting = await AppDataSource.getRepository(User).findOneBy({
    userName
  })
  if (userExisting !== null) {
    throw new Error('Username existing , choose a new username')
  }

  const newUser: NewUserEntry = toNewUser(request.body)
  const saltRounds = 10
  // It's necessary the await to let the process of hashing finish
  const passwordHash = await bcrypt.hash(newUser.passwordHash, saltRounds)
  newUser.passwordHash = passwordHash
  try {
    const userInserted = AppDataSource.getMongoRepository(User).create(newUser)
    const results = await AppDataSource.getMongoRepository(User).save(userInserted)
    return response.send(results)
  } catch (error) {
    throw new Error('Error', error.message)
  }
})
