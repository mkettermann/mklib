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
    static objFiltro = [];
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
            form = Mk.Q(este);
        }
        let rObjeto = Mk.mkLimparOA(Object.fromEntries(new FormData(form).entries()));
        console.groupCollapsed("Objeto Gerado: ");
        console.info(rObjeto);
        console.groupEnd();
        return rObjeto;
    };
    static QSet = (query = "body", valor = null) => {
        if (valor != null) {
            Mk.Q(query).value = valor;
        }
        else {
            Mk.Q(query).value = "";
        }
        return Mk.Q(query);
    };
    static QSetAll = (query = "input[name='#PROP#']", obj = null) => {
        let eAfetados = [];
        if (typeof obj == "object" && !Array.isArray(obj)) {
            if (obj.length != 0) {
                for (let p in obj) {
                    let eDynamicQuery = Mk.Q(query.replace("#PROP#", p));
                    if (eDynamicQuery) {
                        if (obj[p]) {
                            eDynamicQuery.value = obj[p];
                            eDynamicQuery.classList.add("atualizar");
                            eAfetados.push(eDynamicQuery);
                        }
                    }
                }
            }
            else
                console.warn("QSetAll - Array Vazia");
        }
        else
            console.warn("QSetAll - Precisa receber um objeto");
        return eAfetados;
    };
    static Qon = (query = "body") => {
        let temp = Mk.Q(query);
        temp.disabled = null;
        temp.classList.remove("disabled");
        return temp;
    };
    static Qoff = (query = "body") => {
        let temp = Mk.Q(query);
        temp.disabled = true;
        temp.classList.add("disabled");
        return temp;
    };
    static QverOn = (query = "body") => {
        let temp = Mk.Q(query);
        temp.classList.remove("oculto");
        return temp;
    };
    static QverOff = (query = "body") => {
        let temp = Mk.Q(query);
        temp.classList.add("oculto");
        return temp;
    };
    static QdataGet = (query = "body", atributoNome) => {
        return Mk.Q(query).getAttribute("data-" + atributoNome);
    };
    static QdataSet = (query = "body", atributoNome, atributoValor) => {
        return Mk.Q(query).setAttribute("data-" + atributoNome, atributoValor);
    };
    static GetParam = (name = null) => {
        if (name != null) {
            return new URL(document.location).searchParams.get(name);
        }
        else {
            return new URL(document.location).searchParams;
        }
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
    static isJson = (s) => {
        try {
            JSON.parse(s);
        }
        catch (e) {
            return false;
        }
        return true;
    };
    static mkSelDlRefill = (eName, cod = null) => {
        let e = Mk.Q(eName);
        let urlColeta = appPath + e.getAttribute("data-refill");
        cod != null ? (urlColeta += cod) : null;
        Mk.GetJson(urlColeta, (parsedData) => {
            let kv = parsedData;
            if (typeof parsedData == "object") {
                kv = JSON.stringify(parsedData);
            }
            if (Mk.isJson(kv)) {
                e.setAttribute("data-selarray", kv);
                e.classList.add("atualizar");
            }
            else {
                console.error("Resultado não é um JSON. (mkSelDlRefill)");
            }
        }, null);
    };
    static getServerOn = (urlDestino) => {
        Mk.GetJson(urlDestino, (parsedData) => {
            if (parsedData !== true) {
                Mk.detectedServerOff();
            }
        }, Mk.detectedServerOff, this.getJson, false);
    };
    static detectedServerOff = () => {
        if (Mk.Q("body .offlineBlock") == null) {
            let divOfflineBlock = document.createElement("div");
            divOfflineBlock.className = "offlineBlock";
            let divOfflineBlockInterna = document.createElement("div");
            divOfflineBlockInterna.className = "text-center";
            divOfflineBlockInterna.innerHTML = "Servidor OFF-LINE";
            let buttonOfflineBlock = document.createElement("button");
            buttonOfflineBlock.setAttribute("type", "button");
            buttonOfflineBlock.setAttribute("onClick", "Mk.detectedServerOff_display()");
            let iOfflineBlock = document.createElement("i");
            iOfflineBlock.className = "bi bi-x-lg";
            buttonOfflineBlock.appendChild(iOfflineBlock);
            divOfflineBlock.appendChild(divOfflineBlockInterna);
            divOfflineBlock.appendChild(buttonOfflineBlock);
            document.body.appendChild(divOfflineBlock);
        }
        Mk.Q("body .offlineBlock").classList.remove("oculto");
    };
    static detectedServerOff_display = () => {
        Mk.Q("body .offlineBlock").classList.add("oculto");
    };
    static mkOnlyFloatKeys = (e) => {
        let tecla = e.key;
        let permitido = "0123456789,-";
        let isNegado = true;
        for (var i = 0; i < permitido.length; i++) {
            if (permitido[i] == tecla.toString()) {
                isNegado = false;
            }
        }
        tecla == "ArrowLeft" ? (isNegado = false) : null;
        tecla == "ArrowRight" ? (isNegado = false) : null;
        tecla == "Backspace" ? (isNegado = false) : null;
        tecla == "Delete" ? (isNegado = false) : null;
        tecla == "Tab" ? (isNegado = false) : null;
        isNegado ? e.preventDefault() : null;
    };
    static mkEventBlock = (e) => {
        console.error("Negado");
        e.preventDefault();
    };
    static mkTrocaPontoPorVirgula = (query) => {
        Mk.QAll(query).forEach((e) => {
            e.innerHTML = e.innerHTML.replaceAll(".", ",");
        });
    };
    static mkSelecionarInner = (este) => {
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(este);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
    static mkInputFormatarValor = (e) => {
        e.value = Mk.mkDuasCasas(e.value);
    };
    static mkMedia = (menor, maior) => {
        return Mk.mkDuasCasas((Mk.mkFloat(menor) + Mk.mkFloat(maior)) / 2);
    };
    static mkFloat = (num) => {
        let ret = num;
        if (typeof num != "number") {
            ret = parseFloat(ret.toString().replaceAll(".", "").replaceAll(",", "."));
        }
        if (isNaN(ret)) {
            ret = 0;
        }
        return ret;
    };
    static mkDuasCasas = (num) => {
        return Mk.mkFloat(num).toFixed(2).replaceAll(".", ",");
    };
    static mkEmReais = (num) => {
        return Mk.mkFloat(num).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        });
    };
    static mkBase64 = (arquivo, tagImg, tagHidden) => {
        let leitor = new FileReader();
        leitor.onload = () => {
            Mk.Q(tagImg).src = leitor.result;
            Mk.Q(tagHidden).value = leitor.result;
        };
        leitor.readAsDataURL(arquivo);
    };
    static mkClonarOA = (oa) => {
        if (Array.isArray(oa)) {
            let temp = [];
            oa.forEach((oriItem, i) => {
                let desItem = {};
                for (var propName in oriItem) {
                    desItem[propName] = oriItem[propName];
                }
                temp.push(desItem);
            });
            return temp;
        }
        else {
            if (typeof oa === "object") {
                let temp = {};
                for (var propName in oa) {
                    temp[propName] = oa[propName];
                }
                return temp;
            }
        }
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
    static hoje = () => {
        let mkFullData = Mk.hojeMkData() + " " + Mk.hojeMkHora();
        return mkFullData;
    };
    static hojeMkData = () => {
        return new Date(Mk.getMs()).toLocaleDateString();
    };
    static hojeMkHora = () => {
        return new Date(Number(Mk.getMs())).toLocaleTimeString();
    };
    static getMs = (dataYYYYMMDD = null) => {
        if (dataYYYYMMDD != null) {
            let dataCortada = dataYYYYMMDD.split("-");
            let oDia = Number(dataCortada[2]);
            let oMes = Number(dataCortada[1] - 1);
            let oAno = Number(dataCortada[0]);
            return new Date(oAno, oMes, oDia) - 0;
        }
        else
            return new Date() - 0;
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
            return Number(Mk.getFullData(ms).split("-")[2]);
        else
            return Number(Mk.getFullData().split("-")[2]);
    };
    static getMes = (ms = null) => {
        if (ms != null)
            return Number(Mk.getFullData(ms).split("-")[1]);
        else
            return Number(Mk.getFullData().split("-")[1]);
    };
    static getAno = (ms = null) => {
        if (ms != null)
            return Number(Mk.getFullData(ms).split("-")[0]);
        else
            return Number(Mk.getFullData().split("-")[0]);
    };
    static getDiasDiferenca = (msOld, msNew = null) => {
        if (msNew == null)
            msNew = Mk.getHojeMS();
        return Mk.transMsEmDias(msNew - msOld);
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
    static transMsEmHoras = (h) => {
        return h * 3600000;
    };
    static transDiasEmMs = (d) => {
        return d * 86400000;
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
        if (metodo == t.P) {
            console.groupCollapsed(">> Objeto Enviado");
            console.info(dados);
            console.info(body?.toString());
            console.groupEnd();
        }
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
                if (o[nomeKey] == valorKey) {
                    temp.push(o);
                }
            });
        }
        else {
            temp = listaDados;
        }
        return temp;
    };
    static aposModalFullAberto = () => { };
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
                $("div.boxMain div.boxTable table.tableListagem tbody.listBody").loadTemplate(mk.Q("#template"), mk.exibePaginado, {
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
        let retorno = await mk.http(url, t.G, t.J);
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
                    gerarToastErro("&nbsp; Um ou mais campos do formul&aacute;rio n&atilde;o puderam ser validados por falta de resposta do servidor.");
                }
                return false;
            }
            else {
                liberado = true;
            }
            if (liberado) {
                mk.CarregarOFF();
                fUIValidou(varRepassaA);
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
}
mk.iniciarGetList("./Teste.json");
