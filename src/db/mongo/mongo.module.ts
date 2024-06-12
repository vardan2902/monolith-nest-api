import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JobSnapshotModelDefinition } from 'src/modules/job-snapshot/schemas/job-snapshot.schema';

const models = MongooseModule.forFeature([JobSnapshotModelDefinition]);
export const mongoModule = MongooseModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('mongo.uri'),
  }),
  inject: [ConfigService],
});

@Module({
  imports: [mongoModule, models],
  exports: [mongoModule, models],
})
export class MongoModule {}
