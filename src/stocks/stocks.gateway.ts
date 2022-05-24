/* eslint-disable @typescript-eslint/no-unused-vars */
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

@WebSocketGateway()
export class StocksGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('StocksGateway');

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

    const socket = new WebSocket(
      'wss://ws.finnhub.io?token=c9se572ad3i4aps1soq0',
    );

    // Connection opened -> Subscribe
    socket.addEventListener('open', function (event) {
      console.log('socket send');
      // socket.send(JSON.stringify({ type: 'subscribe', symbol: '9988.HK' }));
      // socket.send(JSON.stringify({ type: 'subscribe', symbol: '9988' }));
      // socket.send(JSON.stringify({ type: 'subscribe', symbol: 'BABA' }));
      // socket.send(JSON.stringify({ type: 'subscribe', symbol: '600519' }));
      // socket.send(JSON.stringify({ type: 'subscribe', symbol: '601288' }));
      // socket.send(JSON.stringify({ type: 'subscribe', symbol: '601398.SS' }));
      // socket.send(JSON.stringify({ type: 'subscribe', symbol: 'tencent holding' }));
      // socket.send(JSON.stringify({ type: 'subscribe', symbol: 'ACGBF' }));
      // socket.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
    });

    // Unsubscribe
    // const unsubscribe = function (symbol) {
    //   socket.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }));
    // };

    // unsubscribe();

    // Listen for messages
    socket.addEventListener('message', function (event) {
      console.log('Message from server ', JSON.parse(event.data));
      const data = JSON.parse(event.data);
      const obj = {};
      if (data.data) {
        data.data.forEach((el) => {
          obj['symbol'] = el.s;
          obj['price'] = el.p;
          obj['timestamp'] = Unix_timestamp(el.t / 1000);

          console.log(obj);
        });
      }
    });
  }
}
