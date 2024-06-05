import Redis, { Redis as RedisClient } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import { RedisNamespaces } from '../enums';
import { RedisService } from '../redis.service';
import { RateLimitingService } from '../rate-limiting.service';

const createRedisProvider = ({
  db,
  namespace,
}: {
  db: string;
  namespace: string;
}): Provider => ({
  provide: namespace,
  useFactory: (configService: ConfigService): RedisClient =>
    new Redis({
      username: configService.get<string>('redis.username'),
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      password: configService.get<string>('redis.password'),
      db: configService.get<number>(db),
      keyPrefix: namespace,
    }),
  inject: [ConfigService],
});

const redisProviders: Provider[] = [
  createRedisProvider({
    db: 'redis.pubSubDB',
    namespace: RedisNamespaces.SUBSCRIBER,
  }),
  createRedisProvider({
    db: 'redis.pubSubDB',
    namespace: RedisNamespaces.PUBLISHER,
  }),
  createRedisProvider({
    db: 'redis.rateLimitDB',
    namespace: RedisNamespaces.RATE_LIMIT,
  }),
  RedisService,
  RateLimitingService,
];

export default redisProviders;
