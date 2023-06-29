"use strict";
let uniqueInteger = (function () {
    let counter = 0;
    return function () {
        return counter++;
    };
})();
