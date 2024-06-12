import { Entity, Column, Unique, Generated } from 'typeorm';
import { BasePGEntity } from '../../../db/pg/base.entity';

@Entity('api_keys')
@Unique(['key'])
export class ApiKey extends BasePGEntity {
  @Column()
  @Generated('uuid')
  key: string;

  @Column()
  requester: string;
}
