import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis as RedisClient } from 'ioredis';
import { RedisNamespaces } from './enums';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject(RedisNamespaces.SUBSCRIBER)
    private readonly subscriberClient: RedisClient,
    @Inject(RedisNamespaces.PUBLISHER)
    private readonly publisherClient: RedisClient,
    @Inject(RedisNamespaces.RATE_LIMIT)
    private readonly rateLimitClient: RedisClient,
  ) {}

  getSubscriberClient(): RedisClient {
    return this.subscriberClient;
  }

  getPublisherClient(): RedisClient {
    return this.publisherClient;
  }

  getRateLimitClient(): RedisClient {
    return this.rateLimitClient;
  }

  async onModuleDestroy() {
    await this.subscriberClient.quit();
    await this.publisherClient.quit();
    await this.rateLimitClient.quit();
  }
}
