import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { entities_0_12, entities_12_24 } from '../db/pg/entities';
import { join } from 'path';
import * as process from 'node:process';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config();

const createDataSourceOptions = (
  options: Omit<PostgresConnectionOptions, 'type'>,
): DataSourceOptions => ({
  type: 'postgres',
  ...options,
  migrations: [join(__dirname, `/../db/migrations/${options.database}/*.ts`)],
});

const jobs_0_12_DataSource = new DataSource(
  createDataSourceOptions({
    url: process.env.POSTGRES_URI_0_12,
    database: process.env.POSTGRES_DB_0_12,
    port: parseInt(process.env.POSTGRES_PORT_0_12, 10) || 5432,
    entities: entities_0_12,
    password: process.env.POSTGRES_PASSWORD_0_12,
    username: process.env.POSTGRES_USER_0_12,
    host: process.env.POSTGRES_HOST_0_12,
  }),
);
const jobs_12_24_DataSource = new DataSource(
  createDataSourceOptions({
    url: process.env.POSTGRES_URI_12_24,
    database: process.env.POSTGRES_DB_12_24,
    port: parseInt(process.env.POSTGRES_PORT_12_24, 10) || 5432,
    entities: entities_12_24,
    password: process.env.POSTGRES_PASSWORD_12_24,
    username: process.env.POSTGRES_USER_12_24,
    host: process.env.POSTGRES_HOST_12_24,
  }),
);

export { jobs_0_12_DataSource, jobs_12_24_DataSource };
