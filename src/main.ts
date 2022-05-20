import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { StreamClient, RESTClient } from 'cw-sdk-node';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { io } from 'socket.io-client';

const rc = new RESTClient();

const streamClient = new StreamClient({
  creds: {
    apiKey: 'ADBJZNLI9080BAGM0EQH', // your cw api key
    secretKey: 'c3OHmW8tmon82w7cSA0Slgd7gAxTjxxMG/qesKFH', // your cw secret key
  },
  subscriptions: [
    'markets:579:trades', // binance btc:usdt
    'markets:588:trades', // binance eth:usdt
    'markets:1128:trades', // binance xrp:usdt
    'markets:61542:trades', // kraken btc:usdt
    'markets:61539:trades', // kraken eth:usdt
    'markets:62906:trades', // kraken xrp:usdt
  ],
  logLevel: 'debug',
});

async function run() {
  const markets = await rc.getMarkets();
  const marketCache = {};
  markets.forEach((market) => {
    marketCache[market.id] = market; // Cache all market identifiers
  });

  // Listen for received trades and print them
  streamClient.onMarketUpdate((marketData) => {
    const tradesUpdate = marketData.trades;
    if (tradesUpdate) {
      tradesUpdate.forEach((tradeUpdate) => {
        console.log(
          marketCache[marketData.market.id], // access market info from cache
          tradeUpdate.side,
          'Price: ',
          tradeUpdate.price,
          'Amount: ',
          tradeUpdate.amount,
          tradeUpdate.timestamp,
        );
      });
    }
  });

  // Connect to stream
  streamClient.connect();
}

// run().catch((e) => {
//   console.error(e);
// });
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
