/* jshint strict: global, esversion: 6, devel: true */
'use strict';
let defFun = (fun, types) => {
    fun.typeConstr = types;
    return fun;
};
const myfun = defFun((a, b) => a + b, ['number', 'number']);
let appFun = (f, ...params) => {

    if (typeof f !== "function") {
        throw ({typerr: "Argument f is not function"});
    }
    if (f.hasOwnProperty("typeConstr") !== true) {
        throw ({typerr: "Argument f does not have property typeConstr"});
    }
    //nie dziala, iteruje sie po 1 elemencie tylko??
//     f.typeConstr.every((element, index) => {
//         if (typeof element !== typeof params[index]) {
//             let string = `Parametr ${params[index]} does not have type of ${element}`;
//             throw ({typerr: string});
//         } else {
//
//         }
//     });
    f.typeConstr.forEach((element, index) => {
        if (element !== typeof params[index]) {
            let string = `Parametr ${params[index]} does not have type of ${element}`;
            throw ({typerr: string});
        }
    });
    return f.apply(this, params);
};

try {
    console.log(appFun(myfun, 2, 10));
} catch (e) {
    console.log(e.typerr);
}
