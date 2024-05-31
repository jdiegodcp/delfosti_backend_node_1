
import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm'

@Entity()
export class Order {
  @ObjectIdColumn()
    orderNumber: ObjectId

  @Column()
    sellerCode: string

  @Column()
    productsList: String[]

  @Column()
    orderDate: Date
}
