import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChatbot } from './entity/user-chatbot.entity';

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
}
