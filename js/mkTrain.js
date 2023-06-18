"use strict";
const fsymbol = Symbol("mk");
const s = {
    _num: 0,
    a: 1,
    b: "3",
    c: Symbol("mk"),
    [fsymbol]() {
        return this.a + 1;
    },
    d: [],
    e: [],
    toString: function () {
        return `(${this.a}, ${this.b})`;
    },
    get proximo() {
        return this._num++;
    },
    set proximo(n) {
        if (n > this._num)
            this._num = n;
        else
            throw new Error("Número serial só pode alterar por um número maior.");
    },
};
console.log(s);
const s2 = Object.create(s);
console.log(s2);
const s3 = Object.assign(s);
console.log(s3);
var clonado = Object.create(s);
clonado = mk.mkMerge(clonado, s);
console.log(clonado);
mk.mkInfoObject([]);
