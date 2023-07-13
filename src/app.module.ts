import { Module } from '@nestjs/common';
import { OpenaiModule } from './api/openai/openai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AssetModule } from './api/asset/asset.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ChatModule } from './api/chat/chat.module';
import { SseModule } from './modules/sse/sse.module';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import awsS3Config from './config/aws-s3.config';
import databaseConfig from './config/database.config';
import pineconeConfig from './config/pinecone.config';
import googleConfig from './config/google.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [awsS3Config, databaseConfig, pineconeConfig, googleConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: config.get('autoLoadEntities', true),
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: config.get('database.synchronize'),
      }),
    }),
    // TODO :: 임시주석.
    // SlackModule,
    // SlackBotModule,
    OpenaiModule,
    AssetModule,
    ChatModule,
    SseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
