"use strict";
var mkt;
var mkt2;
class mk {
    static fullDados = [];
    static exibeDados = [];
    static exibePaginado = [];
    static sortDir = "a";
    static sortBy = "";
    static paginationAtual = 1;
    static objFiltro = [];
    static objetoSelecionado = {};
    static sendObjFull = {};
    static mkFaseAtual = 1;
    static mkCountValidate = 0;
    static contaOrdena = 0;
    static debug = 0;
    static status = {
        totalFull: this.fullDados.length,
        totalFiltrado: this.exibeDados.length,
        totalPorPagina: this.exibePaginado.length,
        pagItensIni: 0,
        pagItensFim: 0,
        pagPorPagina: 5,
        totalPaginas: 0,
    };
    static t = {
        G: "GET",
        P: "POST",
        J: "application/json",
        H: "text/html",
        F: "multipart/form-data",
    };
    static MESES = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];
    static CORES = {
        VERMELHO: "#F00",
        VERDE: "#0F0",
        AZUL: "#00F",
        BRANCO: "#FFF",
        PRETO: "#000",
        VERDEFLORESTA: "#070",
        VERDEFOLHA: "#0A0",
        VERDEABACATE: "#9F0",
        AMARELO: "#FF0",
        LARANJA: "#F90",
        AZULESCURO: "#009",
        AZULPISCINA: "#0FF",
        AZULCEU: "#09F",
        ROSA: "#F0F",
        ROXO: "#70F",
        MAGENTA: "#F09",
        OURO: "#FB1",
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
    static isJson = (s) => {
        try {
            JSON.parse(s);
        }
        catch (e) {
            return false;
        }
        return true;
    };
    static mkExecutaNoObj = (oa, func) => {
        if (Array.isArray(oa)) {
            for (let i = 0; i < oa.length; i++) {
                func(oa[i]);
            }
        }
        else {
            func(oa);
        }
        return oa;
    };
    static mkLimparOA = (oa) => {
        function mkLimparOA_Execute(o) {
            for (var propName in o) {
                if (o[propName] === null ||
                    o[propName] === "") {
                    delete o[propName];
                }
            }
            return o;
        }
        return mk.mkExecutaNoObj(oa, mkLimparOA_Execute);
    };
    static mkGerarObjeto = (este) => {
        let form = este;
        if (typeof este != "object") {
            form = mk.Q(este);
        }
        let rObjeto = mk.mkLimparOA(Object.fromEntries(new FormData(form).entries()));
        console.groupCollapsed("Objeto Gerado: ");
        console.info(rObjeto);
        console.groupEnd();
        return rObjeto;
    };
    static QSet = (query = "body", valor = null) => {
        if (valor != null) {
            mk.Q(query).value = valor;
        }
        else {
            mk.Q(query).value = "";
        }
        return mk.Q(query);
    };
    static QSetAll = (query = "input[name='#PROP#']", o = null) => {
        let eAfetados = [];
        if (o != null) {
            if (typeof o == "object" && !Array.isArray(o)) {
                for (let p in o) {
                    let eDynamicQuery = mk.Q(query.replace("#PROP#", p));
                    if (eDynamicQuery) {
                        if (o[p]) {
                            eDynamicQuery.value = o[p];
                            eDynamicQuery.classList.add("atualizar");
                            eAfetados.push(eDynamicQuery);
                        }
                    }
                }
            }
            else
                console.warn("QSetAll - Precisa receber um objeto: " + o);
        }
        else
            console.warn("QSetAll - Objeto não pode ser nulo: " + o);
        return eAfetados;
    };
    static Qon = (query = "body") => {
        let temp = mk.Q(query);
        temp.disabled = false;
        temp.classList.remove("disabled");
        return temp;
    };
    static Qoff = (query = "body") => {
        let temp = mk.Q(query);
        temp.disabled = true;
        temp.classList.add("disabled");
        return temp;
    };
    static QverOn = (query = "body") => {
        let temp = mk.Q(query);
        temp.classList.remove("oculto");
        return temp;
    };
    static QverOff = (query = "body") => {
        let temp = mk.Q(query);
        temp.classList.add("oculto");
        return temp;
    };
    static QdataGet = (query = "body", atributoNome) => {
        return mk.Q(query).getAttribute("data-" + atributoNome);
    };
    static QdataSet = (query = "body", atributoNome, atributoValor) => {
        return mk.Q(query).setAttribute("data-" + atributoNome, atributoValor);
    };
    static GetParam = (name = null) => {
        if (name != null) {
            return new URL(document.location.toString()).searchParams.get(name);
        }
        else {
            return new URL(document.location.toString()).searchParams;
        }
    };
    static isVisible = (e) => {
        return (e.offsetWidth > 0 || e.offsetHeight > 0 || e.getClientRects().length > 0);
    };
    static isFloat = (x) => {
        if (!isNaN(x)) {
            if (parseInt(x) != parseFloat(x)) {
                return true;
            }
        }
        return false;
    };
    static mkInfoObject = (o) => {
        try {
            function modeloInfo(prop, obj, iteradoEm) {
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
            function hasInModelo(obj, array, iteradoEm) {
                let resultado = false;
                array.forEach((o) => {
                    if (o.NOME == obj.NOME) {
                        o["ITERADO EM"] += "|" + iteradoEm;
                        resultado = true;
                    }
                });
                return resultado;
            }
            function preparar(p, o, array, iteradoEm) {
                let oNovo = modeloInfo(p, o, iteradoEm);
                if (!hasInModelo(oNovo, tab, iteradoEm)) {
                    array.push(oNovo);
                }
            }
            let tab = [];
            let tab2 = [];
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
                console.warn("O Objeto sofreu alteração durante a consulta: " + JSON.stringify(o));
            }
            else {
                console.log(JSON.stringify(o));
            }
            console.groupEnd();
        }
        catch (e) {
            console.error(e);
        }
    };
    static mkSelDlRefill = async (eName, cod = null) => {
        let e = mk.Q(eName);
        let url = appPath + e.getAttribute("data-refill");
        cod != null ? (url += cod) : null;
        let retorno = await mk.http(url, mk.t.G, mk.t.J);
        if (retorno != null) {
            let kv = retorno;
            if (typeof retorno == "object") {
                kv = JSON.stringify(retorno);
            }
            if (mk.isJson(kv)) {
                e.setAttribute("data-selarray", kv);
                e.classList.add("atualizar");
            }
            else {
                console.error("Resultado não é um JSON. (mkSelDlRefill)");
            }
        }
    };
    static getServerOn = async (url) => {
        let retorno = await mk.http(url, mk.t.G, mk.t.J);
        if (retorno !== true) {
            mk.detectedServerOff();
        }
    };
    static detectedServerOff = () => {
        if (mk.Q("body .offlineBlock") == null) {
            let divOfflineBlock = document.createElement("div");
            divOfflineBlock.className = "offlineBlock";
            let divOfflineBlockInterna = document.createElement("div");
            divOfflineBlockInterna.className = "text-center";
            divOfflineBlockInterna.innerHTML = "Servidor OFF-LINE";
            let buttonOfflineBlock = document.createElement("button");
            buttonOfflineBlock.setAttribute("type", "button");
            buttonOfflineBlock.setAttribute("onClick", "mk.detectedServerOff_display()");
            let iOfflineBlock = document.createElement("i");
            iOfflineBlock.className = "bi bi-x-lg";
            buttonOfflineBlock.appendChild(iOfflineBlock);
            divOfflineBlock.appendChild(divOfflineBlockInterna);
            divOfflineBlock.appendChild(buttonOfflineBlock);
            document.body.appendChild(divOfflineBlock);
        }
        mk.Q("body .offlineBlock").classList.remove("oculto");
    };
    static detectedServerOff_display = () => {
        mk.Q("body .offlineBlock").classList.add("oculto");
    };
    static mkOnlyFloatKeys = (ev) => {
        let permitido = "0123456789,-";
        let isNegado = true;
        for (var i = 0; i < permitido.length; i++) {
            if (permitido[i] == ev.key.toString()) {
                isNegado = false;
            }
        }
        ev.key == "ArrowLeft" ? (isNegado = false) : null;
        ev.key == "ArrowRight" ? (isNegado = false) : null;
        ev.key == "Backspace" ? (isNegado = false) : null;
        ev.key == "Delete" ? (isNegado = false) : null;
        ev.key == "Tab" ? (isNegado = false) : null;
        isNegado ? ev.preventDefault() : null;
    };
    static mkEventBlock = (ev) => {
        console.error("Negado");
        ev.preventDefault();
    };
    static mkTrocaPontoPorVirgula = (query) => {
        mk.QAll(query).forEach((e) => {
            e.innerHTML = e.innerHTML.replaceAll(".", ",");
        });
    };
    static mkSelecionarInner = (e) => {
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(e);
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    };
    static mkInputFormatarValor = (e) => {
        e.value = mk.mkDuasCasas(mk.mkFloat(e.value));
    };
    static mkMedia = (menor, maior) => {
        return mk.mkDuasCasas((mk.mkFloat(menor) + mk.mkFloat(maior)) / 2);
    };
    static mkFloat = (num) => {
        let ret;
        if (typeof num != "number") {
            ret = parseFloat(num.toString().replaceAll(".", "").replaceAll(",", "."));
        }
        else {
            ret = num;
        }
        if (isNaN(ret)) {
            ret = 0;
        }
        return ret;
    };
    static mkDuasCasas = (num) => {
        return mk.mkFloat(num).toFixed(2).replaceAll(".", ",");
    };
    static mkEmReais = (num) => {
        return mk.mkFloat(num).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        });
    };
    static mkBase64 = (arquivo, tagImg, tagHidden) => {
        let leitor = new FileReader();
        leitor.onload = () => {
            mk.Q(tagImg).src = leitor.result;
            mk.Q(tagHidden).value = leitor.result;
        };
        leitor.readAsDataURL(arquivo);
    };
    static mkClonarOA = (oa) => {
        if (Array.isArray(oa)) {
            return Array.from(oa);
        }
        else {
            let novoO = {};
            if (typeof oa === "object") {
                for (let p in oa) {
                    novoO[p] = oa[p];
                }
            }
            return novoO;
        }
    };
    static mkMerge = (o, ...fontes) => {
        for (let fonte of fontes) {
            for (let k of Object.keys(fonte)) {
                if (!(k in o)) {
                    o[k] = fonte[k];
                }
            }
        }
        return o;
    };
    static getFormFrom = (e) => {
        let eForm = e;
        while (eForm.tagName != "FORM") {
            eForm = eForm.parentElement;
            if (eForm.tagName == "BODY") {
                console.error("Não foi possível encontrar o elemento FORM na busca getFormFrom()");
                break;
            }
        }
        return eForm;
    };
    static encheArray = (arrTemplate, inicio = 1, total) => {
        let novaArray = [];
        if (Array.isArray(arrTemplate)) {
            if (arrTemplate.length > 0) {
                if (arrTemplate.length < inicio) {
                    console.error("O arrTemplate tem menos itens do que o informado para o inicio");
                    return novaArray;
                }
            }
            else {
                console.error("Função encheArray precisa receber ao menos 1 item em arrTemplate.");
                return novaArray;
            }
        }
        else {
            console.error("Função encheArray precisa receber uma array com dados em arrTemplate.");
            return novaArray;
        }
        if (inicio <= 0) {
            console.error("O inicio precisa ser maior que zero.");
            return novaArray;
        }
        if (total == null)
            total = arrTemplate.length;
        let proximo = inicio;
        for (let c = 0; c < total; c++) {
            novaArray.push(arrTemplate[proximo - 1]);
            proximo++;
            if (proximo > arrTemplate.length) {
                proximo = 1;
            }
        }
        return novaArray;
    };
    static encheArrayUltimos = (arrTemplate, fim = 1, total) => {
        let novaArray = [];
        if (Array.isArray(arrTemplate)) {
            if (arrTemplate.length > 0) {
                if (arrTemplate.length < fim) {
                    console.error("O arrTemplate tem menos itens do que o informado para o fim.");
                    return novaArray;
                }
            }
            else {
                console.error("Função encheArrayUltimos precisa receber ao menos 1 item em arrTemplate.");
                return novaArray;
            }
        }
        else {
            console.error("Função encheArrayUltimos precisa receber uma array com dados em arrTemplate.");
            return novaArray;
        }
        if (fim <= 0) {
            console.error("O fim precisa ser maior que zero.");
            return novaArray;
        }
        if (total == null)
            total = arrTemplate.length;
        let anterior = fim;
        for (let c = total; c > 0; c--) {
            novaArray = [arrTemplate[anterior - 1], ...novaArray];
            anterior--;
            if (anterior <= 0) {
                anterior = arrTemplate.length;
            }
        }
        return novaArray;
    };
    static getMs = (dataYYYYMMDD = null) => {
        if (dataYYYYMMDD != null) {
            let dataCortada = dataYYYYMMDD.split("-");
            let oDia = Number(dataCortada[2]);
            let oMes = Number(dataCortada[1]) - 1;
            let oAno = Number(dataCortada[0]);
            return new Date(oAno, oMes, oDia).getTime();
        }
        else
            return new Date().getTime();
    };
    static hojeMkData = () => {
        return new Date(mk.getMs()).toLocaleDateString();
    };
    static hojeMkHora = () => {
        return new Date(Number(mk.getMs())).toLocaleTimeString();
    };
    static hoje = () => {
        let mkFullData = mk.hojeMkData() + " " + mk.hojeMkHora();
        return mkFullData;
    };
    static getFullData = (ms = null) => {
        if (ms != null)
            return (new Date(ms).getFullYear() +
                "-" +
                (new Date(ms).getMonth() + 1) +
                "-" +
                new Date(ms).getDate());
        else
            return (new Date().getFullYear() +
                "-" +
                (new Date().getMonth() + 1) +
                "-" +
                new Date().getDate());
    };
    static getDia = (ms = null) => {
        if (ms != null)
            return Number(mk.getFullData(ms).split("-")[2]);
        else
            return Number(mk.getFullData().split("-")[2]);
    };
    static getMes = (ms = null) => {
        if (ms != null)
            return Number(mk.getFullData(ms).split("-")[1]);
        else
            return Number(mk.getFullData().split("-")[1]);
    };
    static getAno = (ms = null) => {
        if (ms != null)
            return Number(mk.getFullData(ms).split("-")[0]);
        else
            return Number(mk.getFullData().split("-")[0]);
    };
    static getDiasDiferenca = (msOld, msNew = null) => {
        if (msNew == null)
            msNew = mk.getMs();
        return mk.transMsEmDias(msNew - msOld);
    };
    static transMsEmSegundos = (ms) => {
        return Math.trunc(ms / 1000);
    };
    static transMsEmMinutos = (ms) => {
        return Math.trunc(ms / 60000);
    };
    static transMsEmHoras = (ms) => {
        return Math.trunc(ms / 3600000);
    };
    static transMsEmDias = (ms) => {
        return Math.trunc(ms / 86400000);
    };
    static transSegundosEmMs = (s) => {
        return s * 1000;
    };
    static transMinutosEmMs = (m) => {
        return m * 60000;
    };
    static transHorasEmMs = (h) => {
        return h * 3600000;
    };
    static transDiasEmMs = (d) => {
        return d * 86400000;
    };
    static frequencia = (array) => {
        let f = {};
        for (let e of array) {
            f[e] ? f[e]++ : (f[e] = 1);
        }
        return f;
    };
    static mkYYYYMMDDtoDDMMYYYY = (dataYYYYMMDD) => {
        let arrayData = dataYYYYMMDD.split("-");
        let stringRetorno = "";
        if (arrayData.length >= 3) {
            stringRetorno = arrayData[2] + "/" + arrayData[1] + "/" + arrayData[0];
        }
        else {
            stringRetorno = dataYYYYMMDD;
        }
        return stringRetorno;
    };
    static mkFormatarDataOA = (oa) => {
        function mkFormatarDataOA_Execute(o) {
            let busca = new RegExp("^[0-2][0-9]{3}[-][0-1][0-9][-][0-3][0-9]$");
            for (var propName in o) {
                if (busca.test(o[propName])) {
                    o[propName] = mk.mkYYYYMMDDtoDDMMYYYY(o[propName]);
                }
            }
            return o;
        }
        return mk.mkExecutaNoObj(oa, mkFormatarDataOA_Execute);
    };
    static mkBoolToSimNaoOA = (oa) => {
        function mkBoolToSimNaoOA_Execute(o) {
            for (var propName in o) {
                if (o[propName].toString().toLowerCase() === "true" ||
                    o[propName] === true) {
                    o[propName] = "Sim";
                }
                if (o[propName].toString().toLowerCase() === "false" ||
                    o[propName] === false) {
                    o[propName] = "N&atilde;o";
                }
            }
            return o;
        }
        return mk.mkExecutaNoObj(oa, mkBoolToSimNaoOA_Execute);
    };
    static mkFormatarOA = (oa) => {
        return mk.mkBoolToSimNaoOA(mk.mkFormatarDataOA(mk.mkLimparOA(oa)));
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
    static http = async (url, metodo = mk.t.G, tipo = mk.t.J, dados = null, carregador = false) => {
        const mkaft = document.getElementsByName("__RequestVerificationToken")[0];
        let body = null;
        let headers = new Headers();
        headers.append("MKANTI-FORGERY-TOKEN", mkaft ? mkaft.value : "");
        if (dados != null) {
            if (tipo == mk.t.J) {
                headers.append("Content-Type", tipo);
                body = JSON.stringify(dados);
            }
            else if (tipo == mk.t.F) {
                body = dados;
            }
        }
        let pacote = {
            method: metodo,
            headers: headers,
            body: body,
        };
        if (carregador) {
            this.CarregarON();
        }
        console.groupCollapsed(pacote.method + ": " + url);
        console.time(url);
        if (mk.debug == 1) {
            console.groupCollapsed(">> Cabecalho do pacote");
            console.info(Object.fromEntries(headers.entries()));
            console.groupCollapsed(">> Pacote full");
            console.info(pacote);
            console.groupEnd();
            console.groupEnd();
        }
        if (metodo == mk.t.P) {
            console.groupCollapsed(">> Objeto Enviado (Body)");
            console.group(">>> Dados de entrada");
            console.info(dados);
            console.groupEnd();
            console.groupCollapsed(">>> Processado em String");
            console.info(body?.toString());
            console.groupEnd();
            if (typeof dados == "object") {
                if (dados.entries != null) {
                    console.groupCollapsed(">>> Form Object");
                    console.info(Object.fromEntries(dados.entries()));
                    console.groupEnd();
                }
            }
            console.groupEnd();
        }
        console.groupEnd();
        const pacoteHttp = await fetch(url, pacote);
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
        if (tipo == mk.t.J) {
            corpo = await pacoteHttp.json();
        }
        else {
            corpo = await pacoteHttp.text();
        }
        if (carregador) {
            this.CarregarOFF();
        }
        console.groupCollapsed("RET " + pacote.method + " " + tipo.toUpperCase().split("/")[1] + ":");
        console.timeEnd(url);
        console.info(corpo);
        console.groupEnd();
        return corpo;
    };
    static getObjetoFromId = (nomeKey, valorKey, listaDados) => {
        let temp = null;
        if (Array.isArray(listaDados)) {
            listaDados.forEach((o) => {
                if (o[nomeKey] == valorKey) {
                    temp = o;
                }
            });
        }
        return temp;
    };
    static setObjetoFromId = (nomeKey, valorKey, itemModificado, listaDados) => {
        if (Array.isArray(listaDados)) {
            listaDados.forEach((o) => {
                if (o[nomeKey] == valorKey) {
                    o = itemModificado;
                }
            });
        }
        return listaDados;
    };
    static delObjetoFromId = (nomeKey, valorKey, listaDados) => {
        let temp = [];
        if (Array.isArray(listaDados)) {
            listaDados.forEach((o) => {
                if (o[nomeKey] != valorKey) {
                    temp.push(o);
                }
            });
        }
        else {
            temp = listaDados;
        }
        return temp;
    };
    static aoCompletarExibicao = () => { };
    static antesDePopularTabela = () => { };
    static atualizarStatusLista = () => {
        if (mk.Q("input[name='tablePorPagina']") == null) {
            mk.status.pagPorPagina = 5;
        }
        else {
            mk.status.pagPorPagina = Number(mk.Q("input[name='tablePorPagina']").value);
        }
        mk.status.totalFull = this.fullDados.length;
        mk.status.totalFiltrado = this.exibeDados.length;
        mk.status.totalPorPagina = this.exibePaginado.length;
        mk.status.pagItensIni =
            (this.paginationAtual - 1) * mk.status.pagPorPagina + 1;
        mk.status.pagItensFim =
            mk.status.pagItensIni + (mk.status.pagPorPagina - 1);
        if (mk.status.pagItensFim > mk.status.totalFiltrado) {
            mk.status.pagItensFim = mk.status.totalFiltrado;
        }
        mk.status.totalPaginas = Math.ceil(this.exibeDados.length / mk.status.pagPorPagina);
    };
    static ativaPaginaAtual = () => {
        mk.QAll(".paginate_button").forEach((item) => {
            item.classList.remove("active");
        });
        mk.QAll(".paginate_button .page-link").forEach((item) => {
            if (this.paginationAtual == Number(item.innerHTML)) {
                item.parentElement?.classList.add("active");
            }
        });
    };
    static filtraPagination = () => {
        mk.Q(".tableResultado .tableIni").innerHTML =
            mk.status.pagItensIni.toString();
        mk.Q(".tableResultado .tableFim").innerHTML =
            mk.status.pagItensFim.toString();
        mk.Q(".tablePaginacao .paginate_Ultima a").innerHTML =
            mk.status.totalPaginas.toString();
        if (this.paginationAtual == 1) {
            mk.Q(".tablePaginacao .pagBack").classList.add("disabled");
        }
        else {
            mk.Q(".tablePaginacao .pagBack").classList.remove("disabled");
        }
        if (this.paginationAtual >= mk.status.totalPaginas) {
            mk.Q(".tablePaginacao .pagNext").classList.add("disabled");
        }
        else {
            mk.Q(".tablePaginacao .pagNext").classList.remove("disabled");
        }
        if (mk.status.totalPaginas > 2) {
            mk.Q(".tablePaginacao .pageCod2").classList.remove("oculto");
        }
        else {
            mk.Q(".tablePaginacao .pageCod2").classList.add("oculto");
        }
        if (mk.status.totalPaginas > 3) {
            mk.Q(".tablePaginacao .pageCod3").classList.remove("oculto");
        }
        else {
            mk.Q(".tablePaginacao .pageCod3").classList.add("oculto");
        }
        if (mk.status.totalPaginas > 4) {
            mk.Q(".tablePaginacao .pageCod4").classList.remove("oculto");
        }
        else {
            mk.Q(".tablePaginacao .pageCod4").classList.add("oculto");
        }
        if (mk.status.totalPaginas > 5) {
            mk.Q(".tablePaginacao .pageCod5").classList.remove("oculto");
        }
        else {
            mk.Q(".tablePaginacao .pageCod5").classList.add("oculto");
        }
        if (mk.status.totalPaginas > 6) {
            mk.Q(".tablePaginacao .pageCod6").classList.remove("oculto");
        }
        else {
            mk.Q(".tablePaginacao .pageCod6").classList.add("oculto");
        }
        if (this.paginationAtual < 5) {
            mk.Q(".tablePaginacao .pageCod2").classList.remove("disabled");
            mk.Q(".tablePaginacao .pageCod2 a").innerHTML = "2";
            mk.Q(".tablePaginacao .pageCod3 a").innerHTML = "3";
            mk.Q(".tablePaginacao .pageCod4 a").innerHTML = "4";
            mk.Q(".tablePaginacao .pageCod5 a").innerHTML = "5";
            mk.Q(".tablePaginacao .pageCod6 a").innerHTML = "...";
            mk.Q(".tablePaginacao .pageCod6").classList.add("disabled");
        }
        else {
            if (mk.status.totalPaginas - this.paginationAtual < 4) {
                mk.Q(".tablePaginacao .pageCod2").classList.add("disabled");
                mk.Q(".tablePaginacao .pageCod2 a").innerHTML = "...";
                mk.Q(".tablePaginacao .pageCod3 a").innerHTML = (mk.status.totalPaginas - 4).toString();
                mk.Q(".tablePaginacao .pageCod4 a").innerHTML = (mk.status.totalPaginas - 3).toString();
                mk.Q(".tablePaginacao .pageCod5 a").innerHTML = (mk.status.totalPaginas - 2).toString();
                mk.Q(".tablePaginacao .pageCod6 a").innerHTML = (mk.status.totalPaginas - 1).toString();
                mk.Q(".tablePaginacao .pageCod6").classList.remove("disabled");
            }
            else {
                mk.Q(".tablePaginacao .pageCod2").classList.add("disabled");
                mk.Q(".tablePaginacao .pageCod2 a").innerHTML = "...";
                mk.Q(".tablePaginacao .pageCod3 a").innerHTML = (this.paginationAtual - 1).toString();
                mk.Q(".tablePaginacao .pageCod4 a").innerHTML =
                    this.paginationAtual.toString();
                mk.Q(".tablePaginacao .pageCod5 a").innerHTML = (this.paginationAtual + 1).toString();
                mk.Q(".tablePaginacao .pageCod6 a").innerHTML = "...";
                mk.Q(".tablePaginacao .pageCod6").classList.add("disabled");
            }
        }
        mk.ativaPaginaAtual();
        this.exibePaginado = [];
        this.exibeDados.forEach((item, i) => {
            if (i + 1 >= mk.status.pagItensIni && i + 1 <= mk.status.pagItensFim) {
                let objItem = new Object();
                let o = item;
                for (var propName in o) {
                    objItem[propName] = o[propName];
                }
                this.exibePaginado.push(objItem);
            }
        });
    };
    static mkFiltragemDados = () => {
        if (Array.isArray(this.fullDados)) {
            let temp = [];
            this.fullDados.forEach((o) => {
                let podeExibir = true;
                for (let propFiltro in mk.objFiltro) {
                    if (o[propFiltro] != null) {
                        let m = o[propFiltro];
                        let k = this.objFiltro[propFiltro];
                        if (k.formato === "string") {
                            k.conteudo = k.conteudo.toString().toLowerCase();
                            if (!m.toString().toLowerCase().match(k.conteudo) &&
                                k.conteudo !== "0") {
                                podeExibir = false;
                            }
                        }
                        else if (k.formato === "stringNumerosVirgula") {
                            let filtroInvertido = false;
                            let numerosMDaString = m.toString().split(",");
                            if (this.isJson(k.conteudo)) {
                                JSON.parse(k.conteudo).map((numeroK) => {
                                    filtroInvertido = numerosMDaString.some((numeroM) => {
                                        return Number(numeroM) == Number(numeroK);
                                    });
                                    if (!filtroInvertido) {
                                        podeExibir = false;
                                    }
                                });
                            }
                            else
                                console.warn("Não é um JSON");
                        }
                        else if (k.formato === "number") {
                            if (Number(m) !== Number(k.conteudo) &&
                                Number(k.conteudo) !== 0) {
                                podeExibir = false;
                            }
                        }
                        else if (k.formato === "date") {
                            let dateM = new Date(m).getTime();
                            let dateK = new Date(k.conteudo).getTime();
                            if (k.operador === ">=") {
                                if (!(dateM >= dateK)) {
                                    podeExibir = false;
                                }
                            }
                            else if (k.operador === "<=") {
                                if (!(dateM <= dateK)) {
                                    podeExibir = false;
                                }
                            }
                            else if (k.operador === ">") {
                                if (!(dateM > dateK)) {
                                    podeExibir = false;
                                }
                            }
                            else if (k.operador === "<") {
                                if (!(dateM < dateK)) {
                                    podeExibir = false;
                                }
                            }
                            else {
                                if (!(dateM == dateK)) {
                                    podeExibir = false;
                                }
                            }
                        }
                    }
                    else {
                        if (propFiltro != "mkFullFiltro") {
                            podeExibir = false;
                        }
                    }
                }
                if (podeExibir) {
                    if (this.objFiltro["mkFullFiltro"]) {
                        let k = this.objFiltro["mkFullFiltro"]["conteudo"]
                            .toString()
                            .toLowerCase();
                        podeExibir = false;
                        for (var propNameItem in o) {
                            let m = o[propNameItem];
                            if (m != null) {
                                m = m.toString().toLowerCase();
                                if (m.match(k)) {
                                    podeExibir = true;
                                }
                            }
                        }
                    }
                }
                if (podeExibir) {
                    temp.push(o);
                }
            });
            this.exibeDados = temp;
        }
        else {
            this.exibeDados = [];
        }
    };
    static atualizarLista = () => {
        let tablePaginacao = mk.Q(".tablePaginacao");
        if (tablePaginacao) {
            mk.mkFiltragemDados();
            mk.atualizarStatusLista();
            let labelTotal = mk.Q(".tableResultado .tableTotal");
            if (labelTotal != null) {
                labelTotal.innerHTML = mk.status.totalFull.toString();
            }
            let labelFiltrado = mk.Q(".tableResultado .tableFiltrado");
            if (labelFiltrado != null) {
                labelFiltrado.innerHTML = mk.status.totalFiltrado.toString();
            }
            let labelInicio = mk.Q(".tableResultado .tableIni");
            if (labelInicio != null) {
                labelInicio.innerHTML = mk.status.pagItensIni.toString();
            }
            let labelFinal = mk.Q(".tableResultado .tableFim");
            if (labelFinal != null) {
                labelFinal.innerHTML = mk.status.pagItensFim.toString();
            }
            if (this.exibeDados.length > mk.status.pagPorPagina) {
                mk.Q(".tablePaginacao").removeAttribute("hidden");
            }
            else {
                mk.Q(".tablePaginacao").setAttribute("hidden", "");
            }
            if (this.exibeDados.length == 0) {
                mk.Q(".tableInicioFim").setAttribute("hidden", "");
                mk.Q(".tableExibePorPagina").setAttribute("hidden", "");
                mk.Q(".listBody").setAttribute("hidden", "");
                this.exibePaginado = [];
            }
            else {
                mk.Q(".tableInicioFim").removeAttribute("hidden");
                mk.Q(".tableExibePorPagina").removeAttribute("hidden");
                mk.Q(".listBody").removeAttribute("hidden");
                mk.filtraPagination();
                mk.antesDePopularTabela();
                $(".tableListagem tbody.listBody").loadTemplate(mk.Q("#template"), mk.exibePaginado, {
                    complete: mk.aoCompletarExibicao,
                });
            }
        }
    };
    static mudaPagina = (e) => {
        if (typeof e == "string") {
            if (e == "next") {
                this.paginationAtual += 1;
            }
            else if (e == "back") {
                this.paginationAtual -= 1;
            }
        }
        else {
            this.paginationAtual = Number(e.innerHTML);
        }
        mk.atualizarLista();
    };
    static atualizarPorPagina = () => {
        this.paginationAtual = 1;
        mk.atualizarLista();
    };
    static mkGerarFiltro = (e) => {
        if (e.value != null && e.getAttribute("data-mkfignore") != "true") {
            mk.objFiltro[e.name] = {
                formato: e.getAttribute("data-mkfformato"),
                operador: e.getAttribute("data-mkfoperador"),
                conteudo: e.value,
            };
        }
        if (this.objFiltro[e.name]["conteudo"] == "" ||
            this.objFiltro[e.name]["conteudo"] == "0" ||
            this.objFiltro[e.name]["conteudo"] == 0 ||
            this.objFiltro[e.name]["conteudo"] === null) {
            delete this.objFiltro[e.name];
        }
        mk.atualizarPorPagina();
    };
    static mkUpdateFiltro = () => {
        this.objFiltro = {};
        mk.QAll("input.iConsultas").forEach((e) => {
            mk.mkGerarFiltro(e);
        });
        mk.QAll("select.iConsultas").forEach((e) => {
            mk.mkGerarFiltro(e);
        });
        mk.atualizarPorPagina();
    };
    static aoReceberDados = (data) => {
        return data;
    };
    static iniciarGetList = async (url) => {
        mk.Ao("input", "input[name='tablePorPagina']", () => {
            mk.atualizarPorPagina();
        });
        let retorno = await mk.http(url, mk.t.G, mk.t.J);
        if (retorno != null) {
            mk.mkLimparOA(retorno);
            mk.mkExecutaNoObj(retorno, mk.aoReceberDados);
            this.fullDados = this.exibeDados = retorno;
            mk.ordenarDados();
            mk.mkUpdateFiltro();
        }
    };
    static adicionarDados = (objDados) => {
        this.fullDados.push(mk.aoReceberDados(objDados));
        mk.ordenarDados();
        mk.atualizarLista();
    };
    static editarDados = (objDados, nomeKey, valorKey) => {
        this.fullDados = mk.delObjetoFromId(nomeKey, valorKey, this.fullDados);
        this.fullDados.push(mk.aoReceberDados(objDados));
        mk.ordenarDados();
        mk.atualizarLista();
    };
    static excluirDados = (nomeKey, valorKey) => {
        this.fullDados = mk.delObjetoFromId(nomeKey, valorKey, this.fullDados);
        mk.ordenarDados();
        mk.atualizarLista();
    };
    static mkSetFiltroListener = () => {
        mk.QAll("input.iConsultas").forEach((e) => {
            e.addEventListener("input", () => {
                mk.mkGerarFiltro(e);
            });
        });
        mk.QAll("select.iConsultas").forEach((e) => {
            e.addEventListener("change", () => {
                mk.mkGerarFiltro(e);
            });
        });
    };
    static LimparFiltro = (form = "#consulta_form") => {
        this.objFiltro = {};
        let eForm = mk.Q(form);
        eForm.reset();
        mk.QAll("#consulta_form .mkSel").forEach((mkSel) => {
            mkSel.classList.add("atualizar");
        });
    };
    static LimparFiltroUpdate = (form = "#consulta_form") => {
        mk.LimparFiltro(form);
        mk.atualizarLista();
    };
    static ordenar = (array = this.fullDados, nomeProp = this.sortBy, reverse = false) => {
        array.sort((oA, oB) => {
            if (oA[nomeProp] !== oB[nomeProp]) {
                if (oA[nomeProp] > oB[nomeProp])
                    return 1;
                if (oA[nomeProp] < oB[nomeProp])
                    return -1;
            }
            return 0;
        });
        this.contaOrdena++;
        if (reverse == true) {
            array = array.reverse();
        }
        else if (reverse == 2) {
            if (this.contaOrdena % 2 == 0) {
                array = array.reverse();
            }
        }
        return array;
    };
    static ordenarDados = () => {
        this.fullDados.sort((oA, oB) => {
            if (oA[mk.sortBy] !== oB[mk.sortBy]) {
                if (oA[mk.sortBy] > oB[mk.sortBy])
                    return 1;
                if (oA[mk.sortBy] < oB[mk.sortBy])
                    return -1;
            }
            return 0;
        });
        if (this.sortDir == "d") {
            this.fullDados = this.fullDados.reverse();
        }
        let thsAll = mk.QAll("th");
        if (thsAll.length != 0) {
            thsAll.forEach((th) => {
                th.classList.remove("mkEfeitoDesce");
                th.classList.remove("mkEfeitoSobe");
            });
        }
        let thsSort = mk.QAll(".sort-" + this.sortBy);
        if (thsSort.length != 0) {
            thsSort.forEach((thSort) => {
                if (this.sortDir == "a") {
                    thSort.classList.add("mkEfeitoDesce");
                }
                else {
                    thSort.classList.add("mkEfeitoSobe");
                }
            });
        }
    };
    static inverteDir = (ordenar = null) => {
        if (ordenar != null) {
            if (ordenar != this.sortBy) {
                this.sortDir = "a";
            }
            else {
                this.sortDir == "a" ? (this.sortDir = "d") : (this.sortDir = "a");
            }
            this.sortBy = ordenar;
        }
        mk.ordenarDados();
        mk.atualizarLista();
    };
    static GerarAoSort = (trHeadPai = "table.tableListagem thead tr") => {
        let eTrHeadPai = mk.Q(trHeadPai);
        Array.from(eTrHeadPai.children).forEach((th) => {
            th.classList.forEach((classe) => {
                if (classe.indexOf("sort-") == 0) {
                    let campo = classe.replace("sort-", "");
                    if (campo != "") {
                        mk.Ao("click", "thead tr .sort-" + campo, () => {
                            mk.inverteDir(campo);
                        });
                    }
                }
            });
        });
    };
    static TerremotoErros = (form) => {
        mk.QAll(form + " input.input-validation-error").forEach((e) => {
            e.nextElementSibling?.classList.add("mkTerremoto");
            setTimeout(() => {
                e.nextElementSibling?.classList.remove("mkTerremoto");
            }, 500);
        });
    };
    static mkAindaPendente = (form) => {
        let temPendencia = false;
        mk.QAll(form + " input").forEach((e) => {
            if (mk.isVisible(e)) {
                if (e.classList.contains("pending")) {
                    temPendencia = true;
                    e.classList.remove("valid");
                    e.classList.add("input-validation-error");
                }
            }
        });
        return temPendencia;
    };
    static verificarCampos = (form) => {
        $.data($(form)[0], "validator").settings.ignore = ":hidden";
        $.validator.unobtrusive.parse(form);
        var resultado = $(form).data("unobtrusiveValidation").validate();
        console.info("ModelState é Valido? " + resultado);
        resultado ? null : mk.TerremotoErros(form);
        return resultado;
    };
    static mkValidaFull = (form, fUIValidou, varRepassaA = null) => {
        mk.mkCountValidate++;
        if (mk.verificarCampos(form)) {
            let liberado = false;
            if (mk.mkAindaPendente(form)) {
                if (mk.mkCountValidate < 250) {
                    mk.CarregarON();
                    setTimeout(() => {
                        mk.mkValidaFull(form, fUIValidou, varRepassaA);
                    }, 10);
                }
                else {
                    mk.CarregarOFF();
                    console.error("&nbsp; Um ou mais campos do formul&aacute;rio n&atilde;o puderam ser validados por falta de resposta do servidor.");
                }
                return false;
            }
            else {
                liberado = true;
            }
            if (liberado) {
                mk.CarregarOFF();
                fUIValidou(varRepassaA);
                mk.mkCountValidate = 0;
            }
        }
        else {
            if (mk.mkCountValidate < 2) {
                setTimeout(() => {
                    mk.mkValidaFull(form, fUIValidou, varRepassaA);
                }, 10);
            }
            mk.CarregarOFF();
        }
    };
    static fUIFaseUpdateLinkFase = () => {
        mk.QAll("ul.mkUlFase li a").forEach((e) => {
            e.parentElement?.classList.remove("mkFaseBack");
            e.parentElement?.classList.remove("mkFaseAtivo");
            e.parentElement?.classList.remove("disabled");
            let eNumPag = Number(e.getAttribute("data-pag"));
            let bLibera = e.getAttribute("data-libera");
            if (this.mkFaseAtual > eNumPag) {
                e.parentElement?.classList.add("mkFaseBack");
            }
            if (this.mkFaseAtual == eNumPag) {
                e.parentElement?.classList.add("mkFaseAtivo");
            }
            if (bLibera == "false") {
                e.parentElement?.classList.add("disabled");
            }
        });
    };
    static fUIFaseUpdateView = (obj) => {
        for (var i = 1; i <= Number(mk.Q(".mkUlFase").getAttribute("data-totalfases")); i++) {
            mk.Q(".modalFase" + i).classList.add("oculto");
        }
        this.mkFaseAtual = obj["destinoFase"];
        mk.Q(".modalFase" + this.mkFaseAtual).classList.remove("oculto");
        mk.Q(".btnVoltar").classList.add("disabled");
        if (this.mkFaseAtual > 1) {
            mk.Q(".btnVoltar").classList.remove("disabled");
        }
        mk.Q(".btnAvancar").classList.remove("oculto");
        mk.Q(".btnEnviar").classList.add("oculto");
        if (this.mkFaseAtual >=
            Number(mk.Q(".mkUlFase").getAttribute("data-totalfases"))) {
            mk.Q(".btnAvancar").classList.add("oculto");
            mk.Q(".btnEnviar").classList.remove("oculto");
        }
        mk.fUIFaseUpdateLinkFase();
    };
    static fUIFaseVoltar = (esteForm) => {
        let obj = {
            destinoFase: this.mkFaseAtual - 1,
            form: esteForm,
        };
        mk.fUIFaseUpdateView(obj);
    };
    static fUIFaseAvancar = (esteForm) => {
        let obj = {
            destinoFase: this.mkFaseAtual + 1,
            form: esteForm,
        };
        mk.mkValidaFull(obj.form, mk.fUIFaseLiberarView, obj);
    };
    static fUIFaseEspecifica = (e) => {
        let obj = {
            destinoFase: Number(e.getAttribute("data-pag")),
            form: "#" + mk.getFormFrom(e).id,
        };
        if (obj.destinoFase < this.mkFaseAtual ||
            e.getAttribute("data-libera") == "true") {
            mk.mkValidaFull(obj.form, mk.fUIFaseLiberarView, obj);
        }
    };
    static fUIFaseLiberarView = (obj) => {
        this.sendObjFull = mk.mkGerarObjeto(obj["form"]);
        mk.fUIFaseUpdateView(obj);
    };
    static mkClicarNaAba = (este) => {
        if (este != null) {
            let estaAba = Number(este.getAttribute("data-pag"));
            let listaAbas = este.parentElement?.parentElement;
            listaAbas?.querySelectorAll("a").forEach((e) => {
                e.classList.remove("active");
            });
            este.classList.add("active");
            let totalAbas = Number(listaAbas?.getAttribute("data-mkabas"));
            for (let i = 1; i <= totalAbas; i++) {
                mk.QAll(".mkAba" + i).forEach((e) => {
                    if (i == estaAba) {
                        e.classList.remove("oculto");
                    }
                    else {
                        e.classList.add("oculto");
                    }
                });
            }
        }
    };
    static aposModalFullAberto = async () => { };
    static mkAModal_Hide = () => {
        mk.Q("body .mkModalBloco").classList.add("oculto");
        mk.Q("body").classList.remove("mkSemScrollY");
    };
    static mkAtualizarModalFull = async (url, modelo) => {
        let retorno = await mk.http(url, mk.t.G, mk.t.J);
        if (retorno != null) {
            mk.objetoSelecionado = mk.mkFormatarOA(mk.aoReceberDados(retorno));
            console.group("MODAL: Set Selecionado: ");
            console.info(mk.objetoSelecionado);
            console.groupEnd();
            $(".mkModalBloco .mkModalConteudo").loadTemplate($(modelo), mk.objetoSelecionado, {
                complete: function () {
                    console.info("Modelo Atualizado com sucesso. (Fim)");
                },
            });
        }
        else {
            console.info("URL Atualizar o modal retornou falha.");
        }
    };
    static mkExibirModalFull = async (url = null, modelo) => {
        mk.Q("body .mkModalBloco").classList.remove("oculto");
        mk.Q("body").classList.add("mkSemScrollY");
        if (url != null) {
            await mk.mkAtualizarModalFull(url, modelo);
        }
        else {
            console.info("URL NULA! Usando dados já previamente armazenados.");
        }
        mk.aposModalFullAberto();
    };
    static mkModalBuild = async () => {
        let divmkModalBloco = document.createElement("div");
        divmkModalBloco.className = "mkModalBloco";
        let divmkModalConteudo = document.createElement("div");
        divmkModalConteudo.className = "mkModalConteudo";
        let divmkModalCarregando = document.createElement("div");
        divmkModalCarregando.className = "text-center";
        let buttonmkBtnInv = document.createElement("button");
        buttonmkBtnInv.className = "mkBtnInv absolutoTopoDireito mkEfeitoDodge";
        buttonmkBtnInv.setAttribute("type", "button");
        buttonmkBtnInv.setAttribute("onClick", "mk.mkAModal_Hide()");
        let iModalMk = document.createElement("i");
        iModalMk.className = "bi bi-x-lg";
        buttonmkBtnInv.appendChild(iModalMk);
        divmkModalConteudo.appendChild(divmkModalCarregando);
        divmkModalBloco.appendChild(divmkModalConteudo);
        divmkModalBloco.appendChild(buttonmkBtnInv);
        document.body.appendChild(divmkModalBloco);
    };
    static mkModalClear() {
        mk.Q(".mkModalBloco .mkModalConteudo").innerHTML = "";
    }
    static mkAModal = async (url = null, modelo = null, conteudo = null) => {
        if (mk.Q("body .mkModalBloco") == null) {
            await mk.mkModalBuild();
        }
        mk.mkModalClear();
        if (conteudo != null) {
            if (modelo != null) {
                $(".mkModalBloco .mkModalConteudo").loadTemplate($(modelo), conteudo, {
                    complete: function () {
                        mk.mkExibirModalFull(url, modelo);
                    },
                });
            }
            else {
                console.error("MODELO NULO");
            }
        }
        else {
            console.error("CONTEUDO NULO");
        }
    };
}
const mkSelRenderizar = () => {
    document.querySelectorAll("input.mkSel").forEach((e) => {
        if (!e.parentElement?.classList.contains("mkSelBloco")) {
            let ePai = e.parentElement;
            let ePos = Array.from(ePai?.children).indexOf(e);
            let divMkSeletorBloco = document.createElement("div");
            let divMkSeletorPesquisa = document.createElement("div");
            let divMkSeletorInputExibe = document.createElement("input");
            let divMkSeletorInputExibeArrow = document.createElement("div");
            let divMkSeletorList = document.createElement("div");
            divMkSeletorBloco.className = "mkSelBloco";
            divMkSeletorPesquisa.className = "mkSelPesquisa";
            divMkSeletorInputExibe.className = "mkSelInputExibe";
            divMkSeletorInputExibeArrow.className = "mkSelInputExibeArrow";
            divMkSeletorList.className = "mkSelList";
            ePai?.insertBefore(divMkSeletorBloco, ePai?.children[ePos]);
            divMkSeletorBloco.appendChild(e);
            divMkSeletorBloco.appendChild(divMkSeletorPesquisa);
            divMkSeletorBloco.appendChild(divMkSeletorList);
            divMkSeletorPesquisa.appendChild(divMkSeletorInputExibe);
            divMkSeletorPesquisa.appendChild(divMkSeletorInputExibeArrow);
            if (e.getAttribute("data-selmoversel") == "true" &&
                e.getAttribute("data-selapenas") == "1") {
                let divMkSelArrowSelLeft = document.createElement("div");
                let divMkSelArrowSelRight = document.createElement("div");
                divMkSelArrowSelLeft.className = "mkSelArrowSelLeft microPos6";
                divMkSelArrowSelRight.className = "mkSelArrowSelRight microPos4";
                divMkSeletorPesquisa.appendChild(divMkSelArrowSelLeft);
                divMkSeletorPesquisa.appendChild(divMkSelArrowSelRight);
                divMkSelArrowSelLeft.setAttribute("onclick", "mkSelLeftSel(this)");
                divMkSelArrowSelRight.setAttribute("onclick", "mkSelRightSel(this)");
            }
            divMkSeletorBloco.setAttribute("style", e.getAttribute("style") ?? "");
            e.removeAttribute("style");
            e.setAttribute("readonly", "true");
            divMkSeletorInputExibe.setAttribute("placeholder", "Filtro \u{1F50D}");
            divMkSeletorInputExibe.setAttribute("onfocus", "mkSelPesquisaFocus(this)");
            divMkSeletorInputExibe.setAttribute("onblur", "mkSelPesquisaBlur(this)");
            divMkSeletorInputExibe.setAttribute("oninput", "mkSelPesquisaInput(this)");
            divMkSeletorList.addEventListener("scroll", (ev) => {
                mkSelMoveu(ev.target);
            });
            mkSelPopularLista(e);
            mkSelUpdate(e);
            if (e.getAttribute("data-dev") != "true") {
                e.classList.add("mkSecreto");
            }
        }
        else {
            if (e.classList.contains("atualizar")) {
                e.classList.remove("atualizar");
                mkSelPopularLista(e);
                mkSelUpdate(e);
                e.dispatchEvent(new Event("input"));
                e.dispatchEvent(new Event("change"));
            }
            mkSelReposicionar(e.parentElement.children[2]);
        }
    });
};
const mkSelSelecionar = (eItem) => {
    let ePrincipal = eItem.parentElement?.parentElement?.firstElementChild;
    let KV = mkSelGetKV(ePrincipal);
    let selLimit = Number(ePrincipal?.getAttribute("data-selapenas"));
    if (selLimit == 1) {
        ePrincipal.value = eItem.getAttribute("data-k");
        ePrincipal?.dispatchEvent(new Event("input"));
        (eItem?.parentElement?.previousElementSibling?.firstElementChild).value =
            eItem.innerHTML;
    }
    else if (selLimit > 1 || selLimit < 0) {
        let itemK = eItem.getAttribute("data-k");
        let jaSelecionado = 0;
        let arraySelecionado = [];
        KV.forEach((ObjKV) => {
            arraySelecionado.push(ObjKV.k.toString());
            if (ObjKV.k == itemK)
                jaSelecionado++;
        });
        if (jaSelecionado > 0) {
            arraySelecionado.splice(arraySelecionado.indexOf(itemK), 1);
        }
        else {
            if (arraySelecionado.length < selLimit || selLimit < 0) {
                arraySelecionado.push(itemK);
            }
        }
        arraySelecionado.forEach((item) => {
            if (item == "") {
                arraySelecionado.splice(arraySelecionado.indexOf(item), 1);
            }
        });
        if (arraySelecionado.length == 0) {
            ePrincipal.value = ePrincipal.defaultValue;
        }
        else {
            ePrincipal.value = JSON.stringify(arraySelecionado);
        }
        ePrincipal.dispatchEvent(new Event("input"));
        setTimeout(() => {
            eItem.parentElement.previousElementSibling.firstElementChild.focus();
        }, 1);
    }
    mkSelUpdate(ePrincipal);
    ePrincipal.dispatchEvent(new Event("change"));
};
const mkSelLeftSel = (e) => {
    let eAlvo = null;
    Array.from(e.parentElement?.nextElementSibling?.children).forEach((el) => {
        if (el.getAttribute("data-s") == "1") {
            eAlvo = el.previousElementSibling;
            return;
        }
    });
    if (eAlvo == null) {
        mkSelSelecionar(e.parentElement?.nextElementSibling?.lastElementChild);
    }
    else {
        if (eAlvo.classList.contains("mkSelItemDeCima")) {
            eAlvo = eAlvo.parentElement?.lastElementChild
                ?.previousElementSibling;
        }
        mkSelSelecionar(eAlvo);
    }
};
const mkSelRightSel = (e) => {
    let eAlvo = null;
    Array.from(e.parentElement.nextElementSibling.children).forEach((el) => {
        if (el.getAttribute("data-s") == "1") {
            eAlvo = el.nextElementSibling;
            return;
        }
    });
    if (eAlvo == null) {
        mkSelSelecionar(e.parentElement.nextElementSibling.firstElementChild);
    }
    else {
        if (eAlvo.classList.contains("mkSelItemDeBaixo")) {
            eAlvo = eAlvo.parentElement?.firstElementChild
                ?.nextElementSibling;
        }
        mkSelSelecionar(eAlvo);
    }
};
const mkSelPopularLista = (e) => {
    if (e.getAttribute("data-selarray") != "") {
        let eList = e.nextElementSibling.nextElementSibling;
        eList.innerHTML = "";
        try {
            let seletorArray = JSON.parse(e.getAttribute("data-selarray"));
            if (seletorArray != null) {
                let c = 0;
                seletorArray.forEach((o) => {
                    if (o.k != null) {
                        c++;
                        let divMkSeletorItem = document.createElement("div");
                        let divMkSeletorItemTexto = document.createElement("span");
                        let divMkSeletorItemArrow = document.createElement("div");
                        divMkSeletorItem.className = "mkSelItem";
                        divMkSeletorItemArrow.className = "mkSelItemArrow";
                        divMkSeletorItem.setAttribute("data-k", o.k);
                        divMkSeletorItem.setAttribute("onmousedown", "mkSelSelecionar(this)");
                        divMkSeletorItemTexto.innerHTML = o.v;
                        divMkSeletorItem.appendChild(divMkSeletorItemTexto);
                        divMkSeletorItem.appendChild(divMkSeletorItemArrow);
                        eList.appendChild(divMkSeletorItem);
                    }
                });
                if (c <= 0) {
                    eList.innerHTML = "Nenhuma opção";
                }
                else if (c > 10) {
                    if (e.getAttribute("data-selmove") != "false") {
                        let divMkSelCima = document.createElement("div");
                        divMkSelCima.className = "mkSelItemDeCima microPos2";
                        divMkSelCima.setAttribute("onmousemove", "mkSelMoveCima(this);");
                        divMkSelCima.innerHTML = "↑ ↑ ↑";
                        eList.insertBefore(divMkSelCima, eList.firstElementChild);
                        let divMkSelBaixo = document.createElement("div");
                        divMkSelBaixo.className = "mkSelItemDeBaixo microPos8";
                        divMkSelBaixo.setAttribute("onmousemove", "mkSelMoveBaixo(this);");
                        divMkSelBaixo.innerHTML = "↓ ↓ ↓";
                        eList.appendChild(divMkSelBaixo);
                    }
                }
            }
        }
        catch {
            console.error("Erro durante conversao para Json:" + e.getAttribute("data-selarray"));
        }
    }
};
const mkSelPesquisaFocus = (e) => {
    mkSelUpdate(e.parentElement.previousElementSibling);
    e.value = "";
    let eList = e.parentElement.nextElementSibling;
    Array.from(eList.children).forEach((el) => {
        el.style.display = "";
    });
    let temOsDeCima = eList.firstElementChild?.classList.contains("mkSelItemDeCima");
    if (temOsDeCima && eList.scrollTop == 0)
        eList.firstElementChild.style.display = "none";
    mkSelReposicionar(e.parentElement.nextElementSibling);
};
const getParentScrollTop = (e) => {
    let eHtml = e;
    let soma = 0;
    while (eHtml.tagName != "HTML") {
        soma += eHtml.scrollTop;
        eHtml = eHtml.parentElement;
    }
    return soma;
};
const mkSelReposicionar = (eList) => {
    let eRef = eList.previousElementSibling;
    eList.style.minWidth = eRef.offsetWidth + "px";
    let wLargura = window.innerWidth;
    if (wLargura < 768) {
        eList.style.top = 35 + "px";
        eList.style.left = 35 + "px";
    }
    else {
        eList.style.top =
            eRef.offsetTop - getParentScrollTop(eRef) + eRef.offsetHeight + 2 + "px";
        eList.style.left = eRef.offsetLeft + "px";
        let posXCantoOpostoRef = eRef.offsetLeft + eRef.offsetWidth;
        let posXCantoOpostoList = eList.offsetLeft + eList.offsetWidth;
        if (posXCantoOpostoList > mk.Q("body").offsetWidth) {
            eList.style.left = posXCantoOpostoRef - eList.offsetWidth - 1 + "px";
        }
    }
};
const mkSelPesquisaBlur = (e) => {
    mkSelUpdate(e.parentElement.previousElementSibling);
};
const mkSelPesquisaInput = (e) => {
    let cVisivel = 0;
    let eList = e.parentElement.nextElementSibling;
    Array.from(eList.children).forEach((el) => {
        let exibe = false;
        if (el.classList.contains("mkSelItem")) {
            if (el.firstElementChild.innerHTML
                .toLowerCase()
                .match(e.value.toLowerCase())) {
                exibe = true;
                cVisivel++;
            }
        }
        if (exibe) {
            el.style.display = "";
        }
        else {
            el.style.display = "none";
        }
    });
    if (cVisivel > 10) {
        eList.firstElementChild.style.display = "";
        eList.lastElementChild.style.display = "";
    }
};
const mkSelMoveu = (e) => {
    if (e.firstElementChild.classList.contains("mkSelItemDeCima")) {
        if (e.scrollTop == 0) {
            e.firstElementChild.style.display = "none";
            e.lastElementChild.style.display = "";
        }
        else if (e.scrollTop + e.clientHeight >= e.scrollHeight) {
            e.firstElementChild.style.display = "";
            e.lastElementChild.style.display = "none";
        }
        else {
            e.firstElementChild.style.display = "";
            e.lastElementChild.style.display = "";
        }
    }
};
const mkSelMoveCima = (e) => {
    let eList = e.parentElement;
    eList.scrollTop = eList.scrollTop - 5;
    mkSelMoveu(eList);
};
const mkSelMoveBaixo = (e) => {
    let eList = e.parentElement;
    eList.scrollTop = eList.scrollTop + 5;
    mkSelMoveu(eList);
};
const mkSelUpdate = (e, KV = null) => {
    if (KV == null) {
        KV = mkSelGetKV(e);
    }
    Array.from(e.nextElementSibling.nextElementSibling.children).forEach((el) => {
        el.setAttribute("data-s", "0");
    });
    KV.forEach((o) => {
        Array.from(e.nextElementSibling.nextElementSibling.children).forEach((item) => {
            if (item.getAttribute("data-k") == o.k) {
                item.setAttribute("data-s", "1");
            }
        });
    });
    mkSelSetDisplay(e, KV);
};
const mkSelGetKV = (e) => {
    let kSels;
    let kOpcoes;
    if (mkIsJson(e.value)) {
        kSels = JSON.parse(e.value);
        if (!Array.isArray(kSels)) {
            kSels = [{ k: kSels }];
        }
        else {
            kSels = [];
            JSON.parse(e.value).forEach((kSel) => {
                kSels.push({ k: kSel });
            });
        }
    }
    else
        kSels = [{ k: e.value }];
    if (mkIsJson(e.getAttribute("data-selarray"))) {
        kOpcoes = JSON.parse(e.getAttribute("data-selarray"));
        if (!Array.isArray(kOpcoes)) {
            kOpcoes = [{ k: kOpcoes, v: "\u{2209} Opções" }];
        }
    }
    else
        kOpcoes = null;
    if (kOpcoes != null) {
        kSels.forEach((objKv) => {
            kOpcoes.forEach((opcao) => {
                if (opcao.k == objKv.k) {
                    objKv.v = opcao.v;
                }
            });
        });
    }
    return kSels;
};
const mkSelSetDisplay = (e, KV) => {
    if (KV.length <= 0) {
        console.warn("Não foi possível encontrar os itens selecionados.");
        e.nextElementSibling.firstElementChild.value = "Opções \u{2209}";
    }
    else {
        if (KV.length == 1) {
            let display = "-- Selecione --";
            if (KV[0].v != null) {
                display = KV[0].v;
            }
            e.nextElementSibling.firstElementChild.value = display;
        }
        else if (KV.length > 1) {
            e.nextElementSibling.firstElementChild.value =
                "[" + KV.length + "] Selecionados";
        }
    }
};
const mkIsJson = (s) => {
    try {
        JSON.parse(s);
    }
    catch (e) {
        return false;
    }
    return true;
};
mk.mkClicarNaAba(mk.Q(".mkAbas a.active"));
mkSelRenderizar();
setInterval(() => {
    mkSelRenderizar();
}, 500);
Object.defineProperty(mk, "http", {
    writable: false,
});
Object.defineProperty(mk, "mkFiltragemDados", {
    writable: false,
});
Object.defineProperty(mk, "mkValidaFull", {
    writable: false,
});
Object.defineProperty(mk, "t", {
    writable: false,
});
