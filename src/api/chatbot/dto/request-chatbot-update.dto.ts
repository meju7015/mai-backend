import { Assets } from '../../asset/entity/asset.entity';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Models } from '../entity/chatbot-setting.entity';
import { Type } from 'class-transformer';
import { ChatbotTheme } from '../../user/entity/user-chatbot.entity';

export class RequestChatbotSetting {
  @IsString()
  projectName: string;

  @IsString()
  basePrompt: string;

  @IsEnum(Models)
  modelName: Models;

  @IsNumber()
  temperature: number;

  @IsBoolean()
  visibility: boolean;

  domains?: string;
}

export class RequestChatbotUpdate {
  numberOfCharacters: number;

  @IsString()
  startMessage: string;

  suggestedMessage?: string;

  @IsString()
  theme: ChatbotTheme;

  @IsBoolean()
  isShowProfile: boolean;

  @IsString()
  displayName: string;

  @IsString()
  userMessageColor: string;

  @IsBoolean()
  isShowUserProfile: boolean;

  @IsString()
  alignment: string;

  profilePicture?: Assets;
  userProfilePicture?: Assets;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RequestChatbotSetting)
  setting: RequestChatbotSetting;
}
