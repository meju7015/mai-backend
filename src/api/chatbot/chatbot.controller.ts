import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponse } from '../../base/BaseResponse';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get(':chatbotId')
  @UseGuards(AuthGuard('jwt'))
  async findAllByUserId(@Param('chatbotId') chatbotId: string) {
    return BaseResponse.success(await this.chatbotService.findOne(chatbotId));
  }
}
