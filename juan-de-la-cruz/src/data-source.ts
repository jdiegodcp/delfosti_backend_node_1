import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Product } from './entity/Product'
import { Order } from './entity/Order'
import { User } from './entity/User'
import { OrderState } from './entity/OrderState'

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: "mongodb+srv://jdiegodcp:yA5bjQ2Oh3jfHrBz@cluster0.0k0crfg.mongodb.net/tracking-system?retryWrites=true&w=majority",
  database: 'tracking-system',
  synchronize: true,
  port: 27017,
  logging: false,
  entities: [Product, Order, User, OrderState],
  migrations: [],
  subscribers: []
})
