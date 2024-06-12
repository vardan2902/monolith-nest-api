import { Global, Logger, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitterRedisService } from './event-emitter-redis.service';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EventEmitterRedisService, Logger],
  exports: [EventEmitterRedisService],
})
export class EventModule {}
