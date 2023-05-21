"use strict";
var mkt2;
var t;
(function (t) {
    t["G"] = "GET";
    t["P"] = "POST";
    t["J"] = "application/json";
    t["H"] = "text/html";
    t["F"] = "multipart/form-data";
})(t || (t = {}));
class mk {
    static fullDados = [];
    static exibeDados = [];
    static exibePaginado = [];
    static sortDir = "d";
    static sortBy = "";
    static paginationAtual = 1;
    static objFiltro = {};
    static objetoSelecionado = {};
    static sendObjFull = {};
    static mkFaseAtual = 1;
    static mkCountValidate = 0;
    static contaOrdena = 0;
    static status = {
        totalFull: this.fullDados.length,
        totalFiltrado: this.exibeDados.length,
        totalPorPagina: this.exibePaginado.length,
        pagItensIni: 0,
        pagItensFim: 0,
        pagPorPagina: 5,
        totalPaginas: 0,
    };
    static Q = (query = "body") => {
        if (query instanceof HTMLElement)
            return query;
        return document.querySelector(query);
    };
    static QAll = (query = "body") => {
        return Array.from(document.querySelectorAll(query));
    };
    static Ao = (tipoEvento = "click", query, executar) => {
        mk.QAll(query).forEach((e) => {
            e.addEventListener(tipoEvento, () => {
                executar(e);
            });
        });
    };
    static atualizarPorPagina = () => {
        this.paginationAtual = 1;
        mk.atualizarLista();
    };
    static iniciarGetList = async (url) => {
        mk.Ao("input", "input[name='tablePorPagina']", () => {
            mk.atualizarPorPagina();
        });
        let retorno = await mk.http(url, t.G, t.J).then();
        if (retorno != null) {
            mk.mkBoolToStringOA(mk.mkLimparOA(retorno));
            if (Array.isArray(retorno)) {
                for (let i = 0; i < retorno.length; i++) {
                    mk.aoReceberDados(retorno[i]);
                }
            }
            else {
                if (typeof retorno == "object") {
                    mk.aoReceberDados(retorno);
                }
            }
            this.fullDados = this.exibeDados = retorno;
            mk.mkUpdateFiltro();
        }
    };
    static CarregarON = () => {
        if (mk.Q("body .CarregadorMkBlock") == null) {
            let divCarregadorMkBlock = document.createElement("div");
            divCarregadorMkBlock.className = "CarregadorMkBlock";
            let divCarregadorMk = document.createElement("div");
            divCarregadorMk.className = "CarregadorMk";
            let buttonCarregadorMkTopoDireito = document.createElement("button");
            buttonCarregadorMkTopoDireito.className = "CarregadorMkTopoDireito";
            buttonCarregadorMkTopoDireito.setAttribute("type", "button");
            buttonCarregadorMkTopoDireito.setAttribute("onClick", "mk.CarregarOFF()");
            let iCarregadorMk = document.createElement("i");
            iCarregadorMk.className = "bi bi-x-lg";
            buttonCarregadorMkTopoDireito.appendChild(iCarregadorMk);
            divCarregadorMkBlock.appendChild(divCarregadorMk);
            divCarregadorMkBlock.appendChild(buttonCarregadorMkTopoDireito);
            document.body.appendChild(divCarregadorMkBlock);
        }
        mk.Q("body .CarregadorMkBlock").classList.remove("oculto");
        mk.Q("body").classList.add("CarregadorMkSemScrollY");
    };
    static CarregarOFF = () => {
        if (mk.Q("body .CarregadorMkBlock") != null) {
            mk.Q("body .CarregadorMkBlock").classList.add("oculto");
        }
        mk.Q("body").classList.remove("CarregadorMkSemScrollY");
    };
    static http = async (url, metodo = t.G, tipo = t.J, dados = null, carregador = false) => {
        const mkaft = document.getElementsByName("__RequestVerificationToken")[0];
        let body = null;
        if (dados) {
            if (tipo == t.J) {
                body = JSON.stringify(dados);
            }
            else if (tipo == t.F) {
                body = dados;
            }
        }
        let h = {
            method: metodo,
            headers: {
                "Content-Type": tipo,
                "MKANTI-FORGERY-TOKEN": mkaft ? mkaft.value : "",
            },
            body: body,
        };
        if (carregador) {
            this.CarregarON();
        }
        console.groupCollapsed(h.method + ": " + url);
        console.time(url);
        console.info(">> TYPE: " + h.headers["Content-Type"]);
        console.groupCollapsed(">> Objeto Enviado");
        console.info(dados);
        console.info(body?.toString());
        console.groupEnd();
        console.groupEnd();
        const pacoteHttp = await fetch(url, h);
        if (!pacoteHttp.ok) {
            console.groupCollapsed("HTTP RETURN: " + pacoteHttp.status + " " + pacoteHttp.statusText);
            console.error("HTTP RETURN: Não retornou 200.");
            console.info(await pacoteHttp.text());
            console.groupEnd();
            if (carregador) {
                this.CarregarOFF();
            }
            return null;
        }
        let corpo = null;
        if (tipo == t.J) {
            corpo = await pacoteHttp.json();
        }
        else {
            corpo = await pacoteHttp.text();
        }
        if (carregador) {
            this.CarregarOFF();
        }
        console.groupCollapsed("RET " + h.method + " " + tipo.toUpperCase().split("/")[1] + ":");
        console.timeEnd(url);
        console.info(corpo);
        console.groupEnd();
        return corpo;
    };
}
mk.iniciarGetList("./Teste.json");
