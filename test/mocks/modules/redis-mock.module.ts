import { Module, Global, Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';
import { RedisNamespaces } from 'src/redis/enums';
import { RedisService } from 'src/redis/redis.service';
import { RateLimitingService } from 'src/redis/rate-limiting.service';

const createRedisTestProvider = ({
  db,
  namespace,
}: {
  db: string;
  namespace: string;
}) => ({
  provide: namespace,
  useFactory: (configService: ConfigService): RedisClient =>
    new Redis({
      host: configService.get<string>('test.redis.host'),
      port: configService.get<number>('test.redis.port'),
      db: configService.get<number>(db),
      keyPrefix: namespace,
    }),
  inject: [ConfigService],
});

const redisTestProviders: Provider[] = [
  createRedisTestProvider({
    db: 'redis.pubSubDB',
    namespace: RedisNamespaces.SUBSCRIBER,
  }),
  createRedisTestProvider({
    db: 'redis.pubSubDB',
    namespace: RedisNamespaces.PUBLISHER,
  }),
  createRedisTestProvider({
    db: 'redis.rateLimitDB',
    namespace: RedisNamespaces.RATE_LIMIT,
  }),
  RedisService,
  RateLimitingService,
];

@Global()
@Module({
  providers: [...redisTestProviders, Logger],
  exports: [...redisTestProviders, Logger],
})
export class RedisMockModule {}
