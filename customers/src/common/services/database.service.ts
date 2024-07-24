import Customer from '../db/models/customer.model';
import logger from './logger.service';
import { Sequelize } from 'sequelize-typescript';

export class DatabaseService {
  private sequelize: Sequelize;
  constructor(config: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  }) {
    this.sequelize = new Sequelize({
      dialect: 'postgres',
      ...config,
    });
    this.sequelize.addModels([Customer]);
  }

  public async authenticate(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      logger.info(`Connection has been established successfully.`);
    } catch (error) {
      logger.error(
        `Unable to connect to the database: ${JSON.stringify(error)}`
      );
      throw error;
    }
  }

  public async closeConnection(): Promise<void> {
    if (!this.sequelize) {
      logger.info('Connection was not established, nothing to close.');
      return;
    }
    try {
      await this.sequelize.close();
      logger.info('Connection has been closed successfully.');
    } catch (error) {
      logger.error(
        `Unable to connect to the database: ${JSON.stringify(error)}`
      );
      throw error;
    }
  }
}
