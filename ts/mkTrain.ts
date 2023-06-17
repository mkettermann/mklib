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
		if (n > this._num) this._num = n;
		else throw new Error("Número serial só pode alterar por um número maior.");
	},
};
// console.log(s);
// console.log(s.propertyIsEnumerable("toString"));
const s2 = Object.create(s);
console.log(s2);
console.log(s2.propertyIsEnumerable("toString"));
// const s3 = Object.assign(s);
// console.log(s3);
// console.log(s3.propertyIsEnumerable("toString"));
// const s4 = mk.mkMerge(s);
// console.log(s4);
// console.log(s4.propertyIsEnumerable("toString"));

mk.mkInfoObject(s);
