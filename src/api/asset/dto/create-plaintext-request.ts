import { IsString } from 'class-validator';

export class CreatePlaintextRequestDto {
  @IsString()
  plainText: string;
}
