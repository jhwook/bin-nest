import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { StreamClient, RESTClient } from 'cw-sdk-node';
import { Server, Socket } from 'socket.io';
import * as moment from 'moment';

@WebSocketGateway()
export class CoinsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('CoinsGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client Disconnected : ${socket.id}`);
  }

  handleConnection(socket: Socket) {
    const rc = new RESTClient();
    this.logger.log(`Client Connected : ${socket.id}`);

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
            // console.log(
            //   marketCache[marketData.market.id], // access market info from cache
            //   tradeUpdate.side,
            //   'Price: ',
            //   tradeUpdate.price,
            //   'Amount: ',
            //   tradeUpdate.amount,
            //   tradeUpdate.timestamp,
            // );
            const obj = {
              pair: marketCache[marketData.market.id].pair,
              price: +tradeUpdate.price,
              timestamp: moment(tradeUpdate.timestamp).format(
                'YYYY-MM-DD HH:mm:ss',
              ),
            };
            console.log(obj);
            // socket.emit('hello', { data: obj });
          });
        }
      });

      // Connect to stream
      streamClient.connect();
    }
    // run().catch((e) => {
    //   console.error(e);
    // });
  }
}
