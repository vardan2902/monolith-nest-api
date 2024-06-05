import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisService } from 'src/redis/redis.service';
import { EmitterChannels, EmitterEvents, EventNames } from './enums';
import { colorize } from 'src/config/log-utils';
import { AnsiColors } from 'src/config/enum';

@Injectable()
export class EventEmitterRedisService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    const subscriber = this.redisService.getSubscriberClient();

    subscriber.on(EmitterEvents.MESSAGE, (channel, message) => {
      const eventData: { event: string; data: any } = JSON.parse(message);
      this.logger.log(
        `Received event from redis, emitting...\nevent: ${colorize(
          eventData.event,
          AnsiColors.FgMagenta,
        )}\ndata: ${colorize(
          JSON.stringify(eventData.data, null, 2),
          AnsiColors.FgYellow,
        )}`,
        EventEmitterRedisService.name,
      );
      const { event, data } = JSON.parse(message);
      this.eventEmitter.emit(event, data);
    });

    await subscriber.subscribe(EmitterChannels.EVENTS);
  }

  emit<T>(event: EventNames, data: T) {
    this.logger.log(
      `Publishing event to redis...\nevent: ${colorize(
        event,
        AnsiColors.FgMagenta,
      )}\ndata: ${colorize(
        JSON.stringify(data, null, 2),
        AnsiColors.FgYellow,
      )}`,
      EventEmitterRedisService.name,
    );
    const publisher = this.redisService.getPublisherClient();
    publisher.publish(EmitterChannels.EVENTS, JSON.stringify({ event, data }));
  }

  on<T>(event: EventNames, handler: (data: T) => void) {
    this.logger.log(`Listening event: ${event}`, EventEmitterRedisService.name);
    this.eventEmitter.on(event, handler);
  }
}
