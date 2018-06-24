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

  $('#userRow').keypress((e) => {
    if (e.key === "Enter") {
      $(e.target).parent().remove();
      userRow.append(`<li class="list-group-item">${e.target.value}</li>`);
    }
  });

  //sockets
  socket.on('loadChat', (data) => {

  });

});