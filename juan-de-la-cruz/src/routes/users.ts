import express from 'express'
import { getUsers, saveUser, getUser, getUserByRol } from '../controllers/userController'
const router = express.Router()

router.get('/', getUsers)

router.get('/:id', getUser)

router.get('/role/:id', getUserByRol)

router.post('/', saveUser)

export default router
