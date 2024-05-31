import express from 'express'
import { getProducts, getProduct, getProductByName, saveProduct } from '../controllers/productController'
const router = express.Router()

router.get('/', getProducts)

router.get('/:id', getProduct)

router.get('/name/:id', getProductByName)

router.post('/', saveProduct)

export default router
