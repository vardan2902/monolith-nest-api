import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PGDatabaseConnections } from 'src/db/pg/enums';
import { colorize } from 'src/config/log-utils';
import { AnsiColors } from 'src/config/enum';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey, PGDatabaseConnections.JOBS_0_12)
    private readonly apiKeyRepository: Repository<ApiKey>,
    private readonly logger: Logger,
  ) {}

  async getRequester(apiKey: string): Promise<string | void> {
    this.logger.log(
      `Checking API key: ${colorize(apiKey, AnsiColors.FgMagenta)}`,
      ApiKeysService.name,
    );
    const keyRecord = await this.apiKeyRepository.findOneBy({
      key: apiKey,
    });

    if (!keyRecord)
      return this.logger.error(
        `API key: ${colorize(apiKey, AnsiColors.FgRed)} not found`,
        ApiKeysService.name,
      );

    this.logger.log(
      `Checking API key: ${colorize(
        apiKey,
        AnsiColors.FgMagenta,
      )} - Found requester: ${colorize(
        keyRecord.requester,
        AnsiColors.FgYellow,
      )}`,
      ApiKeysService.name,
    );
    return keyRecord.requester;
  }

  async createApiKey(requester: string): Promise<string> {
    const apiKey = new ApiKey();
    apiKey.requester = requester;

    await this.apiKeyRepository.save(apiKey);

    return apiKey.key;
  }

  // TODO: Implement delete endpoint
  async deleteApiKey(apiKey: string, requester: string): Promise<void> {
    await this.apiKeyRepository.softDelete({
      key: apiKey,
      requester,
    });
  }
}
