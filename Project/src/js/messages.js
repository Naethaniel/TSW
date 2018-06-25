const io = require('socket.io-client');

$(()=>{
  let socket = io.connect(`http://${location.host}/messages`);
  let table = $('#table');
  let userRow = $('#userRow');
  let messagesRow = $('#messagesRow');
  let newMessageButton = $('#newMessage');
  let chat = [];

  newMessageButton.on('click', (e) => {
    e.preventDefault();
    userRow.append(`<li class="list-group-item"><input type ="text" value="" placeholder="Username"></li>`);
  });

    //this needs to be changed
    userRow.keypress((e) => {
      if (e.key === "Enter") {
        $(e.target).parent().remove();
        userRow.append(`<li class="list-group-item">${e.target.value}</li>`);
      }
    }).on('click', 'li', (e) => {
      let username = $(e.target)[0].innerHTML;
      messagesRow.empty();
      let messages = chat.find(elem => elem.from === username);
      messages.messages.forEach((elem) => {
        messagesRow.append(`<li class="list-group-item">From: ${elem.username} Message: ${elem.message}</li>`)
      });
  });

  //sockets
  socket.on('loadChat', (data) => {
    console.log(data);
    chat = data[0].data;
    userRow.empty();
    chat.forEach((elem) => {
      userRow.append(`<li class="list-group-item">${elem.from}</li>`);
    });
    socket.emit('newMessage', {});
  });

});