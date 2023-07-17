import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSetting } from './entity/user-setting.entity';
import { UserChatbot } from './entity/user-chatbot.entity';
import { AuthUserMeResponseDto } from './dto/AuthUserMeResponse.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
    @InjectRepository(UserChatbot)
    private readonly userChatbotResponseRepository: Repository<UserChatbot>,
  ) {}

  async findOneByThirdPartyId(thirdPartyId: string, provider: string) {
    return await this.userRepository.findOne({
      where: { thirdPartyId, provider },
    });
  }

  async registerOAuthUser(thirdPartyId: string, provider: string) {
    const user = new User();
    user.thirdPartyId = thirdPartyId;
    user.provider = provider;
    return await this.userRepository.save(user);
  }

  async me(id: number): Promise<AuthUserMeResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });

    const setting = await this.userSettingRepository.findOne({
      where: { id: user.userSetting.id },
    });

    const chatbot = await this.userChatbotResponseRepository.findOne({
      where: { id: user.userChatbot.id },
      relations: ['profilePicture', 'userProfilePicture'],
    });

    return {
      user: {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
      setting: {
        projectName: setting.projectName,
        basePrompt: setting.basePrompt,
        modelName: setting.modelName,
        temperature: setting.temperature,
        visibility: setting.visibility,
        domain: setting.domains,
      },
      chatbot: {
        id: chatbot.id,
        numberOfCharacters: chatbot.numberOfCharacters,
        startMessage: chatbot.startMessage,
        suggestedMessage: chatbot.suggestedMessage,
        theme: chatbot.theme,
        isShowProfile: chatbot.isShowProfile,
        displayName: chatbot.displayName,
        userMessageColor: chatbot.userMessageColor,
        isShowUserProfile: chatbot.isShowUserProfile,
        alignment: chatbot.alignment,
        profilePicture: chatbot.profilePicture,
        userProfilePicture: chatbot.userProfilePicture,
      },
    };
  }
}
