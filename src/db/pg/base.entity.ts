import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class BasePGEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({
    nullable: false,
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({
    nullable: true,
    type: 'timestamp without time zone',
    default: null,
  })
  deleted_at: Date | null;
}
