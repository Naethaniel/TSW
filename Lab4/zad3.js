/* jshint strict: global, esversion: 6, devel: true */
'use strict';

let szablon =
    '<table border="{border}">' +
    '  <tr><td>{first}</td><td>{last}</td></tr>' +
    '</table>';

let dane = {
    first: "Jan",
    last:  "Kowalski",
    pesel: "97042176329"
};

let podstaw = (szablon, dane) => {
    Object.keys(dane).forEach(e => {
       szablon = szablon.replace(new RegExp(`{${e}}`, `g`), dane[e]);
    });
    return szablon;
};

console.log(podstaw(szablon,dane));