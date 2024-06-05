import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection as InjectMongooseConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Connection as MongooseConnection } from 'mongoose';
import { PGDatabaseConnections } from 'src/db/pg/enums';
import { RedisHealthIndicator } from './indicators/redis-health.indicator';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly mongo: MongooseHealthIndicator,
    @InjectDataSource(PGDatabaseConnections.JOBS_0_12)
    private readonly pg_0_12: DataSource,
    @InjectDataSource(PGDatabaseConnections.JOBS_12_24)
    private readonly pg_12_24: DataSource,
    @InjectMongooseConnection()
    private readonly mongoConnection: MongooseConnection,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('postgres_0_12', { connection: this.pg_0_12 }),
      () => this.db.pingCheck('postgres_12_24', { connection: this.pg_12_24 }),
      () => this.mongo.pingCheck('mongo', { connection: this.mongoConnection }),
      () => this.redis.isHealthy('redis'),
    ]);
  }

  @Get('postgres_0_12')
  @HealthCheck()
  checkPostgres0_12() {
    return this.health.check([
      () => this.db.pingCheck('postgres_0_12', { connection: this.pg_0_12 }),
    ]);
  }

  @Get('postgres_12_24')
  @HealthCheck()
  checkPostgres12_24() {
    return this.health.check([
      () => this.db.pingCheck('postgres_12_24', { connection: this.pg_12_24 }),
    ]);
  }

  @Get('mongo')
  @HealthCheck()
  checkMongo() {
    return this.health.check([
      () => this.mongo.pingCheck('mongo', { connection: this.mongoConnection }),
    ]);
  }

  @Get('redis')
  @HealthCheck()
  checkRedis() {
    return this.health.check([() => this.redis.isHealthy('redis')]);
  }
}
