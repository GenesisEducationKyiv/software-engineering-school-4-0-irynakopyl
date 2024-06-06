import { sequelize } from '../db/models/db';

export class DatabaseService {
  public async authenticate(): Promise<void> {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  public async closeConnection(): Promise<void> {
    if (!sequelize) {
      console.log('Connection was not established, nothing to close.');
      return;
    }
    try {
      await sequelize.close();
      console.log('Connection has been closed successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }
}
