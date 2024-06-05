import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export default MongooseModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>(`test.mongo.uri`),
  }),
  inject: [ConfigService],
});
