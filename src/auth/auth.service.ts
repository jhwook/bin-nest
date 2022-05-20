import { Injectable, HttpException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof User,
  ) {}

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
      token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req) {
    console.log(req.user);

    const { userId, email } = req.user;

    if (!req.user) {
      return 'No user from google';
    }

    const findOauthUser = await this.USERS_REPOSITORY.findOne({
      where: { oauth_id: userId },
    });

    console.log('findOauthUser', findOauthUser);

    if (findOauthUser) {
      throw new HttpException('please check your email or password', 401);
    }

    const user = await this.USERS_REPOSITORY.create({
      email,
      oauth_id: userId,
      oauth: true,
    });

    return user;
  }
}
