import { Test, TestingModule } from '@nestjs/testing';
import { SlackBotController } from './slack-bot.controller';

describe('SlackBotController', () => {
  let controller: SlackBotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlackBotController],
    }).compile();

    controller = module.get<SlackBotController>(SlackBotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
