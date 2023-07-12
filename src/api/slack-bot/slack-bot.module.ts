import { Module } from '@nestjs/common';
import { SlackBotController } from './slack-bot.controller';
import { SlackBotService } from './slack-bot.service';

@Module({
  controllers: [SlackBotController],
  providers: [SlackBotService],
})
export class SlackBotModule {}
