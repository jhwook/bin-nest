import { CoinsModule } from './coins/coins.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoinsGateway } from './coins/coins.gateway';

@Module({
  imports: [UsersModule, CoinsModule],
  controllers: [AppController],
  providers: [AppService, CoinsGateway],
})
export class AppModule {}
