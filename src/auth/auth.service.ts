import { Injectable, HttpException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof User,
  ) {}

  // 유저 확인
  async validateUser(email) {
    const user = await this.USERS_REPOSITORY.findOne({ where: { email } });

    if (!user) return null;
    return user;
  }

  async jwtLogIn(data) {
    const { email, password } = data;

    const findUser = await this.USERS_REPOSITORY.findOne({ where: { email } });
    const user = findUser.get();

    if (findUser) {
      throw new HttpException('this email already existed', 401);
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new HttpException('please check your email or password', 401);
    }

    const payload = { email, sub: user.id };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async createLoginToken(email) {
    const findUser = await this.USERS_REPOSITORY.findOne({ where: { email } });
    const user = findUser.get();
    const payload = { email, sub: user.id };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '6m',
    });
  }

  // RefreshToken 발급
  async createRefreshToken(data) {
    const { email } = data;

    const findUser = await this.USERS_REPOSITORY.findOne({ where: { email } });
    const user = findUser.get();

    const payload = { email, sub: user.id };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '50m',
    });

    const refresh_token = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      process.env.AES_KEY,
    ).toString();

    return refresh_token;
  }

  onceToken(userInfo: any) {
    const payload = {
      email: userInfo.email,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '10m',
    });
  }

  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async googleLogin(req) {
    const { userId, email } = req.user;

    if (!req.user) {
      return 'No user from google';
    }

    const findOauthUser = await this.USERS_REPOSITORY.findOne({
      where: { oauth_id: userId },
    });

    console.log('findOauthUser', findOauthUser);

    if (!findOauthUser) {
      const user = await this.USERS_REPOSITORY.create({
        email,
        oauth_id: userId,
        oauth: true,
      });
      return user;
    }

    return findOauthUser;
  }
}
