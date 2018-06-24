const mongoose = require('mongoose');

// let MessageSchema = mongoose.Schema({
//   from: {
//     type: String
//   },
//   chat: {
//     type: [{username, message}]
//   }
// });
//
// let ChatSchema = mongoose.Schema({
//   user: {
//     type: String
//   },
//   chat: {
//     type: [MessageSchema]}
//
// });

let ChatSchema = mongoose.Schema({
  user1: {
    type: String
  },
  user2: {
    type: String
  },
  messages: {
    type: [
      {
        username: String,
        message: String,
        read: Boolean
      }
    ]
  }
});

let Chat = module.exports = mongoose.model('Chat', ChatSchema);