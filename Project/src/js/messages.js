import io from 'socket.io-client';
$(()=>{
  // console.log(`http://${location.host}/messages`);
  // let socket = io(`http://${location.host}`);
  let table = $('#table');
  let userRow = $('#userRow');
  let messagesRow = $('#messagesRow');
  let newMessageButton = $('#newMessage');

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
});