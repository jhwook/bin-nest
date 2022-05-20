import { ExratesModule } from './exrates/exrates.module';
import { CoinsModule } from './coins/coins.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoinsGateway } from './coins/coins.gateway';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ExratesGateway } from './exrates/exrates.gateway';

@Module({
  imports: [
    UsersModule,
    CoinsModule,
    AuthModule,
    ExratesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, CoinsGateway],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev';

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
