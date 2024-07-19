import {
  Table,
  Column,
  Model,
  AllowNull,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'customers', modelName: 'customer' })
export default class Customer extends Model<Customer> {
  @PrimaryKey
  @AllowNull(false)
  @Column({ field: 'id' })
  id: string;

  @AllowNull(false)
  @Column({ field: 'email' })
  email: string;

  @AllowNull(false)
  @Column({ field: 'created_at' })
  createdAt: Date;

  @AllowNull(true)
  @Column({ field: 'deleted_at' })
  deletedAt: Date;
}
