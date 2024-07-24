import { Table, Column, Model, AllowNull } from 'sequelize-typescript';
import { Currency } from '../../../rate/service/models/currency';
import { INTEGER } from 'sequelize';

@Table({ tableName: 'rates', modelName: 'rate' })
export default class Rate extends Model<Rate> {
  @AllowNull(false)
  @Column({ field: 'value' })
  value: number;

  @AllowNull(false)
  @Column({ field: 'created_at' })
  createdAt: Date;

  @AllowNull(false)
  @Column({ field: 'currency', type: INTEGER })
  currency: Currency;
}
