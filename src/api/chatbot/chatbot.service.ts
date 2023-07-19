import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserChatbot } from '../user/entity/user-chatbot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatbotSetting } from './entity/chatbot-setting.entity';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(UserChatbot)
    private readonly chatbotRepository: Repository<UserChatbot>,
    @InjectRepository(ChatbotSetting)
    private readonly settingRepository: Repository<ChatbotSetting>,
  ) {}

  async findOne(chatbotId: string) {
    try {
      const chatbot = await this.chatbotRepository.findOneOrFail({
        where: { id: chatbotId },
        relations: ['profilePicture', 'userProfilePicture', 'setting'],
      });

      return chatbot;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async findAllByUserId(userId: number) {
    return await this.chatbotRepository.find({
      where: { user: { id: userId } },
      relations: ['profilePicture', 'userProfilePicture'],
    });
  }
}
