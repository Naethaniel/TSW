const express = require('express');
const router = express.Router();
let Chat = require('../models/chat');
const loggedUsers = [];

// const chatMock = [{
//   user1: "Karol",
//   user2: "Andzrej",
//   messages: [[
//     {
//       username: "Karol",
//       message: "Siemka"
//     },
//     [{
//       username: "Andrzej",
//       message: "Elo"
//     }]
//   ]]
// },
//   {
//     user1: "Karol",
//     user2: "Andzrej",
//     messages: [[
//       {
//         username: "Karol",
//         message: "Siemka"
//       },
//       [{
//         username: "Andrzej",
//         message: "Elo"
//       }]
//     ]]
//   }
// ];

const chatMock = {
  username: 'Karol',
  data: [
    {
      from: 'Andrzej',
      messages: [{
        message: 'pierwsza',
        username: 'Karol'
      },
        {
          message: 'druga',
          username: 'Andrzej'
        }]
    },
    {
      from: 'Pawel',
      messages: [{
        message: 'pierwsza pawel',
        username: 'Karol'
      },
        {
          message: 'druga pawel',
          username: 'Pawel'
        }]
    }
  ]
};

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

module.exports = (io) => {
  let user;
  router.get('/', ensureAuthenticated, (req, res) => {
    // user = req.user || null;
    res.render('messages');
  });

  //sockets
  io.of('/messages').on('connect', (socket) => {
    console.log("connected");

    //somehow get username from somewhere
    Chat.findChat("n", (err, chat) => {
      if(err) throw err;
      console.log(chat);
      socket.emit('loadChat', chat);
    });

    socket.on('newMessage', (data) => {
      //find chat for certain user
      console.log(socket);
      Chat.addMessage('n', (err, chat) => {
        if(err) throw err;
      })

    });

    // socket.emit('loadChat', chatMock);
  });


  return router;
};