import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChatbot } from '../user/entity/user-chatbot.entity';
import { ChatbotSetting } from './entity/chatbot-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserChatbot, ChatbotSetting])],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
