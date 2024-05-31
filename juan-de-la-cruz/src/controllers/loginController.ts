// @ts-nocheck
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { User } from '../entity/User'
import { AppDataSource } from '../data-source'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const loginApp = asyncHandler(async (request, response) => {
  const { body } = request
  const { userName, password } = body

  const user = await AppDataSource.getRepository(User).findOneBy({
    userName
  })
  const passwordConfirmed = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!((user !== null) && passwordConfirmed)) {
    response.status(401).json({
      error: 'invalid user or password'
    })
  }

  const userForToken = {
    userCode: user?.userCode,
    userName: user?.userName
  }

  const token = jwt.sign(userForToken, process.env.JWT_SECRET === null || process.env.JWT_SECRET === undefined ? '123' : process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7
  })
  response.send({
    name: user?.userName,
    cargo: user?.position,
    rol: user?.role,
    token
  })
})
