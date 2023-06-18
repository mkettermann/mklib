/**
 * Criado por Marcos Kettermann em 28/05/2023
 * Treino / Teste de funções
 */

// mkHistogram.histogram("./js/test.txt").then((r) => {
// 	console.log("Resumo");
// 	console.log(r.toString());
// });

// Matriz de strings com um inteiro
// let matrizStrings = [
// 	["a", "b", "c"],
// 	["d", 1, "f"],
// 	["g", "h", "i"],
// ];
// console.log(
// 	matrizApenasScrings(matrizStrings)
// 		? "Apenas Strings na matriz"
// 		: "Matriz contém outros valores. Processo interrompido com labels."
// );
// const fsymbol = Symbol("mk");
// const s = {
// 	_num: 0,

// 	a: 1,
// 	b: "3",
// 	c: Symbol("mk"),
// 	[fsymbol]() {
// 		return this.a + 1;
// 	},
// 	d: [],
// 	e: ["eu","sou", "eu", "mesmo"],
// 	toString: function () {
// 		return `(${this.a}, ${this.b})`;
// 	},
// 	// toLocaleString: function () {
// 	// 	return `(${this.a.toLocaleString()},${this.b.toLocaleString()})`;
// 	// },

// 	get proximo() {
// 		return this._num++;
// 	},
// 	set proximo(n) {
// 		if (n > this._num) this._num = n;
// 		else throw new Error("Número serial só pode alterar por um número maior.");
// 	},
// };
// console.log(s);
// const s2 = Object.create(s);
// console.log(s2);
// const s3 = Object.assign(s);
// console.log(s3);
// var herdado = Object.create(s);
// herdado = mk.mkMerge(herdado, s);
// console.log(herdado);
// mk.mkInfoObject(s);
