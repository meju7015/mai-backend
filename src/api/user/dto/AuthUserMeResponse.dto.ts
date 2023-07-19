import { Assets } from '../../asset/entity/asset.entity';

export interface IChatbot {
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
}

export class AuthUserMeResponseDto {
  user: {
    id: number;
    createdAt: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
  };

  chatbots: IChatbot[];
}
