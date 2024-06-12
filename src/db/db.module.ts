import { Global, Module } from '@nestjs/common';
import { TypeOrmConfigModule } from './pg/typeorm.module';
import { MongoModule } from './mongo/mongo.module';

@Global()
@Module({
  imports: [TypeOrmConfigModule, MongoModule],
  exports: [TypeOrmConfigModule, MongoModule],
})
export class DbModule {}
