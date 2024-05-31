import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm'
import { State } from '../enums'

@Entity()
export class OrderState {
  @ObjectIdColumn()
    _id: ObjectId

  @Column()
    orderNumber: string

  @Column()
    userCode: string

  @Column()
    state: State

  @Column()
    date: Date
}
