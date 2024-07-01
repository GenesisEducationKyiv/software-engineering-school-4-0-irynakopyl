import { sequelize } from '../../subscription/data-access/db/models/db';
import logger from './logger.service';

export class DatabaseService {
  public async authenticate(): Promise<void> {
    try {
      await sequelize.authenticate();
      logger.info(`Connection has been established successfully.`);
    } catch (error) {
      logger.error(`Unable to connect to the database: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async closeConnection(): Promise<void> {
    if (!sequelize) {
      logger.info('Connection was not established, nothing to close.');
      return;
    }
    try {
      await sequelize.close();
      logger.info('Connection has been closed successfully.');
    } catch (error) {
      logger.error(`Unable to connect to the database: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
