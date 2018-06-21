//jshint browser: true, esversion: 6, globalstrict: true, devel: true
/* globals io: false */
'use strict';

// Inicjalizacja UI
document.onreadystatechange = () => {

    if (document.readyState === "interactive") {
        let status = document.getElementById('status');
        let open = document.getElementById('open');
        let close = document.getElementById('close');
        let send = document.getElementById('send');
        let text = document.getElementById('text');
        let message = document.getElementById('message');
        let userUL = document.getElementById('users');
        let socket;
        let username;

        status.textContent = 'Brak połącznia';
        close.disabled = true;
        send.disabled = true;

        // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
        open.addEventListener('click', () => {
            open.disabled = true;
            socket = io.connect(`http://${location.host}`);

            socket.on('connect', () => {
                //pobranie od uzytkownika nazwy
                username = prompt("Please enter your username");
                if(username){
                    socket.emit('user', username);
                    setInterval(() => {
                      socket.emit('heartbeat', username);
                    });
                    close.disabled = false;
                    send.disabled = false;
                    status.src = 'img/bullet_green.png';
                    console.log('Nawiązano połączenie przez Socket.io');
                }
            });

            socket.on('loadHistory', (messages) => {
              messages.forEach((element) => {
                let li = document.createElement('li');
                li.innerHTML = `<li>${element.user} napisał: ${element.text}</li></br>`;
                message.appendChild(li);
              });
            });

            socket.on('loadUsers', (users) => {
              while(userUL.firstChild){
                userUL.removeChild(userUL.firstChild);
              }
              users.forEach((element) => {
                let li = document.createElement('li');
                li.innerHTML = `${element}`;
                userUL.appendChild(li);
              });
            });

            socket.on('disconnect', () => {
              socket.emit('disconnect', username);
                open.disabled = false;
                status.src = 'img/bullet_red.png';
                console.log('Połączenie przez Socket.io zostało zakończone');
            });

            socket.on('error', (err) => {
                message.textContent = `Błąd połączenia z serwerem: "${JSON.stringify(err)}"`;
            });

            socket.on('echo', (msg) => {
              if(msg){
                console.log(msg);
                let li = document.createElement('li');
                li.innerHTML = `<li>${msg.user} napisał: ${msg.text}</li></br>`;
                message.appendChild(li);
              }
            });
        });

        // Zamknij połączenie po kliknięciu guzika „Rozłącz”
        close.addEventListener('click', () => {
            socket.emit('logout', username);
            close.disabled = true;
            send.disabled = true;
            message.textContent = '';
            socket.disconnect();
        });

        // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
        send.addEventListener('click', () => {
            let message = {user: username, text: text.value};
            socket.emit('message', message);
            console.log(`Wysłałem wiadomość: „${text.value}”`);
            text.value = '';
        });

    }
};