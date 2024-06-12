import { Logger, Module } from '@nestjs/common';
import { JobSnapshotService } from './job-snapshot.service';

@Module({
  providers: [JobSnapshotService, Logger],
})
export class JobSnapshotModule {}
