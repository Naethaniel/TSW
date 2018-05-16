//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

app.use(serveStatic('public'));

let users = [];
let messages = [];


io.sockets.on('connect', (socket) => {
    console.log('Socket.io: połączono.');
    socket.on('message', (data) => {
        messages.push(data);
        console.log(messages);
        socket.emit('echo', messages);
    });
    socket.on('disconnect', () => {
        console.log('Socket.io: rozłączono.');
    });
    socket.on('error', (err) => {
        console.dir(err);
    });
    socket.on('user', (data) => {
        users.push(data);
        console.log(users);
    });
    socket.on('logout', (data) => {
        let index = users.indexOf(data);
        users.splice(index,1);
        console.log(users);
    });
});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
