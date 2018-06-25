const io = require('socket.io-client');

$(()=>{
  let socket;
  let table = $('#table');
  let userRow = $('#userRow');
  let messagesRow = $('#messagesRow');
  let newMessageButton = $('#newMessage');
  let sendMessage = $('#sendMessage');
  let messageField = $('#messageField');
  let chat = [];
  let currentChat = null;

  newMessageButton.on('click', (e) => {
    e.preventDefault();
    userRow.append(`<li class="list-group-item"><input type ="text" value="" placeholder="Username"></li>`);
  });

    //this needs to be changed
    userRow.keypress((e) => {
      if (e.key === "Enter") {
        $(e.target).parent().remove();
        currentChat = $(e.target)[0].innerHTML;
        userRow.append(`<li class="list-group-item">${e.target.value}</li>`);
      }
    }).on('click', 'li', (e) => {
      let username = $(e.target)[0].innerHTML;
      currentChat = username;
      messagesRow.empty();
      let messages = chat.find(elem => elem.from === username);
      if (messages) {
        messages.messages.forEach((elem) => {
          messagesRow.append(`<li class="list-group-item">From: ${elem.username} Message: ${elem.message}</li>`);
        });
      }
  });

  socket = io.connect(`http://${location.host}/messages`);

  //sockets
  socket.on('loadChat', (data) => {
    if (data.length !== 0) {
      chat = data[0].data;
      userRow.empty();
      chat.forEach((elem) => {
        userRow.append(`<li class="list-group-item">${elem.from}</li>`);
      });
    }
  });

  socket.on('incomingMessage', (data) => {
    alert('Dostałeś nowa wiadomość');
    chat = data[0].data;
    userRow.empty();
    chat.forEach((elem) => {
      userRow.append(`<li class="list-group-item">${elem.from}</li>`);
    });
    let toUpdate = data[0].data.find(e => e.from === currentChat);
    if(toUpdate){
      let messages = toUpdate.messages;
      messagesRow.empty();
      messages.forEach((elem) => {
        messagesRow.append(`<li class="list-group-item">From: ${elem.username} Message: ${elem.message}</li>`)
      });
    }

    if (data.length !== 0) {
      chat = data[0].data;
      userRow.empty();
      chat.forEach((elem) => {
        userRow.append(`<li class="list-group-item">${elem.from}</li>`);
      });
    }
  });

  sendMessage.on('click', (e) => {
    e.preventDefault();
    //get current username
    let username = $('#logout')[0].outerText;
    username = username.match(/\((.*)\)/)[1];
    let message = messageField.val();
    messageField.val("");
    messagesRow.append(`<li class="list-group-item">From: ${username} Message: ${message}</li>`);

    //push that message to the local chat
    let messages = chat.find(elem => elem.from === currentChat);
    messages.messages.push({message, username});


    if(currentChat){
      socket.emit('newMessage', {to: currentChat, message});
    }else{
      alert('Please create new message with a button');
    }
  });

  $(window).on('load', () => {
  });

  $(window).on('unload', () => {
    socket.emit('disconnect');
  });

});

