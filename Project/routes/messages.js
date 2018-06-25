const express = require('express');
const router = express.Router();
let Chat = require('../models/chat');
const loggedUsers = [];

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

module.exports = (io) => {
  router.get('/', ensureAuthenticated, (req, res) => {
    res.render('messages');
  });

  //sockets
  io.of('/messages').on('connect', (socket) => {
    //check if user is logged in
    let index = loggedUsers.findIndex(e => e.user === socket.request.user);
    if(index === -1) loggedUsers.push(socket);
    console.log('logged:');
    loggedUsers.forEach((elem) => {
      console.log(elem.request.user.username);
    });

    Chat.findChat(socket.request.user.username, (err, chat) => {
      if (err) throw err;
      socket.emit('loadChat', chat);
    });

    socket.on('newMessage', (data) => {
      //somehow validate if user is in database

      //find chat for certain user
      Chat.addMessage(data.to, socket.request.user.username, data.message, socket.request.user.username, (err) => {
        if (err) throw err;
      });
      //also insert into second user that message
      Chat.addMessage(socket.request.user.username, data.to, data.message, socket.request.user.username, (err) => {
        if (err) throw err;
      });

      //if user which we want send message to is online send him new data
      let index = loggedUsers.findIndex(e => e.request.user.username === data.to);
      if(index !== -1){
        Chat.findChat(data.to, (err, chat) => {
          if (err) throw err;
          loggedUsers[index].emit('incomingMessage', chat);
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.io: rozłączono: ' + socket.request.user.username);
      let index = loggedUsers.indexOf(socket);
      loggedUsers.splice(index,1);
    });

  });




  return router;
};