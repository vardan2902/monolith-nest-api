import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TooManyRequestsException } from 'src/exceptions/too-many-requests.exception';
import { RedisService } from './redis.service';
import { RateLimitingInterval } from './enums';

@Injectable()
export class RateLimitingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async incrementRequestCountOrThrow(apiKey: string): Promise<number> {
    const rateLimitClient = this.redisService.getRateLimitClient();
    const key = `${RateLimitingInterval.HOURLY}:${apiKey}`;
    const hourlyRequests = await rateLimitClient.incr(key);

    if (hourlyRequests === 1)
      await rateLimitClient.expire(
        key,
        this.configService.get<number>('rateLimit.hourly.expiresIn'),
      );

    if (
      hourlyRequests >
      this.configService.get<number>('rateLimit.hourly.maxRequests')
    )
      throw new TooManyRequestsException('Too many requests in the last hour.');

    return hourlyRequests;
  }

  async checkForRaceCondition(apiKey: string): Promise<void | number> {
    const rateLimitClient = this.redisService.getRateLimitClient();
    const key = `${RateLimitingInterval['5_MIN']}:${apiKey}`;
    const expiresIn = this.configService.get<number>(
      'rateLimit.5min.expiresIn',
    );

    const result = await rateLimitClient.setnx(key, 1);
    if (result === 1) return rateLimitClient.expire(key, expiresIn);

    throw new TooManyRequestsException(
      'Only one request is allowed every 5 minutes.',
    );
  }
}
