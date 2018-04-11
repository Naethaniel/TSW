/* jshint strict: global, esversion: 6, devel: true */
'use strict';

const kod = [0, 7, 7, 3];

const ruch1 = [3, 2, 0, 0];
const ruch2 = [7, 5, 7, 5];
const ruch3 = [7, 7, 7, 7];
const ruch4 = [7, 5, 6, 9];

const ocena = (kod) => {
    return (ruch) => {
        if (kod.length !== ruch.length) {
            throw ({typerr: "Ruch i kod musza miec te sama dlugosc"});
        }
        let zwrot = {
            czarne: 0,
            biale: 0
        };
        //czarne
        let kodCopy = [...kod];
        kodCopy.forEach((item, index) =>{
           if(ruch[index] === item){
               zwrot.czarne++;
               delete kodCopy[index];
               delete ruch[index];
           }
        });

        //biale

        let kruch = {};
        let kkod = {};

        //zliczam wystepowanie kolorow w ruchu i kodzie

        kodCopy.forEach((item) => {
            if(kkod[item]){
                kkod[item]++;
            }
            else{
                kkod[item] = 1;
            }
        });
        // console.log(kkod);

        ruch.forEach((item) => {
            if(kruch[item]){
                kruch[item]++;
            }
            else{
                kruch[item] = 1;
            }
        });
        // console.log(kruch);

        //maksymalnie moge miec ptk tyle ile wystepuje w kodzie.
        //jezeli wartosc w ruchu jest wieksza niz wartosc w kodzie
        //to dodaje wartosc w kodzie. jezeli nie to dodaje wartosc w ruchu

        //powtarzalnosc - te wykorzystane na biale musze ignorowac

        Object.keys(kkod).forEach((element) =>{
            if(kruch[element]) {
                if (kruch[element] >= element) {
                    zwrot.biale += kkod[element];
                }
                else {
                    zwrot.biale += kruch[element];
                }
            }
        });

        return zwrot;
    };
};

try {
    console.log(ocena(kod)(ruch1));
    console.log(ocena(kod)(ruch2));
    console.log(ocena(kod)(ruch3));
    console.log(ocena(kod)(ruch4));
} catch (e) {
    console.log(e.typerr);
}