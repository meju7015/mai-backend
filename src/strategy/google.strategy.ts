import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../api/auth/auth.service';

enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('google.clientId'),
      clientSecret: configService.get('google.clientSecret'),
      callbackURL: configService.get('google.redirect'),
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(request, accessToken, refreshToken, profile, done) {
    try {
      const { name, emails, photos } = profile;

      const jwt: string = await this.authService.validateOAuthLogin(
        profile.id,
        Provider.GOOGLE,
      );

      const user = {
        email: emails[0].value,
        firstName: name.familyName,
        lastName: name.givenName,
        picture: photos[0].value,
        jwt,
      };

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
