import { Test, TestingModule } from '@nestjs/testing';
import { SlackBotService } from './slack-bot.service';

describe('SlackBotService', () => {
  let service: SlackBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackBotService],
    }).compile();

    service = module.get<SlackBotService>(SlackBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
