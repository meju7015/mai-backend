import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserChatbot } from './entity/user-chatbot.entity';
import { UserSetting } from './entity/user-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserChatbot, UserSetting])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
