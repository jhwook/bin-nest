import { Injectable, Inject, HttpException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.USERS_REPOSITORY.findAll<User>();
  }

  // 회원가입
  async create(body): Promise<User> {
    const { email, password, code } = body;

    if (!email || !password) {
      throw new HttpException(
        'please input your username or email or password',
        422,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.USERS_REPOSITORY.create({
      email,
      password: hashedPassword,
      // oauth,
      // code,
    });
  }

  async findOne(): Promise<User> {
    return await this.USERS_REPOSITORY.findOne<User>();
  }
}
