import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PGDatabaseConnections } from 'src/db/pg/enums';
import { Job } from './entities/job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job, PGDatabaseConnections.JOBS_0_12)
    private readonly jobRepository0_12: Repository<Job>,
    @InjectRepository(Job, PGDatabaseConnections.JOBS_12_24)
    private readonly jobRepository12_24: Repository<Job>,
    private readonly logger: Logger,
  ) {}

  private getCurrentRepository(): Repository<Job> {
    const currentHourUTC = new Date().getUTCHours();
    return currentHourUTC >= 0 && currentHourUTC < 12
      ? this.jobRepository0_12
      : this.jobRepository12_24;
  }

  async addJob(requester: string) {
    this.logger.log(`Adding job for ${requester}`, JobService.name);
    const jobRepository = this.getCurrentRepository();
    return await jobRepository.save({ requester });
  }
}
