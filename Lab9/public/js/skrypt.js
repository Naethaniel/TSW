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
                    close.disabled = false;
                    send.disabled = false;
                    status.src = 'img/bullet_green.png';
                    console.log('Nawiązano połączenie przez Socket.io');
                }
            });
            socket.on('disconnect', () => {
                open.disabled = false;
                status.src = 'img/bullet_red.png';
                console.log('Połączenie przez Socket.io zostało zakończone');
            });
            socket.on('error', (err) => {
                message.textContent = `Błąd połączenia z serwerem: "${JSON.stringify(err)}"`;
            });
            socket.on('echo', (data) => {
                //dostaje cala tablice, iteruje po niej dopisujac wiadomosci

                //"czyszcze" okienko z wiadomosciami
                while(message.firstChild){
                    message.removeChild(message.firstChild);
                }
                //"tworze" nowe okienko z wiadomosciami

                data.forEach((element) => {

                    let li = document.createElement('li');
                    li.innerHTML = `<li>${element.user} napisał: ${element.text}</li></br>`;
                    message.appendChild(li);
                });
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