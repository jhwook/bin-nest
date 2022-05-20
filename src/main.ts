import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { StreamClient, RESTClient } from 'cw-sdk-node';

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
        );
      });
    }
  });

  // Connect to stream
  streamClient.connect();
}

run().catch((e) => {
  console.error(e);
});

export class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ) {
    const server = super.createIOServer(port, { ...options, cors: true });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketAdapter(app));
  await app.listen(3000);
}
bootstrap();
