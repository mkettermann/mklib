/**
 * Criado por Marcos Kettermann em 28/05/2023
 * Classe Util para manipulação de dados.
 */

class Mapeador extends Map {
	vPadrao;
	constructor(vPadrao: any) {
		super();
		this.vPadrao = vPadrao;
	}

	get(key: any) {
		if (this.has(key)) {
			return super.get(key);
		} else {
			return this.vPadrao;
		}
	}
}

class mkHistogram {
	letrasConta: Mapeador;
	letrasTotal: number;

	constructor() {
		this.letrasConta = new Mapeador(0);
		this.letrasTotal = 0;
	}

	add(texto: string) {
		texto = texto.replace(/\s/g, "").toUpperCase();
		for (let letra of texto) {
			let soma = this.letrasConta.get(letra);
			this.letrasConta.set(letra, soma + 1);
			this.letrasTotal++;
		}
	}

	toString() {
		let entradas = [...this.letrasConta];
		entradas.sort((a, b) => {
			if (a[1] === b[1]) {
				return a[0] < b[0] ? -1 : 1;
			} else {
				return b[1] - a[1];
			}
		});

		for (let entrada of entradas) {
			entrada[1] = (entrada[1] / this.letrasTotal) * 100;
		}
		entradas = entradas.filter((entrada) => entrada[1] >= 1);
		let linhas = entradas.map(([l, n]) => {
			`${l}: ${"#".repeat(Math.round(n))} ${n.toFixed(2)}%`;
		});
		linhas.join("\n");
	}
}

class mktrain {
	static histogram = async () => {
		const arq = fetch("./js/test.txt").then((data) => {
			let texto = data.text();
			return texto;
		});
		const coleta = await arq.then();
		console.log("texto: " + coleta);
		let h = new mkHistogram();
		for await (let bloco of coleta) {
			h.add(bloco);
		}
		return h;
	};
}

mktrain.histogram().then((r) => {
	console.log("Resumo");
	console.log(r.toString());
});

// Matriz de strings com um inteiro
let ma = [
	["a", "b", "c"],
	["d", 1, "f"],
	["g", "h", "i"],
];
// Interromper fora break externo com condição no centro.
const girarMatriz = () => {
	let res = false;
	computar: if (ma) {
		for (let x = 0; x < ma.length; x++) {
			let l = ma[x];
			if (!l) break computar;
			for (let y = 0; y < l.length; y++) {
				let cell = l[y];
				if (typeof cell !== "string") break computar;
				console.log(cell);
			}
		}
		res = true;
	}
	return res;
};
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
		if (n > this._num) this._num = n;
		else throw new Error("Número serial só pode alterar por um número maior.");
	},
};

const s2 = Object.create(s);
const s3 = Object.assign(s);
const s4 = mk.mkMerge(s);
const s5 = "ok";
