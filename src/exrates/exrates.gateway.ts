import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as io from 'socket.io-client';
import { WebSocket } from 'ws';

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
    // const socket = io('https://wss.live-rates.com/');
    // const key = 'trial';
    // //const key = 'XXXXXXX' //YOUR LIVE-RATES SUBSCRIPTION KEY
    // // socket.on('connect', function () {
    // //   // if you want to subscribe only specific instruments, emit instruments. To receive all instruments, comment the line below.
    // //   const instruments = ['EURUSD', 'USDJPY', 'CBPUSD', 'USDCAD', 'USDCHF'];
    // //   socket.emit('instruments', instruments);
    // //   socket.emit('key', key);
    // // });
    // socket.on('rates', function (msg) {
    //   //Do what you want with the Incoming Rates... Enjoy!
    //   const obj = JSON.parse(msg);
    //   console.log(obj);
    // });
    //////////////////////////////////////////////////////////////
    // console.log('=============================================connect');
    // const socket = io.connect('https://marketdata.tradermade.com', {
    //   reconnection: true,
    // });
    // let connected = false;
    // socket.on('connect', function () {
    //   console.log(
    //     'Connected! Please CTRL+C and restart if you see this messsage more than twice',
    //   );
    //   console.log('disconnecting and reconnecting can take upto a minute');
    //   console.log('.......');
    //   socket.emit('login', { userKey: 'sioh9a1zgvX835cV6IblA' });
    // });
    // socket.on('disconnect', function (msg) {
    //   console.log(msg);
    // });
    // socket.on('handshake', function (msg) {
    //   console.log(msg);
    //   connected = true;
    //   // socket.emit('symbolSub', { symbol: 'USDJPY' });
    //   // socket.emit('symbolSub', { symbol: 'GBPUSD' });
    //   socket.emit('symbolSub', { symbol: 'EURUSD' });
    // });
    // socket.on('subResponse', function (msg) {
    //   console.log(msg);
    // });
    // socket.on('message', function (msg) {
    //   console.log(msg);
    // });
    // socket.on('price', function (message) {
    //   const data = message.split(' ');
    //   console.log(
    //     data[0] +
    //       ' ' +
    //       data[1] +
    //       ' ' +
    //       data[2] +
    //       ' ' +
    //       data[3] +
    //       ' ' +
    //       parseDate(data[4]),
    //   );
    // });
    // function parseDate(dateString) {
    //   const reggie = /(\d{4})(\d{2})(\d{2})-(\d{2}):(\d{2}):(\d{2}).(\d{3})/;
    //   const dateArray = reggie.exec(dateString);
    //   const dateObject = new Date(
    //     +dateArray[1],
    //     +dateArray[2] - 1, // Careful, month starts at 0!
    //     +dateArray[3],
    //     +dateArray[4],
    //     +dateArray[5],
    //     +dateArray[6],
    //   );
    //   return dateObject;
    // }
    const reconnectInterval = 1000 * 10;

    const connect = function () {
      const ws = new WebSocket('wss://marketdata.tradermade.com/feedadv');

      ws.on('open', function open() {
        ws.send('{"userKey":"sioh9a1zgvX835cV6IblA", "symbol":"GBPUSD"}');
      });

      ws.on('close', function () {
        console.log('socket close : will reconnect in ' + reconnectInterval);
        setTimeout(connect, reconnectInterval);
      });

      ws.on('message', function incoming(data) {
        const stringData = JSON.stringify(data);
        const newData = JSON.parse(stringData);
        console.log(typeof data);
      });
    };
    connect();
  }
}
