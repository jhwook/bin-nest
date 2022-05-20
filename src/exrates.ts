// import { io } from 'socket.io-client';

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
