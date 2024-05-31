import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm'

@Entity()
export class User {
  @ObjectIdColumn()
    userCode: ObjectId

  @Column({ unique: true })
    userName: string

  @Column()
    passwordHash: string

  @Column()
    email: string

  @Column()
    phone: string

  @Column()
    position: string

  @Column()
    role: string
}
