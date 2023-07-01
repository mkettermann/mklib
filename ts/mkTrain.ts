/**
 * Criado por Marcos Kettermann em 28/05/2023
 * Treino / Teste de funções
 */

// mkHistogram.histogram("./js/test.txt").then((r) => {
// 	console.log("Resumo");
// 	console.log(r.toString());
// });

// Matriz de strings com um inteiro
// let a = [
// 	["a", "b", "c"],
// 	["d", 1, "f"],
// 	["g", "h", "i"],
// ];
// console.log(
// 	matrizApenasScrings(a)
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
// let ma = "Marcos";
// let num = "1326243788956";
// let ar = Array.from(num);

// const log = async (t: any) => {
// 	return new Promise((r) => {
// 		setTimeout(() => {
// 			console.log(t);
// 			r(t);
// 		}, t);
// 	});
// };
// const multi = async () => {
// 	// return log(await log(await log(1000)));
// 	await log(50);
// 	await log(1500);
// 	await log(50);
// 	await log(1500);
// 	await log(50);
// };
// multi();

// THIS Object
// let o = {
// 	m: function () {
// 		let self = this;
// 		console.log(this === o);
// 		console.log(this);
// 		const f = () => {
// 			console.log(this == o);
// 			console.log(self === o);
// 		};
// 		f();
// 	},
// };
// o.m();

// NO Scope vars
// uniqueInteger.counter = 0;
// function uniqueInteger() {
// 	return uniqueInteger.counter++;
// }
// uniqueInteger();

// SCOPE var
// let uniqueInteger = (function () {
// 	let counter = 0;
// 	return function () {
// 		return counter++;
// 	};
// })();

// SCOPE RETURN FUNCTION
// function counter() {
// 	let n = 0;
// 	return {
// 		count: function () {
// 			return n++;
// 		},
// 		reset: function () {
// 			n = 0;
// 		},
// 	};
// }
// let c = counter();

// Spread Operator Function FALHOU
// function timed(f) {
// 	return function (...args) {
// 		console.log(`Entrando na funcao ${f.name}`);
// 		let startTime = Date.now();
// 		try {
// 			return f(...args);
// 		} finally {
// 			console.log(`Saindo ${f.name} apos ${Date.now() - startTime}ms`);
// 		}
// 	};
// }
// function demo(n) {
// 	let sum = 0;
// 	for (let i = 0; i <= n; n++) sum += i;
// 	return sum;
// }
//timed(demo)(100);

// function tempoFuncao(o, f) {
// 	let _f = o[f];
// 	o[f] = function (...args) {
// 		let ini = new Date().getTime();
// 		console.time(f);
// 		let result = _f.apply(this, args);
// 		let int = new Date().getTime() - ini;
// 		console.log("Função '" + _f.name + "' processou em " + int + "ms");
// 		console.timeEnd(f);
// 		return result;
// 	};
// }
// let o = {
// 	m: function (msg) {
// 		console.log("funcao m inicial " + msg);
// 		console.log(this);
// 	},
// };
// tempoFuncao(o, "m");
// o.m("oi");

// HERANCA THIS
// console.log("1: ", this, " RAIZ");
// let estaA = () => {
// 	console.log("2: ", this);
// };
// let thisObjeto = {
// 	a: () => {
// 		console.log("4: ", this);
// 		function a_interno() {
// 			console.log("5: ", this);
// 		}
// 		return a_interno();
// 	},
// 	b: function () {
// 		console.log("6:", this);
// 		let b_interno = () => {
// 			console.log("7: ", this);
// 		};
// 		return b_interno();
// 	},
// 	c: function () {
// 		return {
// 			d: () => {
// 				console.log("8: ", this);
// 			},
// 		};
// 	},
// };
// estaA();
// let estaC = function funcaoThis(x, y) {
// 	console.log("3: ", this, x, y);
// }.bind(
// 	thisObjeto,
// 	"x"
// )("y");
// thisObjeto.a();
// thisObjeto.b();
// thisObjeto.c().d();
