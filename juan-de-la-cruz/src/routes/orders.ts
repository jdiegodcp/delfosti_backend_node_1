import express from 'express'
import { saveOrder, getOrders, getOrder, getOrderWithProductsDetails } from '../controllers/orderController'
const router = express.Router()

router.get('/detail', getOrderWithProductsDetails)

router.get('/', getOrders)

router.get('/:id', getOrder)

router.post('/', saveOrder)

export default router
