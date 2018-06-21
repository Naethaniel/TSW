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
        let rooms = document.getElementById('rooms');
        let chatButton = document.getElementById('newChat');
        let socket;
        let username;
        let chatRoom;

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
                    close.disabled = false;
                    send.disabled = false;
                    status.src = 'img/bullet_green.png';
                    console.log('Nawiązano połączenie przez Socket.io');
                }
            });

            // socket.on('joinRoom', (chat) => {
            //    chatRoom = chat;
            //    socket.join(chat);
            //    console.log(`Room: ${chat}`);
            // });
        });

        chatButton.addEventListener('click', () =>{
            let chat = prompt("Please enter name of the chat");
            if(chat){
                socket.emit('newChat', chat);
                io.to(`/${chat}`).emit('connect');
            }
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