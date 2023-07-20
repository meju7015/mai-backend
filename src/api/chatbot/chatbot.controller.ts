import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponse } from '../../base/BaseResponse';
import { RequestChatbotUpdate } from './dto/request-chatbot-update.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req) {
    const { user } = req;
    return BaseResponse.success(await this.chatbotService.findAll(user.id));
  }

  @Get(':chatbotId')
  @UseGuards(AuthGuard('jwt'))
  async findAllByUserId(@Param('chatbotId') chatbotId: string) {
    return BaseResponse.success(await this.chatbotService.findOne(chatbotId));
  }

  @Put(':chatbotId')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('chatbotId') chatbotId: string,
    @Body() req: RequestChatbotUpdate,
  ) {
    return BaseResponse.success(
      await this.chatbotService.update(chatbotId, req),
    );
  }
}
