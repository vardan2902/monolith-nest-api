import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RateLimitingGuard } from 'src/guards/rate-limiting.guard';
import { RequestWithRequester } from 'src/types';
import { JobService } from './job.service';
import { EventNames } from '../event/enums';
import { EventEmitterRedisService } from 'src/modules/event/event-emitter-redis.service';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly eventEmitter: EventEmitterRedisService,
  ) {}

  @Post()
  @UseGuards(ApiKeyGuard, RateLimitingGuard)
  async addJob(@Req() { requester }: RequestWithRequester) {
    const job = await this.jobService.addJob(requester);
    this.eventEmitter.emit(EventNames.JOB_STARTED, job);
  }
}
