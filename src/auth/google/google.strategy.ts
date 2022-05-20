import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // 1
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/users/google/callback',
      scope: ['email', 'profile', 'openid'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;

    const user = {
      userId: profile.id,
      email: emails[0].value,
      username: name,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
