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
  Redirect,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async findAll(@Body() Body, @Session() session: Record<string, any>) {
    // session.visits = session.visits ? session.visits + 1 : 1;
    console.log(Body);

    await session.save(function () {
      session.userInfo = Body;
      return { data: session.userInfo };
    });
    // console.log('visits', session.visits);
    console.log(session);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth')
  auth(@Req() req) {
    console.log(req.user);
    return req.user;
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
  async googleAuth(@Req() req) {
    console.log(req);
  }

  @Redirect('http://localhost:3001')
  @Get('google/callback') // 2
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req,
    @Res() res,
    @Session() session: Record<string, any>,
  ) {
    console.log(req);
    const googleUserData: any = await this.authService.googleLogin(req);
    console.log(
      '====================================================',
      googleUserData,
    );

    // res.cookie('accessToken', req.user.accessToken);
    res.cookie('accessToken', googleUserData.accessToken);
    // await session.save(function () {
    //   session.userId = req.user.userId;
    // console.log(session);
    // return { data: session.userInfo };
    // });
    // res.end();
  }
}
