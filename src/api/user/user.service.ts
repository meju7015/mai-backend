import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChatbot } from './entity/user-chatbot.entity';
import { AuthUserMeResponseDto } from './dto/AuthUserMeResponse.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    const chatbots = await this.userChatbotResponseRepository.find({
      where: { user: { id: user.id } },
      relations: ['profilePicture', 'userProfilePicture'],
    });

    return {
      user: {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
      chatbots: chatbots.map((c) => ({
        id: c.id,
        numberOfCharacters: c.numberOfCharacters,
        startMessage: c.startMessage,
        suggestedMessage: c.suggestedMessage,
        theme: c.theme,
        isShowProfile: c.isShowProfile,
        displayName: c.displayName,
        userMessageColor: c.userMessageColor,
        isShowUserProfile: c.isShowUserProfile,
        alignment: c.alignment,
        profilePicture: c.profilePicture,
        userProfilePicture: c.userProfilePicture,
      })),
    };
  }
}
