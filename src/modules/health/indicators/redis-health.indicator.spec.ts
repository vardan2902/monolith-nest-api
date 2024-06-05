import Redis from 'ioredis';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckError } from '@nestjs/terminus';
import { mock, MockProxy } from 'jest-mock-extended';
import { RedisService } from 'src/redis/redis.service';
import { RedisHealthIndicator } from './redis-health.indicator';

describe('RedisHealthIndicator', () => {
  let redisHealthIndicator: RedisHealthIndicator;
  let redisService: MockProxy<RedisService>;

  beforeEach(async () => {
    redisService = mock<RedisService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisHealthIndicator,
        { provide: RedisService, useValue: redisService },
      ],
    }).compile();

    redisHealthIndicator =
      module.get<RedisHealthIndicator>(RedisHealthIndicator);
  });

  it('should return healthy status if connected', async () => {
    const pingMock = jest.fn().mockResolvedValue('PONG');
    const mockedRedis = { ping: pingMock } as unknown as Redis;

    redisService.getSubscriberClient.mockReturnValue(mockedRedis);
    redisService.getPublisherClient.mockReturnValue(mockedRedis);
    redisService.getRateLimitClient.mockReturnValue(mockedRedis);

    const result = await redisHealthIndicator.isHealthy('redis');

    expect(result).toEqual({ redis: { status: 'up' } });
    expect(pingMock).toHaveBeenCalledTimes(3);
  });

  it('should throw HealthCheckError with message when redis is unhealthy', async () => {
    const pingMock = jest.fn().mockRejectedValue(new Error('Redis down'));
    const mockedRedis = { ping: pingMock } as unknown as Redis;

    redisService.getSubscriberClient.mockReturnValue(mockedRedis);
    redisService.getPublisherClient.mockReturnValue(mockedRedis);
    redisService.getRateLimitClient.mockReturnValue(mockedRedis);

    await expect(redisHealthIndicator.isHealthy('redis')).rejects.toThrow(
      HealthCheckError,
    );

    try {
      await redisHealthIndicator.isHealthy('redis');
    } catch (error) {
      expect(error).toBeInstanceOf(HealthCheckError);
      expect(error.causes).toEqual({
        redis: { status: 'down', message: 'Redis down' },
      });
    }

    expect(pingMock).toHaveBeenCalledTimes(2);
  });

  it('should throw HealthCheckError with timeout message when redis does not respond in time', async () => {
    const pingMock = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 10000)),
      );
    const mockedRedis = { ping: pingMock } as unknown as Redis;

    redisService.getSubscriberClient.mockReturnValue(mockedRedis);
    redisService.getPublisherClient.mockReturnValue(mockedRedis);
    redisService.getRateLimitClient.mockReturnValue(mockedRedis);

    await expect(redisHealthIndicator.isHealthy('redis')).rejects.toThrow(
      HealthCheckError,
    );

    try {
      await redisHealthIndicator.isHealthy('redis');
    } catch (error) {
      expect(error).toBeInstanceOf(HealthCheckError);
      expect(error.causes).toEqual({
        redis: { status: 'down', message: 'Redis ping timeout' },
      });
    }

    expect(pingMock).toHaveBeenCalledTimes(2);
  });
});
