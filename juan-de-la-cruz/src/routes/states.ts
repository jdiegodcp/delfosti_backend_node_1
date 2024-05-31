import express from 'express'
import { getState, getStates, saveStates } from '../controllers/stateController'
const router = express.Router()

router.get('/', getStates)

router.get('/:id', getState)

// router.get('/role/:id', getUserByRol)

router.post('/', saveStates)

export default router
