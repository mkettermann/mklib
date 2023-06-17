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
		let linhas = entradas.map(
			([l, n]) => `${l}: ${"#".repeat(Math.round(n))} ${n.toFixed(2)}%`
		);
		return linhas.join("\n");
	}

	static histogram = async (fonte: string) => {
		const arq = fetch(fonte).then((data) => {
			let texto = data.text();
			return texto;
		});
		const coleta = await arq.then();
		let h = new mkHistogram();
		for await (let c of coleta) {
			h.add(c);
		}
		return h;
	};
}

// Interromper fora break externo com condição no centro.
const matrizApenasScrings = (matriz: any) => {
	let res = false;
	computar: if (matriz) {
		for (let x = 0; x < matriz.length; x++) {
			let l = matriz[x];
			if (!l) break computar;
			for (let y = 0; y < l.length; y++) {
				let cell = l[y];
				if (typeof cell !== "string") break computar;
			}
		}
		res = true;
	}
	return res;
};
