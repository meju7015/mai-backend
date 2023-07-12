import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PineconeNamespaces } from '../asset/entity/pinecone-namespace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModule } from '../asset/asset.module';
import { SseModule } from '../../modules/sse/sse.module';
import { ChatHistory } from './entity/chat-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PineconeNamespaces, ChatHistory]),
    AssetModule,
    SseModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
