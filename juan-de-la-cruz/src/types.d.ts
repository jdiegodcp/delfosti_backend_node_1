import { UserRole, OrderState } from './enums'

export interface Product {
  sku: string
  productName: string
  productType: string
  tags: string
  price: number
  measurementUnit: string
}

export interface User {
  userCode: string
  userName: string
  passwordHash: String
  email: string
  phone: string
  position: string
  role: UserRole
}

export interface Order {
  orderNumber: string
  sellerCode: string
  productsList: string[]
  orderDate: Date
}

export interface OrderStates {
  orderNumber: string
  userCode: string
  state: OrderState
  date: Date
}

export type NewOrderEntry = Omit<Order, 'orderNumber', 'orderDate'>

export type NewUserEntry = Omit<User, 'userCode'>

export type NewProduct = Omit<Product, 'sku'>
