import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from '../../strategy/google.strategy';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { JwtStrategy } from '../../strategy/jwt.strategy';
import { UserChatbot } from '../user/entity/user-chatbot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserChatbot])],
  providers: [GoogleStrategy, JwtStrategy, AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
