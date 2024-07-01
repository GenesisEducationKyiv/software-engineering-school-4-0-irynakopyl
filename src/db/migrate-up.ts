import { exit } from 'process';
import { config } from '../config';
import migrate from 'node-pg-migrate';
import logger from '../common/services/logger.service';

const databaseConfig = config.db;

migrate({
  direction: 'up',
  migrationsTable: 'pgmigrations',
  databaseUrl: {
    user: databaseConfig.username,
    password: databaseConfig.password,
    port: databaseConfig.port,
    host: databaseConfig.host,
    database: databaseConfig.database,
  },
  dir: `${__dirname}/migrations`,
}).catch((error) => {
  logger.error(`Error when running migrate up: ${JSON.stringify(error)}`);
  exit(1);
});
