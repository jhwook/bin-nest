/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthService } from './../auth/auth.service';
import { UsersService } from './users.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Get('/all')
  getAll() {
    return this.usersService.findAll();
  }

  // 회원가입
  @Post('/signup')
  create(@Body() body) {
    return this.usersService.create(body);
  }

  // 로그인
  @Post('/login')
  login(@Body() body) {
    return this.authService.jwtLogIn(body);
  }

  @Get('google') // 1
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback') // 2
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
