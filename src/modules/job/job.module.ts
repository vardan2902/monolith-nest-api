import { Logger, Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports: [ApiKeyModule],
  controllers: [JobController],
  providers: [JobService, Logger],
})
export class JobModule {}
