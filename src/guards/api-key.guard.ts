import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from 'src/modules/api-key/api-key.service';
import { RequestWithRequester } from 'src/types';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithRequester = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'] as string;

    if (!apiKey) throw new UnauthorizedException('API key is missing');

    const requester = await this.apiKeysService.getRequester(apiKey);
    if (!requester) throw new UnauthorizedException('Invalid API key');

    request.requester = requester;
    return true;
  }
}
