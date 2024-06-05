import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  private async pingWithTimeout(client: any, timeout: number): Promise<string> {
    return Promise.race([
      client.ping(),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Redis ping timeout')), timeout),
      ),
    ]);
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const timeout = 1000;

    try {
      await this.pingWithTimeout(
        this.redisService.getSubscriberClient(),
        timeout,
      );
      await this.pingWithTimeout(
        this.redisService.getPublisherClient(),
        timeout,
      );
      await this.pingWithTimeout(
        this.redisService.getRateLimitClient(),
        timeout,
      );

      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'RedisHealthCheck failed',
        this.getStatus(key, false, { message: error.message }),
      );
    }
  }
}
