import { Column, Entity } from 'typeorm';
import { BasePGEntity } from '../../../db/pg/base.entity';

@Entity('jobs')
export class Job extends BasePGEntity {
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ nullable: false })
  requester: string;
}
