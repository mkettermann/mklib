"use strict";
mkHistogram.histogram("./js/test.txt").then((r) => {
    console.log("Resumo");
    console.log(r.toString());
});
let matrizStrings = [
    ["a", "b", "c"],
    ["d", 1, "f"],
    ["g", "h", "i"],
];
console.log(matrizApenasScrings(matrizStrings)
    ? "Apenas Strings na matriz"
    : "Matriz contém outros valores. Processo interrompido com labels.");
let b = "999";
let teste = {
    a: 1,
    b: 3,
    toString: function () {
        return `(${this.a}, ${b})`;
    },
    toLocaleString: function () {
        return `(${this.a.toLocaleString()},${this.b.toLocaleString()})`;
    },
};
console.log(teste);
teste.toString();
for (let item in teste) {
    console.log(String(teste));
}
const s = {
    _num: 0,
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
const s2 = Object.create(teste);
const s3 = Object.assign(teste);
const s4 = mk.mkMerge(teste);
console.log(s2);
console.log(s3);
console.log(JSON.stringify(s4));
