import { Table, Column, Model, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'subscriptions', modelName: 'subscription' })
export default class Subscription extends Model<Subscription> {
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
}
