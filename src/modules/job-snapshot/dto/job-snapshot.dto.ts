import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class JobCreatedDto {
  @IsString()
  @IsNotEmpty()
  requester: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  timestamp: string;
}
