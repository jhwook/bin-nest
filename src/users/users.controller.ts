import { GoogleAuthGuard } from './../auth/google/google.guard';
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthService } from './../auth/auth.service';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async indAll(@Body() Body, @Session() session: Record<string, any>) {
    // session.visits = session.visits ? session.visits + 1 : 1;
    console.log(Body);

    await session.save(function () {
      session.userInfo = Body;
      return { data: session.userInfo };
    });
    // console.log('visits', session.visits);
    console.log(session);
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
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback') // 2
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    console.log(req.user);
    return this.authService.googleLogin(req);
  }
}
