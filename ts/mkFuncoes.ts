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

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			Avaliacao de funcoes				\\
//___________________________________\\
let arrayFuncoes: any;
const avaliarFuncoes = (alvo: any, stream: boolean = false) => {
	let fUnitario = new Set();
	// Converter para Teste
	function tempoFuncao(o: any, f: any) {
		let _f = o[f];
		o[f] = function (...args: any[]) {
			let ini = new Date().getTime();
			//console.log(this.name);
			if (stream) console.time(f);
			let result = _f.apply(this, args);
			let int = new Date().getTime() - ini;
			//console.log("Função '" + _f.name + "' processou em " + int + "ms");
			if (stream) console.timeEnd(f);
			let index = arrayFuncoes.findIndex((o: any) => o.Funcao == _f.name);
			if (index >= 0) {
				let exe = arrayFuncoes[index].Execucoes;
				let tMedio = arrayFuncoes[index].TempoMedio;
				arrayFuncoes[index].Execucoes = ++exe;
				arrayFuncoes[index].TempoMedio = (tMedio * (exe - 1) + int) / exe;
			}
			return result;
		};
	}
	// Popular Set
	for (let p in alvo) {
		if (typeof alvo[p] == "function") {
			let o = {
				Funcao: alvo[p].name,
				TempoMedio: 0,
				Execucoes: 0,
			};
			fUnitario.add(o);
		}
	}
	// Executa Converter no alvo
	arrayFuncoes = Array.from(fUnitario);
	for (let k of arrayFuncoes) {
		tempoFuncao(alvo, k.Funcao);
	}
	// setTimeout(() => {
	// 	console.log("ALVO: " + alvo.name + " TIPO: " + typeof alvo);
	// 	console.table(Array.from(this.arrayFuncoes));
	// }, 1000);
};
//avaliarFuncoes(mk);

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			Avaliacao de funcoes				\\
//___________________________________\\
// Obter informações da situação atual do objeto.
// Os métodos get são executados no for.
// Se o objeto possuir algum gatilho no get, o objeto pode sofrer mudanças durante a consulta.
const mkInfoObject = (o: any) => {
	try {
		function modeloInfo(prop: any, obj: any, iteradoEm: string) {
			return {
				TIPO: (typeof obj[prop]).toUpperCase(),
				NOME: prop,
				VALOR: obj[prop],
				ENUMERABLE: obj.propertyIsEnumerable(prop),
				OWN: obj.hasOwnProperty(prop),
				Key: Object.keys(obj).some((e) => e == prop),
				O_N: Object.getOwnPropertyNames(obj).some((e) => e == prop),
				Ref: Reflect.ownKeys(obj).some((e) => e == prop),
				Sym: Object.getOwnPropertySymbols(o).some((e) => e == prop),
				"ITERADO EM": iteradoEm,
			};
		}
		function hasInModelo(obj: any, array: any, iteradoEm: string) {
			let resultado = false;
			array.forEach((o: any) => {
				if (o.NOME == obj.NOME) {
					o["ITERADO EM"] += "|" + iteradoEm;
					resultado = true;
				}
			});
			return resultado;
		}
		function preparar(p: any, o: any, array: any, iteradoEm: string) {
			let oNovo: any = modeloInfo(p, o, iteradoEm);
			if (!hasInModelo(oNovo, tab, iteradoEm)) {
				array.push(oNovo);
			}
		}
		let tab: any = [];
		let tab2: any = [];
		console.group("MK Info Object: ");
		console.info("TO STRING: " + o.toString());
		let stringfyObj = JSON.stringify(o);
		console.log(o);
		preparar("toString", o, tab2, "TESTE");
		preparar("toLocaleString", o, tab2, "TESTE");
		preparar("toJSON", o, tab2, "TESTE");
		for (let p in o) {
			preparar(p, o, tab, "In");
		}
		let arrayKeys = Object.keys(o);
		for (let i = 0; i < arrayKeys.length; i++) {
			preparar(arrayKeys[i], o, tab, "Key");
		}
		let arrayOwnNames = Object.getOwnPropertyNames(o);
		for (let i = 0; i < arrayOwnNames.length; i++) {
			preparar(arrayOwnNames[i], o, tab, "O_N");
		}
		let arraySym = Object.getOwnPropertySymbols(o);
		for (let i = 0; i < arraySym.length; i++) {
			preparar(arraySym[i], o, tab, "O_S");
		}
		let arrayReflect = Reflect.ownKeys(o);
		for (let i = 0; i < arrayReflect.length; i++) {
			preparar(arrayReflect[i], o, tab, "Ref");
		}
		mk.ordenar(tab, "TIPO", true);
		console.table(tab);
		console.table(tab2);
		let stringfyObjPos = JSON.stringify(o);
		if (stringfyObj != stringfyObjPos) {
			console.warn(
				"O Objeto sofreu alteração durante a consulta: " + JSON.stringify(o)
			);
			// Setters são executados durante iterações.
		} else {
			console.log(JSON.stringify(o));
		}
		console.groupEnd();
	} catch (e) {
		console.error(e);
	}
};
