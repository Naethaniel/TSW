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
  router.get('/', ensureAuthenticated, (req, res) => {
    let user = req.user;

    //sockets
    io.of('/messages').on('connect', (socket) => {
      console.log("connected");
      socket.user = user;

      //somehow get username from somewhere
      Chat.findChat(user.username, (err, chat) => {
        if(err) throw err;
        socket.emit('loadChat', chat);
      });

      socket.on('newMessage', (data) => {
        //find chat for certain user
        Chat.addMessage(data.to, socket.user.username, data.message, (err, chat) => {
          if(err) throw err;
        })

      });

      // socket.emit('loadChat', chatMock);
    });

    res.render('messages');
  });




  return router;
};