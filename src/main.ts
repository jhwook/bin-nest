import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { io } from 'socket.io-client';

// const socket = io('https://wss.live-rates.com/');

// const key = 'trial';
// //var key = 'XXXXXXX' //YOUR LIVE-RATES SUBSCRIPTION KEY

// socket.on('connect', function () {
//   // if you want to subscribe only specific instruments, emit instruments. To receive all instruments, comment the line below.
//   const instruments = ['EURUSD', 'USDJPY', 'CBPUSD', 'USDCAD', 'USDCHF'];
//   socket.emit('instruments', instruments);

//   socket.emit('key', key);
// });

// socket.on('rates', function (msg) {
//   //Do what you want with the Incoming Rates... Enjoy!
//   const obj = JSON.parse(msg);
//   console.log(obj);
// });

export class ExratesAdapter extends IoAdapter {
  createIOServer(
    port: 3000,
    options?: ServerOptions & {
      server?: 'https://wss.live-rates.com/';
    },
  ) {
    const server = super.createIOServer(port, { ...options, cors: true });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useWebSocketAdapter(new ExratesAdapter(app));
  await app.listen(3000);
}
bootstrap();
