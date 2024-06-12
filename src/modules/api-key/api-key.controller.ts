import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeysService } from './api-key.service';
import { ApiKeyDto } from './dto/api-key.dto';

@Controller('api-key')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Api Key')
export class ApiKeyController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  async createApiKey(@Body() body: ApiKeyDto): Promise<string> {
    return await this.apiKeysService.createApiKey(body.userId);
  }
}
