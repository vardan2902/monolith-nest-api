import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { winstonConfig } from 'src/config/winston.config';
import { WinstonModule } from 'nest-winston';
import { Jobs_0_12_Module, Jobs_12_24_Module } from 'src/db/pg/typeorm.module';
import { mongoModule } from 'src/db/mongo/mongo.module';
import { RedisModule } from 'src/redis/redis.module';
import { RedisMockModule } from './mocks/modules/redis-mock.module';
import mongoMockModule from './mocks/modules/mongo-mock.module';
import {
  mock_jobs_0_12_module,
  mock_jobs_12_24_module,
} from './mocks/modules/typeorm-mock.module';

const checkForHealthResponseFields = (body: any) => {
  expect(body).toHaveProperty('status');
  expect(body).toHaveProperty('info');
  expect(body).toHaveProperty('error');
  expect(body).toHaveProperty('details');
};

const checkForHealthDetailProperties = (details: any) => {
  expect(details).toHaveProperty('postgres_0_12');
  expect(details).toHaveProperty('postgres_12_24');
  expect(details).toHaveProperty('mongo');
  expect(details).toHaveProperty('redis');
};

const checkForErrorLogging = (
  status: 'ok' | 'error',
  error: any,
  loggerSpy: jest.SpyInstance,
) => {
  if (status === 'error') {
    expect(Object.keys(error).length).toBeGreaterThan(0);
    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('Health check errors'),
      expect.anything(),
    );
  } else {
    expect(Object.keys(error).length).toBe(0);
  }
};

const checkForServiceHealth = (
  response: any,
  service: string,
  loggerSpy: jest.SpyInstance,
) => {
  checkForHealthResponseFields(response.body);

  const { status, info, error, details } = response.body;

  expect(['ok', 'error']).toContain(status);
  expect(info).toHaveProperty(service);
  expect(details).toHaveProperty(service);
  checkForErrorLogging(status, error, loggerSpy);
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let loggerSpy: jest.SpyInstance;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(Jobs_0_12_Module)
      .useModule(mock_jobs_0_12_module)
      .overrideModule(Jobs_12_24_Module)
      .useModule(mock_jobs_12_24_module)
      .overrideModule(mongoModule)
      .useModule(mongoMockModule)
      .overrideModule(RedisModule)
      .useModule(RedisMockModule)
      .setLogger(WinstonModule.createLogger(winstonConfig))
      .compile();

    app = moduleFixture.createNestApplication();
    loggerSpy = jest.spyOn(WinstonModule.createLogger(winstonConfig), 'error');
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    jest.restoreAllMocks();
  });

  describe('HealthController ❤️', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    it('/health (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      checkForHealthResponseFields(response.body);

      const { status, info, error, details } = response.body;

      expect(['ok', 'error']).toContain(status);
      checkForHealthDetailProperties(info);
      checkForHealthDetailProperties(details);
      checkForErrorLogging(status, error, loggerSpy);
    });

    it('/health/postgres_0_12 (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/postgres_0_12')
        .expect(200);

      checkForServiceHealth(response, 'postgres_0_12', loggerSpy);
    });

    it('/health/postgres_12_24 (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/postgres_12_24')
        .expect(200);

      checkForServiceHealth(response, 'postgres_12_24', loggerSpy);
    });

    it('/health/mongo (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/mongo')
        .expect(200);

      checkForServiceHealth(response, 'mongo', loggerSpy);
    });

    it('/health/redis (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/redis')
        .expect(200);

      checkForServiceHealth(response, 'redis', loggerSpy);
    });
  });
  // TODO: Add more tests for other services
});
