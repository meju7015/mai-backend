import { Controller } from '@nestjs/common';
import { Message } from 'nestjs-slack-bolt';
import { SlackEventMiddlewareArgs } from '@slack/bolt';
import { SlackBotService } from './slack-bot.service';

@Controller('slack-bot')
export class SlackBotController {
  constructor(private slackBotService: SlackBotService) {}

  @Message('!!gpt')
  async gpt(ctx: SlackEventMiddlewareArgs) {
    await this.slackBotService.incomingMessage(ctx);
  }
}
