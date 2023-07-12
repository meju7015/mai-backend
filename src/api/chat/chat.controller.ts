import { Body, Controller, Post, Sse } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatRequestDto } from './dto/create-chat-request.dto';
import { Subject } from 'rxjs';
import { SseService } from '../../modules/sse/sse.service';
import { BaseResponse } from '../../base/BaseResponse';

@Controller('chat')
export class ChatController {
  private events = new Subject<string>();

  constructor(
    private readonly chatService: ChatService,
    private readonly sseService: SseService<string>,
  ) {}

  @Post('stream')
  @Sse('chat/stream/:namespace')
  async createChatStream(@Body() createChatRequestDto: CreateChatRequestDto) {
    const event = await this.chatService.createChatStream(createChatRequestDto);
    return event.sendEvents();
  }

  @Post()
  async createChat(@Body() createChatRequestDto: CreateChatRequestDto) {
    return BaseResponse.success(
      await this.chatService.createChat(createChatRequestDto),
    );
  }
}
