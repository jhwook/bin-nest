import { Injectable } from '@nestjs/common';
import { StreamClient, RESTClient } from 'cw-sdk-node';

@Injectable()
export class CoinsService {
  getCoinData() {
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
  }
}
