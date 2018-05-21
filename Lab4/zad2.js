/* jshint strict: global, esversion: 6, devel: true */
'use strict';
class tekst {
    static nbsp () {
        let napis = `Ala i As poszli w las`;
        return napis.replace(/(\s[aiouwz])\s/g, `$1&nbsp;`);
    }
}
console.log(tekst.nbsp());