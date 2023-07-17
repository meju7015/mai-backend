import { Assets } from '../../asset/entity/asset.entity';

export class AuthUserMeResponseDto {
  user: {
    id: number;
    createdAt: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
  };

  setting: {
    projectName: string;
    basePrompt: string;
    modelName: string;
    temperature: number;
    visibility: boolean;
    domain?: string;
  };

  chatbot: {
    id: string;
    numberOfCharacters: number;
    startMessage?: string;
    suggestedMessage?: string;
    theme: string;
    isShowProfile: boolean;
    displayName: string;
    userMessageColor: string;
    isShowUserProfile: boolean;
    alignment: string;
    profilePicture?: Assets;
    userProfilePicture?: Assets;
  };
}
