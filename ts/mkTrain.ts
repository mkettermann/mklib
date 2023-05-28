#!/usr/bin/node
/**
 * Criado por Marcos Kettermann em 28/05/2023
 * Classe Util para manipulação de dados.
 */

class Mapeador extends Map {
	vPadrao;
	constructor(vPadrao) {
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
		process.stdin.setEncoding("utf-8");
		let h = new mkHistogram();
		for await (let bloco of process.stdin) {
			h.add(bloco);
		}
		return h;
	};
}

mktrain.histogram().then((r) => {
	console.log(r.toString());
});
console.log("Executou");
