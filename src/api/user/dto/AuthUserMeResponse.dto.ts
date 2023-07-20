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
  jwt: string;
}
