// @ts-nocheck
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { AppDataSource } from '../data-source'
import { OrderState } from '../entity/OrderState'
import { OrderStates } from '../types'
import { toNewState } from '../utils/methods'
import { State } from '../enums'

const stateMap = new Map<State, { id: number, description: string }>([
  [State.POR_ATENDER, { id: 1, description: State.POR_ATENDER }],
  [State.EN_PROCESO, { id: 2, description: State.EN_PROCESO }],
  [State.EN_DELIVERY, { id: 3, description: State.EN_DELIVERY }],
  [State.RECIBIDO, { id: 4, description: State.RECIBIDO }]
])

export const getStates = asyncHandler(async (_request, response) => {
  const allUsers = await AppDataSource.getMongoRepository(OrderState).find({})
  return response.send(allUsers)
})

export const getState = asyncHandler(async (request, response) => {
  const results = await AppDataSource.getRepository(OrderState).find({
    orderNumber: request.params.id
  })

  return results === null ? response.status(200).json({}) : response.send(results)
})

export const saveStates = asyncHandler(async (request, response?) => {
  const filteredDocuments = await AppDataSource.getRepository(OrderState).find({
    orderNumber: request.body.orderNumber
  })
  const newState: OrderStates = toNewState(request.body)
  if (filteredDocuments.length === 0) {
    const updateInserted = AppDataSource.getMongoRepository(OrderState).create(newState)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const results = await AppDataSource.getMongoRepository(OrderState).save(updateInserted)
    return null
  } else {
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
          decodedToken = decoded
        }
      })
    } catch (error) {
      console.log(error)
    }
    if (token === null || decodedToken.userCode === null) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    newState.userCode = decodedToken.userCode

    const weightState: number[] = filteredDocuments.map((doc) => stateMap.get(doc.state).id)
    const max = Math.max(...weightState)
    if (stateMap.get(newState.state).id <= max) {
      throw new Error('Status sent incorrectly, insert a proper Status')
    } else {
      const updateInserted = AppDataSource.getMongoRepository(OrderState).create(newState)
      const resultsNewUpdate = await AppDataSource.getMongoRepository(OrderState).save(updateInserted)
      return response.send(resultsNewUpdate)
    }
  }
})
