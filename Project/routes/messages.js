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

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('messages');
});

module.exports = (io) =>{
  //socket io
  io.on('connect', (socket)=>{
    console.log("podlaczono");
  });

  return router;
};