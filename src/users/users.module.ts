import { AuthService } from './../auth/auth.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from './../database/database.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, AuthService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
