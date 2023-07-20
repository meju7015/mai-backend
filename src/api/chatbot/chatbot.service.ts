import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserChatbot } from '../user/entity/user-chatbot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatbotSetting } from './entity/chatbot-setting.entity';
import { RequestChatbotUpdate } from './dto/request-chatbot-update.dto';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(UserChatbot)
    private readonly chatbotRepository: Repository<UserChatbot>,
    @InjectRepository(ChatbotSetting)
    private readonly settingRepository: Repository<ChatbotSetting>,
  ) {}

  async findAll(userId: number) {
    return await this.chatbotRepository.find({
      where: { user: { id: userId } },
      relations: ['profilePicture', 'userProfilePicture', 'setting'],
    });
  }

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

  async update(chatbotId: string, req: RequestChatbotUpdate) {
    try {
      const chatbot = await this.chatbotRepository.findOneOrFail({
        where: { id: chatbotId },
        relations: ['setting'],
      });

      const chatbotSetting = await this.settingRepository.findOneOrFail({
        where: { chatbot: { id: chatbotId } },
      });

      const { setting } = req;

      chatbot.startMessage = req.startMessage;
      chatbot.suggestedMessage = req.suggestedMessage;
      chatbot.theme = req.theme;
      chatbot.isShowProfile = req.isShowProfile;
      chatbot.displayName = req.displayName;
      chatbot.userMessageColor = req.userMessageColor;
      chatbot.isShowUserProfile = req.isShowUserProfile;
      chatbot.alignment = req.alignment;

      chatbotSetting.projectName = setting.projectName;
      chatbotSetting.basePrompt = setting.basePrompt;
      chatbotSetting.modelName = setting.modelName;
      chatbotSetting.temperature = setting.temperature;
      chatbotSetting.visibility = setting.visibility;

      if (setting?.domains) {
        chatbotSetting.domains = setting.domains;
      }

      chatbot.setting = chatbotSetting;

      await this.settingRepository.save(chatbotSetting);
      await this.chatbotRepository.save(chatbot);

      return chatbot;
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
