
import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm'

@Entity()
export class Product {
  @ObjectIdColumn()
    sku: ObjectId

  @Column()
    productName: string

  @Column()
    productType: string

  @Column()
    tags: string

  @Column()
    price: number

  @Column()
    measurementUnit: string
}
