import { State, UserRole } from '../enums'
import { NewOrderEntry, NewProduct, NewUserEntry, OrderStates } from '../types'

const isString = (value: any): value is string => typeof value === 'string'

const isArrayOfStrings = (arr: any): arr is string[] => {
  return Array.isArray(arr) && arr.every(item => isString(item))
}

const parseValue = (value: any, fieldName: string): string => {
  if (!isString(value)) {
    throw new Error(`Incorrect or missing ${fieldName}`)
  }
  return value
}

const parseArray = (arrayFromRequest: any): string[] => {
  if (!isArrayOfStrings(arrayFromRequest)) {
    throw new Error('Incorrect or missing Array')
  }
  return arrayFromRequest
}

const parseRole = (roleInput: any): UserRole => {
  if (!isString(roleInput) || !Object.values(UserRole).includes(roleInput as UserRole)) {
    throw new Error('Incorrect or missing Role')
  }
  return roleInput as UserRole
}

const parsePrice = (priceField: any): number => {
  if (isNaN(priceField)) {
    throw new Error('Incorrect or missing Price')
  }
  return priceField
}

const parseState = (stateIn: any): State => {
  if (!isString(stateIn) || !Object.values(State).includes(stateIn as State)) {
    throw new Error('Incorrect or missing Status')
  }
  return stateIn as State
}

export const toNewOrder = (object: any): NewOrderEntry => {
  return {
    sellerCode: parseValue(object.sellerCode, 'SellerCode'),
    productsList: parseArray(object.productsList),
    orderDate: new Date((new Date()).getTime() - (5 * 60 * 60 * 1000))
  }
}

export const toNewUser = (object: any): NewUserEntry => {
  return {
    userName: parseValue(object.userName, 'UserName'),
    passwordHash: parseValue(object.passwordHash, 'PasswordHash'),
    email: parseValue(object.email, 'Email'),
    phone: parseValue(object.phone, 'Phone'),
    position: parseValue(object.position, 'Position'),
    role: parseRole(object.role)
  }
}
export const toNewProduct = (object: any): NewProduct => {
  return {
    productName: parseValue(object.productName, 'Product Name'),
    productType: parseValue(object.productType, 'Product Type'),
    tags: parseValue(object.tags, 'Tags'),
    price: parsePrice(object.price),
    measurementUnit: parseValue(object.measurementUnit, 'Measurement Unit')
  }
}
export const toNewState = (object: any): OrderStates => {
  return {
    orderNumber: parseValue(object.orderNumber, 'Order Number'),
    userCode: parseValue(object.userCode, 'User Code'),
    state: parseState(object.state),
    date: new Date((new Date()).getTime() - (5 * 60 * 60 * 1000))
  }
}
