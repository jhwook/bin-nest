import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { io } from 'socket.io-client';
// const socket = io('https://wss.live-rates.com/');
@WebSocketGateway()
export class ExratesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger();
  @WebSocketServer() server = io('https://wss.live-rates.com/');
  // @SubscribeMessage('instruments')
  // handleMessage(client: any, payload: any) {
  //   const instruments = ['EURUSD', 'USDJPY', 'CBPUSD', 'USDCAD', 'USDCHF'];
  //   return instruments;
  // }
  afterInit() {
    this.logger.log('init');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }

  @SubscribeMessage('connect')
  handleConnect(instruments, key) {
    instruments = ['EURUSD', 'USDJPY', 'CBPUSD', 'USDCAD', 'USDCHF'];
    key = 'trial';

    this.server.emit('instruments', instruments);
    this.server.emit('key', key);
  }

  @SubscribeMessage('rates')
  handleGet(msg) {
    const obj = JSON.parse(msg);
    console.log(obj);
  }
}
