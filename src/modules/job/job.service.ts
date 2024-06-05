import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { InjectCurrentRepository } from 'src/decorators/dynamic-repository.decorator';

@Injectable()
export class JobService {
  constructor(
    @InjectCurrentRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly logger: Logger,
  ) {}

  async addJob(requester: string) {
    this.logger.log(`Adding job for ${requester}`, JobService.name);
    return await this.jobRepository.save({ requester });
  }
}
