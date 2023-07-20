import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';

enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  private readonly JWT_SECRET_KEY;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_SECRET_KEY = configService.get('google.jwtSecretKey');
  }

  async validateOAuthLogin(
    thirdPartyId: string,
    provider: Provider,
  ): Promise<string> {
    try {
      let user: User = await this.userService.findOneByThirdPartyId(
        thirdPartyId,
        provider,
      );

      if (!user) {
        user = await this.userService.registerOAuthUser(thirdPartyId, provider);
      }

      const payload = {
        id: user.id,
        thirdPartyId,
        provider,
      };

      const jwt: string = sign(payload, this.JWT_SECRET_KEY, {
        expiresIn: 36000,
      });
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }
}
