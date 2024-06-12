import { TypeOrmModule } from '@nestjs/typeorm';
import { PGDatabaseConnections } from 'src/db/pg/enums';
import { ConfigService } from '@nestjs/config';
import { getOrmConfig } from 'src/db/pg/typeorm.module';

export const mock_jobs_12_24_module = TypeOrmModule.forRootAsync({
  name: PGDatabaseConnections.JOBS_12_24,
  useFactory: (configService: ConfigService) =>
    getOrmConfig(configService, '12_24', 'test'),
  inject: [ConfigService],
});

export const mock_jobs_0_12_module = TypeOrmModule.forRootAsync({
  name: PGDatabaseConnections.JOBS_0_12,
  useFactory: (configService: ConfigService) =>
    getOrmConfig(configService, '0_12', 'test'),
  inject: [ConfigService],
});
