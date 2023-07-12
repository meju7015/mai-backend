import { Injectable } from '@nestjs/common';

@Injectable()
export class SlackBotService {
  async incomingMessage(ctx) {
    if (ctx.message.text) {
      const text = ctx.message.text.replace('!!gpt', '');
      console.info(text);
    }
  }
}
