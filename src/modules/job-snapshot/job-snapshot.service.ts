import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { TraceOnEvent } from 'src/decorators/trace-on-event.decorator';
import { JobSnapshot } from './schemas/job-snapshot.schema';
import { JobCreatedDto } from './dto/job-snapshot.dto';
import { EventNames } from '../event/enums';

@Injectable()
export class JobSnapshotService {
  constructor(
    @InjectModel(JobSnapshot.name)
    private readonly jobSnapshotModel: Model<JobSnapshot>,
  ) {}

  @TraceOnEvent(EventNames.JOB_STARTED)
  async handleJobStarted(data: JobCreatedDto) {
    const jobSnapshot = new this.jobSnapshotModel({
      ...data,
      clientId: data.requester,
    });

    await jobSnapshot.save();
  }
}
