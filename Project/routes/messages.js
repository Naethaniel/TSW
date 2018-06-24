const express = require('express');
const router = express.Router();
let Chat = require('../models/chat');

const chatMock = [{
  user1: "Karol",
  user2: "Andzrej",
  messages: [[
    {
      username: "Karol",
      message: "Siemka"
    },
    [{
      username: "Andrzej",
      message: "Elo"
    }]
  ]]
}
];

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

module.exports = (io) => {
  //sockets
  io.of('/messages').on('connect', (socket) => {
    console.log("connected");
    socket.emit('loadChat', chatMock);
  });

  router.get('/', ensureAuthenticated, (req, res) => {
    res.render('messages');
  });
  return router;
};