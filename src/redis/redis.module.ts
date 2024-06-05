import { Module, Global } from '@nestjs/common';
import redisProviders from './providers/redis.provider';

@Global()
@Module({
  providers: [...redisProviders],
  exports: [...redisProviders],
})
export class RedisModule {}
