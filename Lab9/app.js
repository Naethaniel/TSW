//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

app.use(serveStatic('public'));

const users = [];
const messages = [];
const heartBeat = 1000;

io.sockets.on('connect', (socket) => {
    console.log('Socket.io: połączono.');

    // socket.heartbeat = setTimeout(() => {
    //   const {userName} = socket;
    //   if(userName){
    //     let index = users.indexOf(userName);
    //     users.splice(index,1);
    //     socket.broadcast.emit('loadUsers', users);
    //     socket.disconnect();
    //   }
    // }, heartBeat * 2);
    //
    // socket.on('heartbeat', () => {
    //   clearTimeout(socket.heartbeat);
    //   socket.heartbeat = setTimeout(() => {
    //     const {userName} = socket;
    //     if(userName){
    //       let index = users.indexOf(userName);
    //       users.splice(index,1);
    //       socket.broadcast.emit('loadUsers', users);
    //       socket.disconnect();
    //     }
    //   }, heartBeat * 2);
    // });


  socket.emit('loadHistory', messages);

    socket.on('message', (data) => {
      if (messages.length === 10) {
        messages.shift();
      }
        messages.push(data);
        console.log(messages);
      socket.emit('echo', data);
      socket.broadcast.emit('echo', data);
    });
    socket.on('disconnect', (user) => {
        console.log('Socket.io: rozłączono.');
        let index = users.indexOf(user);
        users.splice(index,1);
        socket.broadcast.emit('loadUsers', users);
    });
    socket.on('error', (err) => {
        console.dir(err);
    });
    socket.on('user', (data) => {
        users.push(data);
        socket.emit('loadUsers', users);
        socket.broadcast.emit('loadUsers', users);
        console.log(users);
    });
    socket.on('logout', (data) => {
        let index = users.indexOf(data);
        users.splice(index,1);
        socket.emit('loadUsers', users);
        socket.broadcast.emit('loadUsers', users);
        console.log(users);
    });
});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
