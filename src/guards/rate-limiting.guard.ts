import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RateLimitingService } from 'src/redis/rate-limiting.service';
import { TooManyRequestsException } from 'src/exceptions/too-many-requests.exception';

@Injectable()
export class RateLimitingGuard implements CanActivate {
  constructor(private readonly rateLimitingService: RateLimitingService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'] as string;

    if (!apiKey) throw new TooManyRequestsException('API key is missing');

    await this.rateLimitingService.checkForRaceCondition(apiKey);
    await this.rateLimitingService.incrementRequestCountOrThrow(apiKey);

    return true;
  }
}
