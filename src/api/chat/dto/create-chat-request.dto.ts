import { IsString } from 'class-validator';

interface IChat {
  role: string;
  content: string;
}

export class CreateChatRequestDto {
  @IsString()
  namespace: string;

  @IsString()
  prompt: string;

  histories?: [string, string][];
}
