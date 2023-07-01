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
