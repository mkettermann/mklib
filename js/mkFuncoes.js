"use strict";
class Mapeador extends Map {
    vPadrao;
    constructor(vPadrao) {
        super();
        this.vPadrao = vPadrao;
    }
    get(key) {
        if (this.has(key)) {
            return super.get(key);
        }
        else {
            return this.vPadrao;
        }
    }
}
class mkHistogram {
    letrasConta;
    letrasTotal;
    constructor() {
        this.letrasConta = new Mapeador(0);
        this.letrasTotal = 0;
    }
    add(texto) {
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
            }
            else {
                return b[1] - a[1];
            }
        });
        for (let entrada of entradas) {
            entrada[1] = (entrada[1] / this.letrasTotal) * 100;
        }
        entradas = entradas.filter((entrada) => entrada[1] >= 1);
        let linhas = entradas.map(([l, n]) => `${l}: ${"#".repeat(Math.round(n))} ${n.toFixed(2)}%`);
        return linhas.join("\n");
    }
    static histogram = async (fonte) => {
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
const matrizApenasScrings = (matriz) => {
    let res = false;
    computar: if (matriz) {
        for (let x = 0; x < matriz.length; x++) {
            let l = matriz[x];
            if (!l)
                break computar;
            for (let y = 0; y < l.length; y++) {
                let cell = l[y];
                if (typeof cell !== "string")
                    break computar;
            }
        }
        res = true;
    }
    return res;
};
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			Avaliacao de funcoes				\\
//___________________________________\\
let arrayFuncoes;
const avaliarFuncoes = (alvo, stream = false) => {
    let fUnitario = new Set();
    // Converter para Teste
    function tempoFuncao(o, f) {
        let _f = o[f];
        o[f] = function (...args) {
            let ini = new Date().getTime();
            //console.log(this.name);
            if (stream)
                console.time(f);
            let result = _f.apply(this, args);
            let int = new Date().getTime() - ini;
            //console.log("Função '" + _f.name + "' processou em " + int + "ms");
            if (stream)
                console.timeEnd(f);
            let index = arrayFuncoes.findIndex((o) => o.Funcao == _f.name);
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
