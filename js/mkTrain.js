"use strict";
const s = {
    _num: 0,
    a: 1,
    b: 3,
    toString: function () {
        return `(${this.a}, ${this.b})`;
    },
    toLocaleString: function () {
        return `(${this.a.toLocaleString()},${this.b.toLocaleString()})`;
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
const s2 = Object.create(s);
console.log(s2);
console.log(s2.propertyIsEnumerable("toString"));
mk.mkInfoObject(s);
