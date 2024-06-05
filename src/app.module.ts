import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { EventModule } from './modules/event/event.module';
import { HealthModule } from './modules/health/health.module';
import { RedisModule } from './redis/redis.module';
import { RateLimitingGuard } from './guards/rate-limiting.guard';
import { RateLimitingService } from './redis/rate-limiting.service';
import { JobModule } from './modules/job/job.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { DbModule } from './db/db.module';
import { JobSnapshotModule } from './modules/job-snapshot/job-snapshot.module';

@Module({
  imports: [
    AppConfigModule,
    DbModule,
    EventModule,
    HealthModule,
    RedisModule,
    JobModule,
    ApiKeyModule,
    JobSnapshotModule,
  ],
  providers: [RateLimitingGuard, RateLimitingService],
})
export class AppModule {}
