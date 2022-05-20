import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.USERS_REPOSITORY.findAll<User>();
  }
}
