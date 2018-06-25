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

let MessagesSchema = mongoose.Schema({
  message: String,
  username: String
});

let DataSchema = mongoose.Schema({
    from: String,
    messages: [MessagesSchema]
});

let ChatSchema = mongoose.Schema({
  username: String,
  data: [DataSchema]
});

let Chat = module.exports = mongoose.model('Chat', ChatSchema);

//create chat for user when he is created
module.exports.createChat = (newChat, callback) =>{
  newChat.save(callback);
};

//find and return chat for certain username
module.exports.findChat = (username, callback) => {
  let query = Chat.find({username});
  query.exec(callback);
};

module.exports.addMessage = (to, from, message, messageFrom, callback) => {
  Chat.find({username: to}, (err, chat) => {
    let index = chat[0].data.findIndex(e => e.from === from);
    if(index === -1){
      //there is not
      chat[0].data.push({
        from: from,
        messages: [{
          message: message,
          username: messageFrom
        }]
      })
    }else{
      //index found
      console.log('found');
      chat[0].data[index].messages.push({
        message: message,
        username: messageFrom
      });
    }
    chat[0].save();
  });
};