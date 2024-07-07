import { Sequelize } from 'sequelize-typescript';
import Subscription from './subscription.model';
import Rate from './rate.model';

export let sequelize: Sequelize;
export async function connectToDatabase(config: { host: string; port: number; database: string; username: string; password: string }) {
  sequelize = new Sequelize({
    dialect: 'postgres',
    ...config,
  });
  sequelize.addModels([Subscription, Rate]);
}
