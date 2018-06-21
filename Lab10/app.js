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
const chats = [];

io.sockets.on('connect', (socket) => {
    console.log('Socket.io: połączono.');

    socket.emit('chats', chats);

    socket.on('error', (err) => {
        console.dir(err);
    });

    socket.on('user', (data) => {
        users.push(data);
        console.log(users);
    });

    socket.on('newChat', (chat) => {
        let room = io.of(`/${chat}`);
        room.on('connect', () => {
            console.log(`New room named: ${chat}`);
        });
        chats.push(room);
    });

});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
