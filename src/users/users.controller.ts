import { UsersService } from './users.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/all')
  getAll() {
    return this.usersService.findAll();
  }
}
