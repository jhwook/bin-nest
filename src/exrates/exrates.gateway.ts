import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocket } from 'ws';
import { io } from 'socket.io-client';

@WebSocketGateway()
export class ExratesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ExratesGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client Disconnected : ${socket.id}`);
  }

  handleConnection() {
    function Unix_timestamp(t) {
      const date = new Date(t);
      const year = date.getFullYear();
      const month = '0' + (date.getMonth() + 1);
      const day = '0' + date.getDate();
      const hour = '0' + date.getHours();
      const minute = '0' + date.getMinutes();
      const second = '0' + date.getSeconds();
      return (
        year +
        '-' +
        month.substr(-2) +
        '-' +
        day.substr(-2) +
        ' ' +
        hour.substr(-2) +
        ':' +
        minute.substr(-2) +
        ':' +
        second.substr(-2)
      );
    }
    const reconnectInterval = 1000 * 10;
    const connect = function () {
      const ws = new WebSocket('wss://marketdata.tradermade.com/feedadv');
      ws.on('open', function open() {
        ws.send(
          '{"userKey":"sioh9a1zgvX835cV6IblA", "symbol":"EURUSD,USDJPY,CBPUSD,USDCAD,USDCHF"}',
        );
      });
      ws.on('close', function () {
        console.log('socket close : will reconnect in ' + reconnectInterval);
        setTimeout(connect, reconnectInterval);
      });
      ws.on('message', function incoming(data) {
        const stringData = data.toString();

        try {
          const newData = JSON.parse(stringData);
          const obj = {
            symbol: newData.symbol,
            price: newData.mid,
            timestamp: Unix_timestamp(+newData.ts),
          };
          console.log(obj);
        } catch (e) {
          console.log(e);
        }
      });
    };
    // connect();

    //   const socket = io('https://marketdata.tradermade.com', {
    //     reconnection: true,
    //   });

    //   let connected = false;

    //   socket.on('connect', function () {
    //     console.log(
    //       'Connected! Please CTRL+C and restart if you see this messsage more than twice',
    //     );
    //     console.log('disconnecting and reconnecting can take upto a minute');
    //     console.log('.......');
    //     socket.emit('login', { userKey: 'sioh9a1zgvX835cV6IblA' });
    //   });

    //   socket.on('disconnect', function (msg) {
    //     console.log(msg);
    //   });

    //   socket.on('handshake', function (msg) {
    //     console.log(msg);
    //     connected = true;
    //     socket.emit('symbolSub', { symbol: 'USDJPY' });
    //     socket.emit('symbolSub', { symbol: 'GBPUSD' });
    //     socket.emit('symbolSub', { symbol: 'EURUSD' });
    //   });

    //   socket.on('subResponse', function (msg) {
    //     console.log(msg);
    //   });

    //   socket.on('message', function (msg) {
    //     console.log(msg);
    //   });

    //   socket.on('price', function (message) {
    //     const data = message.split(' ');
    //     console.log(
    //       data[0] +
    //         ' ' +
    //         data[1] +
    //         ' ' +
    //         data[2] +
    //         ' ' +
    //         data[3] +
    //         ' ' +
    //         parseDate(data[4]),
    //     );
    //   });

    //   function parseDate(dateString) {
    //     const reggie = /(\d{4})(\d{2})(\d{2})-(\d{2}):(\d{2}):(\d{2}).(\d{3})/;
    //     const dateArray = reggie.exec(dateString);
    //     const dateObject = new Date(
    //       +dateArray[1],
    //       +dateArray[2] - 1, // Careful, month starts at 0!
    //       +dateArray[3],
    //       +dateArray[4],
    //       +dateArray[5],
    //       +dateArray[6],
    //     );
    //     return dateObject;
    //   }
  }
}
