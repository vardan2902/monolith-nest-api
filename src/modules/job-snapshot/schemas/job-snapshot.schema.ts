import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class JobSnapshot {
  @ApiProperty()
  @Prop()
  timestamp: string;

  @ApiProperty()
  @Prop()
  clientId: string;
}

export const JobSnapshotSchema = SchemaFactory.createForClass(JobSnapshot);

export const JobSnapshotModelDefinition: ModelDefinition = {
  name: JobSnapshot.name,
  schema: JobSnapshotSchema,
};
