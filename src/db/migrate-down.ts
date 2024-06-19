import { exit } from 'process';
import { config } from '../config';
import migrate from 'node-pg-migrate';

const databaseConfig = config.db;
migrate({
  direction: 'down',
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
  console.error('Error when running migrate down ', error);
  exit(1);
});
