import express from 'express'
import { loginApp } from '../controllers/loginController'
const router = express.Router()

router.post('/', loginApp)

export default router
