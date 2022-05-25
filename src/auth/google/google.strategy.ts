import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './../auth.service';
import { User } from 'src/users/entities/user.entity';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleOauthJWTStrategy } from 'passport-google-oauth-jwt';
import { config } from 'dotenv';
import { Inject, Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof User,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // 1
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/users/google/callback',
      scope: ['email', 'profile', 'openid'],
      accessType: 'offline',
      prompt: 'consent',
      state: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: 'https://accounts.google.com',
      algorithms: ['RS256'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    // console.log(profile);

    const user = {
      userId: profile.id,
      email: emails[0].value,
      username: name,
      accessToken,
      refreshToken,
    };
    console.log(user);

    // const user = await this.authService.validateUser(userInfo.email);
    // if (user === null) {
    //   // 유저가 없을때
    //   console.log('일회용 토큰 발급');
    //   const once_token = this.authService.onceToken(userInfo);
    //   return { once_token, type: 'once' };
    // }

    // // 유저가 있을때
    // console.log('로그인 토큰 발급');
    // const access_token = await this.authService.createLoginToken(user);
    // const refresh_token = await this.authService.createRefreshToken(user);
    // return { access_token, refresh_token, type: 'login' };
    return done(null, user);
  }
}
