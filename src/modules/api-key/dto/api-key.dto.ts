import { IsNotEmpty, IsString } from 'class-validator';

export class ApiKeyDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
