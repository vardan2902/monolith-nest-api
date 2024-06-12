import { Logger, Module } from '@nestjs/common';
import { ApiKeyController } from './api-key.controller';
import { ApiKeysService } from './api-key.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeysService, ApiKeyGuard, Logger],
  exports: [ApiKeysService, ApiKeyGuard],
})
export class ApiKeyModule {}
