import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { entities_0_12, entities_12_24 } from './entities';
import { PGDatabaseConnections } from './enums';

export const getOrmConfig = (
  configService: ConfigService,
  db: string,
  prefix = '',
): TypeOrmModuleOptions => {
  prefix = prefix ? `${prefix}.` : '';
  const database = configService.get<string>(`${prefix}postgres.${db}.db`);
  return {
    name:
      db === '12_24'
        ? PGDatabaseConnections.JOBS_12_24
        : PGDatabaseConnections.JOBS_0_12,
    type: 'postgres',
    url: configService.get<string>(`${prefix}postgres.${db}.uri`),
    synchronize: false,
    host: configService.get<string>(`${prefix}postgres.${db}.host`),
    port: configService.get<number>(`${prefix}postgres.${db}.port`),
    username: configService.get<string>(`${prefix}postgres.${db}.user`),
    password: configService.get<string>(`${prefix}postgres.${db}.password`),
    database,
    schema: configService.get<string>(`${prefix}postgres.${db}.schema`),
    entities: db === '12_24' ? entities_12_24 : entities_0_12,
    migrationsTableName: 'migrations',
    migrations: [__dirname + `/dist/src/db/migrations/${database}/*.{t,j}s`],
    migrationsRun: true,
    migrationsTransactionMode: 'all',
    retryAttempts: 10,
    retryDelay: 10000,
    autoLoadEntities: true,
    ssl: configService.get<string>('node.env') === 'production',
  };
};

export const dynamicEntities_0_12 = TypeOrmModule.forFeature(
  [...entities_0_12],
  PGDatabaseConnections.JOBS_0_12,
);

export const dynamicEntities_12_24 = TypeOrmModule.forFeature(
  [...entities_12_24],
  PGDatabaseConnections.JOBS_12_24,
);

export const Jobs_0_12_Module = TypeOrmModule.forRootAsync({
  name: PGDatabaseConnections.JOBS_0_12,
  useFactory: (configService: ConfigService) =>
    getOrmConfig(configService, '0_12'),
  inject: [ConfigService],
});

export const Jobs_12_24_Module = TypeOrmModule.forRootAsync({
  name: PGDatabaseConnections.JOBS_12_24,
  useFactory: (configService: ConfigService) =>
    getOrmConfig(configService, '12_24'),
  inject: [ConfigService],
});

@Global()
@Module({
  imports: [
    Jobs_0_12_Module,
    Jobs_12_24_Module,
    dynamicEntities_0_12,
    dynamicEntities_12_24,
  ],
  exports: [
    Jobs_0_12_Module,
    Jobs_12_24_Module,
    dynamicEntities_0_12,
    dynamicEntities_12_24,
  ],
})
export class TypeOrmConfigModule {}
