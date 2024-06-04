"use strict";
var mkz = null;
String.prototype.removeRaw = function (fix = false) {
    let r = this.replaceAll("\n", "")
        .replaceAll("\r", "")
        .replaceAll("\t", "")
        .replaceAll("\b", "")
        .replaceAll("\f", "");
    if (fix.toString() == "2") {
        r = r.replaceAll("&quot;", '"')
            .replaceAll("&#39;", "'")
            .replaceAll("&amp;", "&");
        r = r.replaceAll("\\", "/");
    }
    return r;
};
String.prototype.toEntities = function () {
    return this.replace(/./gm, function (s) {
        return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
    });
};
String.prototype.fromEntities = function () {
    return (this + "").replace(/&#\d+;/gm, function (s) {
        return String.fromCharCode(s.match(/\d+/gm)[0]);
    });
};
class mktm {
    pk = false;
    k = null;
    v = null;
    l = null;
    r = null;
    tag = "input";
    atr = "type='text'";
    classes = "iConsultas";
    lclasses = "";
    target = "value";
    f = true;
    opcoes = "";
    filtroFormato = "string";
    filtroOperador = "";
    field = "";
    requer = false;
    regras = [];
    url = "";
    on = true;
    crud = true;
    constructor(o) {
        if (o.k != null)
            this.k = o.k;
        if (o.pk != null)
            this.pk = o.pk;
        if (o.l != null)
            this.l = o.l;
        if (o.r != null)
            this.r = o.r;
        if (o.v != null)
            this.v = o.v;
        if (o.tag != null)
            this.tag = o.tag;
        if (o.atr != null)
            this.atr = o.atr;
        if (o.opcoes != null)
            this.opcoes = o.opcoes;
        if (o.filtroFormato != null)
            this.filtroFormato = o.filtroFormato;
        if (o.filtroOperador != null)
            this.filtroOperador = o.filtroOperador;
        if (o.classes != null)
            this.classes = o.classes;
        if (o.lclasses != null)
            this.lclasses = o.lclasses;
        if (o.target != null)
            this.target = o.target;
        if (o.regras != null)
            this.regras = o.regras;
        if (o.url != null)
            this.url = o.url;
        if (o.on != null)
            this.on = o.on;
        if (o.crud != null)
            this.crud = o.crud;
        if (o.f == false)
            this.f = false;
        if (o.requer == true)
            this.requer = true;
        if (this.k == null)
            this.k = "";
        if (this.v == null)
            this.v = "";
        if (this.l == null)
            this.l = "";
        if (o.field) {
            this.field = o.field;
        }
        else {
            let varfOperador = "";
            if (this.filtroOperador != "")
                varfOperador = ` data-mkfoperador="${this.filtroOperador}"`;
            let varUrl = "";
            if (this.url != "")
                varUrl = ` data-url="${this.url}"`;
            let opcoes = "";
            if (this.opcoes != "")
                opcoes = ` opcoes='${this.opcoes}'`;
            let disabled = "";
            if (this.on == false)
                disabled = " disabled";
            this.field = `<${this.tag} name="${this.k}" value="${this.v}" class="${this.classes}${disabled}"${disabled} data-mkfformato="${this.filtroFormato}"${varfOperador}${varUrl}${opcoes} ${this.atr}>`;
            if (this.tag != "input") {
                this.field += `</${this.tag}>`;
            }
        }
    }
    toObject = () => {
        let o = {};
        ["pk", "k", "v", "l", "r", "on", "crud", "tag", "atr", "classes", "lclasses", "target", "f", "opcoes", "field", "requer", "regras", "url"].forEach(k => {
            o[k] = this[k];
        });
        return o;
    };
    get [Symbol.toStringTag]() { return "mktm"; }
}
class mktc {
    url = window.location.href.split("?")[0] + "/GetList";
    dados = null;
    nomeTabela = null;
    container = ".divListagemContainer";
    idmodelo = "#modelo";
    model = [];
    qntInicial = 1000;
    qntSolicitada = 5000;
    container_importar = false;
    filtroExtra = null;
    filtro = ".iConsultas";
    filtroDinamico = null;
    headSort = true;
    headMenu = true;
    exibeBotaoMais = true;
    sortBy = null;
    sortDir = 1;
    objFiltro = {};
    urlOrigem = "";
    pagAtual = 1;
    pk = null;
    totalFull = 0;
    totalFiltrado = 0;
    totalExibidos = 0;
    pagPorPagina = 5;
    pagItensIni = 0;
    pagItensFim = 0;
    totPags = 0;
    ativarDbCliente = false;
    versaoDb = 1;
    tbody = "tbody";
    ths = "th";
    pagBotoes = ".pagBotoes";
    tableResultado = ".tableResultado";
    tablePorPagina = "*[name='tablePorPagina']";
    tableExibePorPagina = ".tableExibePorPagina";
    tableTotal = ".tableTotal";
    tableFiltrado = ".tableFiltrado";
    tableIni = ".tableIni";
    tableFim = ".tableFim";
    tableInicioFim = ".tableInicioFim";
    pag = ".pag";
    pagBotao = ".pagBotao";
    botaoAdicionarMaisClasse = "divListagemMaisItens";
    botaoNovaConsulta = "#btnConsultar";
    dbInit = (store) => { };
    aoIniciarListagem = async (este) => { };
    aoReceberNovaConsulta = async (dadosFull, este) => { };
    aoPossuirDados = async (dadosFull, este) => { };
    aoConcluirFiltragem = async (dadosFiltrado, este) => { };
    aoAntesDePopularTabela = async (dadosExibidos, este) => { };
    aoConcluirExibicao = async (este) => { };
    aoReceberDados = (o, este) => { return o; };
    constructor(array) {
        if (mkt.classof(array) == "Array") {
            this.model = array;
        }
        if (this.url) {
            this.url = this.url?.replace("//GetList", "/GetList");
        }
        if (!mkt.Q(this.botaoNovaConsulta)) {
            this.botaoNovaConsulta = null;
        }
        if (this.botaoNovaConsulta == null) {
            this.filtroDinamico = true;
        }
        else {
            this.filtroDinamico = false;
        }
    }
    ;
    set = (propriedade, valor) => {
        if (propriedade in this) {
            this[propriedade] = valor;
        }
        else {
            mkt.w("A classe mktc (.set(Propriedade)) não possui a propriedade: ", propriedade);
        }
        return this;
    };
    get [Symbol.toStringTag]() { return "mktc"; }
}
class mkt {
    c;
    started = false;
    db = null;
    dadosFull = [];
    dadosFiltrado = [];
    dadosExibidos = [];
    alvo = {};
    thisListNum = 0;
    idContainer = 0;
    exclusivos = [];
    hmunsel = [];
    ultimoGet = -1;
    ultimoParametro = "";
    cTotUltimoParametro = 0;
    solicitadoUltimoParametro = 0;
    aindaTemMais = true;
    totalappends = 0;
    constructor(_mktc) {
        if (_mktc == null) {
            this.c = new mktc([]);
        }
        else {
            this.c = _mktc;
        }
        let cs = this.c.container + " ";
        this.c.tbody = cs + this.c.tbody;
        this.c.ths = cs + this.c.ths;
        this.c.pagBotoes = cs + this.c.pagBotoes;
        this.c.tableResultado = cs + this.c.tableResultado;
        this.c.tablePorPagina = cs + this.c.tablePorPagina;
        this.c.tableExibePorPagina = cs + this.c.tableExibePorPagina;
        this.c.tableTotal = cs + this.c.tableTotal;
        this.c.tableFiltrado = cs + this.c.tableFiltrado;
        this.c.tableIni = cs + this.c.tableIni;
        this.c.tableFim = cs + this.c.tableFim;
        this.c.tableInicioFim = cs + this.c.tableInicioFim;
        this.c.pag = cs + " " + this.c.pag;
        this.c.pagBotao = cs + " " + this.c.pagBotao;
        if (mkt.classof(this.c.model) != "Array")
            this.c.model = [];
        if (this.c.model?.length > 0) {
            this.c.model?.forEach(o => {
                if (o.pk) {
                    this.c.pk = o.k;
                }
            });
        }
        if (this.c.pk == null) {
            let modelo = mkt.Q(this.c.idmodelo)?.getAttribute("pk");
            if (modelo) {
                this.c.pk = modelo;
            }
            else {
                mkt.l(`%c Nenhuma Primary Key encontrada no Config ou no Template (${this.c.idmodelo}) %c Config:`, "color:red;background-color:black;border-radius:5px;padding:0px 2px;font-weight:bold;", "color:white;", this.c);
            }
        }
        if (mkt.Q(this.c.container)) {
            this.autoStartConfig();
        }
        mkt.a.build.push(this);
    }
    autoStartConfig = async (arg = {}) => {
        if (!this.started) {
            if (this.c.container_importar) {
                await mkt.importar(this.c.container);
            }
            if (mkt.Q(this.c.botaoNovaConsulta)) {
                if (this.c.qntInicial > 0) {
                    mkt.Qoff(this.c.botaoNovaConsulta);
                }
            }
            if (mkt.Q(this.c.pagBotao)) {
                mkt.QAll(this.c.pagBotao).forEach((li) => {
                    li.addEventListener("click", (ev) => {
                        this.mudaPag(ev.target);
                    });
                });
            }
            if (mkt.Q(this.c.tablePorPagina)) {
                mkt.Ao("input", this.c.tablePorPagina, async (e) => {
                    this.atualizaNaPaginaUm();
                });
            }
            this.headAtivar();
            if (this.c.filtro)
                this.setFiltroListener();
        }
        if (mkt.classof(this.c.qntSolicitada) != "Number") {
            this.c.qntSolicitada = 10000;
        }
        else if (this.c.qntSolicitada < 0) {
            this.c.qntSolicitada = 10000;
        }
        if (mkt.classof(this.c.qntInicial) != "Number") {
            this.c.qntInicial = this.c.qntSolicitada;
        }
        else if (this.c.qntInicial <= 0) {
            this.c.qntInicial = 0;
        }
        if (!this.c.sortBy)
            this.c.sortBy = this.c.pk;
        if (!this.c.sortDir)
            this.c.sortDir = 1;
        this.setDirSort(this.c.sortBy, Number(this.c.sortDir));
        if (this.c.dados != null) {
            if (mkt.classof(this.c.dados) == "Array") {
                if (this.c.qntInicial > 0) {
                    if (await this.appendList(this.c.dados) != null) {
                        this.started = true;
                        this.startListagem();
                    }
                }
                else {
                    this.started = true;
                    this.startListagem();
                }
            }
            else {
                mkt.w("Os dados informados precisa ser uma Lista. (Array). Recebido:", mkt.classof(this.c.dados));
            }
        }
        if (this.c.url != null) {
            if (mkt.classof(this.c.url) == "String") {
                this.c.urlOrigem = this.c.url;
                if (this.c.qntInicial > 0) {
                    if (await this.appendList(this.c.url) != null) {
                        if (!this.started) {
                            this.started = true;
                            this.startListagem();
                        }
                        else {
                            this.atualizarListagem();
                        }
                    }
                }
                else {
                    this.started = true;
                    this.startListagem();
                }
            }
        }
        else {
            this.aindaTemMais = false;
        }
        if (this.c.dados == null && this.c.url == null) {
            mkt.w("Nenhuma fonte de dados encontrada. Não será possível popular a listagem sem dados.");
        }
        if (!this.started) {
            mkt.erro("A lista foi iniciada sem confirmação dos dados. Provavelmente ocorreu erro na coleta de dados.");
            this.startListagem();
        }
    };
    reset = async () => {
        this.dadosFull = [];
        this.dadosFiltrado = [];
        this.dadosExibidos = [];
        this.alvo = {};
        this.thisListNum = 0;
        this.idContainer = 0;
        this.exclusivos = [];
        this.hmunsel = [];
        this.ultimoGet = -1;
        this.ultimoParametro = "";
        this.cTotUltimoParametro = 0;
        this.solicitadoUltimoParametro = 0;
        this.aindaTemMais = true;
        this.totalappends = 0;
        this.c.objFiltro = {};
        await this.autoStartConfig();
    };
    mais = async (parametros = null, novaurl = null) => {
        return new Promise((r) => {
            if (novaurl == null) {
                this.c.url = this.c.urlOrigem;
            }
            else {
                this.c.url = novaurl;
            }
            if (parametros == null) {
                parametros = this.ultimoParametro;
            }
            if (mkt.classof(this.c.url) == "String") {
                this.appendList(this.c.url, parametros, true).then(re => {
                    this.atualizarListagem();
                    r(true);
                });
            }
            else {
                mkt.w("mais() - Url informada não é uma string: ", mkt.classof(this.c.url));
                r(false);
            }
        });
    };
    appendList = async (data_url, parametros = "", fromMais = false) => {
        return new Promise((r) => {
            if (mkt.classof(data_url) == "Array") {
                for (let i = 0; i < data_url.length; i++) {
                    if (i < this.c.qntInicial) {
                        this.dadosFull.push(this.c.aoReceberDados(data_url[i], this));
                    }
                }
                this.dadosCheck();
                r(true);
            }
            else if (mkt.classof(data_url) == "String") {
                this.totalappends++;
                let carregador = false;
                let solicitar = this.c.qntInicial;
                if (parametros != this.ultimoParametro) {
                    this.ultimoParametro = parametros;
                    this.cTotUltimoParametro = 0;
                    this.dadosFull = [];
                    this.c.pagAtual = 1;
                    this.totalappends = 1;
                    carregador = true;
                    solicitar = this.c.qntSolicitada;
                    if (this.c.botaoNovaConsulta != null) {
                        mkt.Qoff(this.c.botaoNovaConsulta);
                    }
                }
                if (fromMais) {
                    solicitar = this.c.qntSolicitada;
                }
                this.solicitadoUltimoParametro = solicitar;
                let urlTemp = "";
                if (data_url.includes("?")) {
                    urlTemp = data_url + "&lr=" + solicitar + "&lh=" + this.cTotUltimoParametro;
                }
                else {
                    urlTemp = data_url?.split("?")[0] + "?lr=" + solicitar + "&lh=" + this.cTotUltimoParametro;
                }
                if (!urlTemp.includes("://"))
                    urlTemp = window.location.origin + urlTemp;
                urlTemp += parametros;
                mkt.get.json({ url: urlTemp, carregador: carregador }).then((p) => {
                    if (p.retorno != null) {
                        this.ultimoGet = p.retorno.length;
                        this.cTotUltimoParametro += this.ultimoGet;
                        for (let i = 0; i < p.retorno.length; i++) {
                            this.dadosFull.push(this.c.aoReceberDados(p.retorno[i], this));
                        }
                        if (this.totalappends == 1) {
                            mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoReceberNovaConsulta"));
                            this.c.aoReceberNovaConsulta(this.dadosFull, this);
                        }
                        if (this.ultimoGet < this.solicitadoUltimoParametro) {
                            this.aindaTemMais = false;
                            mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoBaixarTodosDados"));
                            let eAddMais = mkt.Q(this.c.container)?.querySelector("." + this.c.botaoAdicionarMaisClasse);
                            if (eAddMais) {
                                eAddMais.remove();
                            }
                        }
                        else if (this.ultimoGet > this.solicitadoUltimoParametro) {
                            this.aindaTemMais = false;
                        }
                        else {
                            this.aindaTemMais = true;
                        }
                        this.dadosCheck();
                        r(p.retorno.length);
                    }
                    else {
                        document.dispatchEvent(new Event("getListFalhou"));
                        r(null);
                    }
                });
            }
            else {
                r(null);
            }
            if (this.c.ativarDbCliente) {
            }
        });
    };
    startListagem = async (arg = {}) => {
        mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoIniciarListagem"));
        this.c.aoIniciarListagem(this);
        mkt.limparOA(this.dadosFull);
        mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoPossuirDados"));
        await this.c.aoPossuirDados(this.dadosFull, this);
        mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
        if (this.c.filtro) {
            if (this.c.filtroDinamico) {
                this._RecoletarFiltros();
            }
        }
        this.efeitoSort();
        if (mkt.Q(this.c.tableResultado)) {
            mkt.Q(this.c.tableResultado).classList.remove("oculto");
        }
        this.atualizaNaPaginaUm();
    };
    dadosCheck = () => {
        mkt.addTask({ k: "ChavesRepetidas", v: this.dadosFull, target: this.c.pk }).then((r) => {
            if (r.v.length > 0) {
                let chaves = r.v.filter((i) => i != null);
                if (chaves.length == 0) {
                    mkt.l(`%c ALERTA! %c ${this.c.nomeTabela}: Chaves primárias NULAS! Nome da PK: %c${this.c.pk}`, "color:red;background-color:black;border-radius:5px;padding:1px;font-weight:bold;", "color:yellow;", "color:white;");
                }
                else {
                    mkt.l(`%c ALERTA! %c ${this.c.nomeTabela}: Chaves primárias duplicadas:`, "color:red;background-color:black;border-radius:5px;padding:1px;font-weight:bold;", "color:yellow;", chaves);
                }
            }
        });
        mkt.addTask({ k: "Duplices", v: this.dadosFull, target: this.c.pk }).then((r) => {
            if (r.v.length > 0) {
                let chaves = r.v.filter((i) => i != null);
                if (chaves.length != 0) {
                    mkt.l(`%c ATENÇÃO! %c ${this.c.nomeTabela}: Conteúdo repetido:`, "color:orange;background-color:black;border-radius:5px;padding:0px 2px;font-weight:bold;", "color:yellow;", chaves);
                }
            }
        });
    };
    dbCon = async () => {
        return new Promise((r) => {
            if (mkt.classof(this.c.nomeTabela) == "String") {
                let dbConOpen = indexedDB.open(this.c.nomeTabela, this.c.versaoDb);
                dbConOpen.onerror = (...args) => { mkt.erro(args); r(null); };
                dbConOpen.onsuccess = () => {
                    r(dbConOpen.result);
                };
                dbConOpen.onupgradeneeded = () => {
                    let conParametros = {};
                    if (this.c.pk != null && this.c.pk != "" && this.c.pk != "pk") {
                        conParametros.keyPath = this.c.pk;
                    }
                    let store = dbConOpen.result.createObjectStore(this.c.nomeTabela, conParametros);
                    if (mkt.classof(this.c.dbInit) == "Function") {
                        this.c.dbInit(store);
                    }
                    r(dbConOpen.result);
                };
            }
            else {
                mkt.w("dbCon() - nomeTabela não informado: ", this.c.nomeTabela);
                r(null);
            }
        });
    };
    atualizarListagem = async () => {
        let pagBotoes = mkt.Q(this.c.pagBotoes);
        this.dadosFiltrado = mkt.processoFiltragem(this.dadosFull, this.c.objFiltro, this);
        this.atualizarStatusListagem();
        mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoConcluirFiltragem"));
        await this.c.aoConcluirFiltragem(this.dadosFiltrado, this);
        if (this.c.totalFiltrado > this.c.pagPorPagina)
            pagBotoes?.removeAttribute("hidden");
        else
            pagBotoes?.setAttribute("hidden", "");
        if (this.c.totalFiltrado == 0) {
            mkt.Q(this.c.tableInicioFim)?.setAttribute("hidden", "");
            mkt.Q(this.c.tableExibePorPagina)?.setAttribute("hidden", "");
            mkt.Q(this.c.tbody)?.setAttribute("hidden", "");
            this.dadosExibidos = [];
        }
        else {
            if (pagBotoes) {
                mkt.Q(this.c.tableInicioFim)?.removeAttribute("hidden");
                mkt.Q(this.c.tableExibePorPagina)?.removeAttribute("hidden");
                this.processoPaginar();
            }
            else {
                this.dadosExibidos = this.dadosFiltrado;
            }
            mkt.Q(this.c.tbody)?.removeAttribute("hidden");
            mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoAntesDePopularTabela"));
            await this.c.aoAntesDePopularTabela(this.dadosExibidos, this);
            if (this.c.exibeBotaoMais) {
                if (this.aindaTemMais) {
                    if (this.c.totPags == this.c.pagAtual) {
                        let container = mkt.Q(this.c.container);
                        if (!container.querySelector("." + this.c.botaoAdicionarMaisClasse)) {
                            let mklEFim = document.createElement("div");
                            mklEFim.className = this.c.botaoAdicionarMaisClasse;
                            mklEFim.innerHTML = mkt.a.msg.carregarmais;
                            mkt.Ao("click", mklEFim, (e) => {
                                this.mais();
                                e.classList.add("disabled");
                            });
                            container.querySelector("table")?.parentElement?.appendChild(mklEFim);
                        }
                    }
                    else {
                        mkt.Q(this.c.container + " ." + this.c.botaoAdicionarMaisClasse)?.remove();
                    }
                }
            }
            await mkt.moldeOA(this.dadosExibidos, this.c.idmodelo, this.c.tbody);
            mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoConcluirExibicao"));
            await this.c.aoConcluirExibicao(this);
        }
    };
    atualizarStatusListagem = () => {
        if (mkt.Q(this.c.tablePorPagina) != null) {
            this.c.pagPorPagina = Number(mkt.Q(this.c.tablePorPagina).value);
        }
        this.c.totalFull = this.dadosFull.length;
        this.c.totalFiltrado = this.dadosFiltrado.length;
        this.c.totalExibidos = this.dadosExibidos.length;
        this.c.pagItensIni = (this.c.pagAtual - 1) * this.c.pagPorPagina + 1;
        this.c.pagItensFim = this.c.pagItensIni + (this.c.pagPorPagina - 1);
        if (this.c.pagItensFim > this.c.totalFiltrado)
            this.c.pagItensFim = this.c.totalFiltrado;
        this.c.totPags = Math.ceil(this.dadosFiltrado.length / this.c.pagPorPagina);
        mkt.html(this.c.tableTotal, this.c.totalFull.toString());
        mkt.html(this.c.tableFiltrado, this.c.totalFiltrado.toString());
        mkt.html(this.c.tableIni, this.c.pagItensIni.toString());
        mkt.html(this.c.tableFim, this.c.pagItensFim.toString());
    };
    atualizaNaPaginaUm = async () => {
        this.c.pagAtual = 1;
        this.atualizarListagem();
    };
    mudaPag = (e) => {
        if (e.classList.contains("pag0")) {
            if (this.c.pagAtual >= 2)
                this.c.pagAtual -= 1;
        }
        else if (e.classList.contains("pag8")) {
            this.c.pagAtual += 1;
        }
        else {
            this.c.pagAtual = Number(e.innerHTML);
        }
        this.atualizarListagem();
    };
    processoPaginar = () => {
        mkt.html(this.c.pag + "7", this.c.totPags.toString());
        this.c.pagAtual == 1 ? mkt.Qoff(this.c.pag + "0") : mkt.Qon(this.c.pag + "0");
        if (this.c.totPags > 1) {
            mkt.QverOn(this.c.pag + "0");
            mkt.QverOn(this.c.pag + "8");
            mkt.QverOn(this.c.pag + "7");
        }
        else {
            mkt.QverOff(this.c.pag + "0");
            mkt.QverOff(this.c.pag + "8");
            mkt.QverOff(this.c.pag + "7");
        }
        this.c.pagAtual >= this.c.totPags
            ? mkt.Qoff(this.c.pag + "8")
            : mkt.Qon(this.c.pag + "8");
        mkt.QverOn(this.c.pag + "1");
        this.c.totPags > 2
            ? mkt.QverOn(this.c.pag + "2")
            : mkt.QverOff(this.c.pag + "2");
        this.c.totPags > 3
            ? mkt.QverOn(this.c.pag + "3")
            : mkt.QverOff(this.c.pag + "3");
        this.c.totPags > 4
            ? mkt.QverOn(this.c.pag + "4")
            : mkt.QverOff(this.c.pag + "4");
        this.c.totPags > 5
            ? mkt.QverOn(this.c.pag + "5")
            : mkt.QverOff(this.c.pag + "5");
        this.c.totPags > 6
            ? mkt.QverOn(this.c.pag + "6")
            : mkt.QverOff(this.c.pag + "6");
        if (this.c.pagAtual < 5 || this.c.totPags == 5 || this.c.totPags == 6) {
            mkt.Qon(this.c.pag + "2");
            mkt.html(this.c.pag + "2", "2");
            mkt.html(this.c.pag + "3", "3");
            mkt.html(this.c.pag + "4", "4");
            mkt.html(this.c.pag + "5", "5");
            mkt.html(this.c.pag + "6", "...");
            mkt.Qoff(this.c.pag + "6");
        }
        else {
            if (this.c.totPags - this.c.pagAtual < 4) {
                mkt.Qoff(this.c.pag + "2");
                mkt.html(this.c.pag + "2", "...");
                mkt.html(this.c.pag + "3", (this.c.totPags - 4).toString());
                mkt.html(this.c.pag + "4", (this.c.totPags - 3).toString());
                mkt.html(this.c.pag + "5", (this.c.totPags - 2).toString());
                mkt.html(this.c.pag + "6", (this.c.totPags - 1).toString());
                mkt.Qon(this.c.pag + "6");
            }
            else {
                mkt.Qoff(this.c.pag + "2");
                mkt.html(this.c.pag + "2", "...");
                mkt.html(this.c.pag + "3", (this.c.pagAtual - 1).toString());
                mkt.html(this.c.pag + "4", this.c.pagAtual.toString());
                mkt.html(this.c.pag + "5", (this.c.pagAtual + 1).toString());
                mkt.html(this.c.pag + "6", "...");
                mkt.Qoff(this.c.pag + "6");
            }
        }
        mkt.QAll(this.c.pagBotao).forEach((li) => {
            li.classList.remove("ativo");
            if (this.c.pagAtual == Number(li.innerHTML)) {
                li.classList.add("ativo");
            }
        });
        this.dadosExibidos = [];
        this.dadosFiltrado.forEach((o, i) => {
            if (i + 1 >= this.c.pagItensIni && i + 1 <= this.c.pagItensFim) {
                this.dadosExibidos.push(mkt.clonar(o));
            }
        });
    };
    _RecoletarFiltros = () => {
        this.c.objFiltro = {};
        mkt.QAll(this.c.filtro).forEach((e) => {
            this.updateFiltroElemento(e);
        });
    };
    updateFiltro = () => {
        this._RecoletarFiltros();
        this.atualizaNaPaginaUm();
    };
    updateFiltroElemento = (e) => {
        if (e.value != null && e.getAttribute("data-mkfignore") != "true") {
            this.c.objFiltro[e.name] = {
                formato: e.getAttribute("data-mkfformato"),
                operador: e.getAttribute("data-mkfoperador"),
                conteudo: e.value,
            };
        }
        if (this.c.objFiltro[e.name]["conteudo"] == "" ||
            this.c.objFiltro[e.name]["conteudo"] == "0" ||
            this.c.objFiltro[e.name]["conteudo"] == 0 ||
            this.c.objFiltro[e.name]["conteudo"] === null) {
            delete this.c.objFiltro[e.name];
        }
    };
    gerarParametros = () => {
        return mkt.QAll(this.c.filtro)
            .map((i) => {
            if (i.value != "")
                return "&" + i.name + "=" + encodeURIComponent(i.value);
        })
            .join("");
    };
    setFiltroListener = () => {
        if (this.c.botaoNovaConsulta != null) {
            mkt.Ao("click", this.c.botaoNovaConsulta, (e) => {
                mkt.l("NOVA consulta ()");
                this.mais(this.gerarParametros());
            });
        }
        mkt.Ao("input", this.c.filtro, (e) => {
            if (this.c.botaoNovaConsulta != null) {
                let parametroAtual = this.gerarParametros();
                if (parametroAtual != this.ultimoParametro) {
                    mkt.Qon(this.c.botaoNovaConsulta);
                }
                else {
                    mkt.Qoff(this.c.botaoNovaConsulta);
                }
            }
            if (this.c.filtroDinamico) {
                this.updateFiltroElemento(e);
                this.atualizaNaPaginaUm();
            }
        });
    };
    headSeeMenuAbrir = (colName, e) => {
        e.classList.add("relative");
        if (!e.querySelector(".mkhmHeadIco")) {
            let mkhmIco = document.createElement("div");
            mkhmIco.className = "mkhmHeadIco";
            mkhmIco.innerHTML = mkt.a.SVGINI + mkt.a.svgFiltro + mkt.a.SVGFIM;
            mkt.Ao("click", mkhmIco, () => {
                this.headMenuAbrir(colName);
            });
            e.appendChild(mkhmIco);
        }
    };
    headMenuAbrir = async (colName) => {
        let eHead = mkt.Q(this.c.container + " .sort-" + colName);
        let eHm = mkt.Q("body .mkHeadMenu");
        if (eHm == null) {
            let ehm = document.createElement("div");
            ehm.className = "mkHeadMenu oculto";
            ehm.innerHTML = `
			<div class='hmin fimsecao'>
				<div class='i htit nosel'>
					<div class='microPos5 botao hmPrevious'>${mkt.a.SVGINI}${mkt.a.svgLeft}${mkt.a.SVGFIM}</div>
					<div class='hmTitulo'>Filtro</div>
					<div class='flr'>
						<div class='microPos5 botao hmNext'>${mkt.a.SVGINI}${mkt.a.svgRight}${mkt.a.SVGFIM}</div>
						<div class='fechar botao hmHide'>${mkt.a.SVGINI}${mkt.a.svgFecha}${mkt.a.SVGFIM}</div>
					</div>
				</div>
				<ul>
					<li class='hmCrescente claico botao nosel'>${mkt.a.SVGINI}${mkt.a.svgAB}${mkt.a.SVGFIM}${mkt.a.espaco}${mkt.a.clacre}</li>
					<li class='hmDecrescente claico botao nosel fimsecao'>${mkt.a.SVGINI}${mkt.a.svgBA}${mkt.a.SVGFIM}${mkt.a.espaco}${mkt.a.cladec}</li>
					<li><input class='hmContemInput nosel' type='text' name='filtrarCampo' placeholder='${mkt.a.contem}'></li>
					<li class='hmLimpar limpar botao nosel'>${mkt.a.SVGINI}${mkt.a.svgFiltro}${mkt.a.SVGFIM}${mkt.a.espaco}${mkt.a.limparIndivisual}${mkt.a.espaco}<span class='hmTitulo'></span></li>
					<li class='hmLimparTodos limpar botao nosel fimsecao'>${mkt.a.SVGINI}${mkt.a.svgFiltro}${mkt.a.SVGFIM}${mkt.a.espaco}${mkt.a.limparTodos}</li>
					<li><input class='hmFiltraExclusivo' type='search' name='filtrarPossibilidades' placeholder='Pesquisar'></li>
					<li><div class='possibilidades'></div></li>
				</ul>
			</div>`;
            document.body.appendChild(ehm);
            mkt.Ao("click", ".mkHeadMenu .hmPrevious", (e) => {
                let eHmenu = mkt.Q("body .mkHeadMenu");
                mkt.hm.Previous(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
            });
            mkt.Ao("click", ".mkHeadMenu .hmNext", (e) => {
                let eHmenu = mkt.Q("body .mkHeadMenu");
                mkt.hm.Next(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
            });
            mkt.Ao("click", ".mkHeadMenu .hmHide", (e) => {
                mkt.Q("body .mkHeadMenu")?.classList.add("oculto");
            });
            mkt.Ao("click", ".mkHeadMenu .hmCrescente", (e) => {
                let eHmenu = mkt.Q("body .mkHeadMenu");
                mkt.hm.Crescente(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
            });
            mkt.Ao("click", ".mkHeadMenu .hmDecrescente", (e) => {
                let eHmenu = mkt.Q("body .mkHeadMenu");
                mkt.hm.Decrescente(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
            });
            mkt.Ao("click", ".mkHeadMenu .hmLimpar", (e) => {
                let eHmenu = mkt.Q("body .mkHeadMenu");
                mkt.hm.Limpar(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
            });
            mkt.Ao("click", ".mkHeadMenu .hmLimparTodos", (e) => {
                let eHmenu = mkt.Q("body .mkHeadMenu");
                mkt.hm.LimparTodos(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
            });
            mkt.Ao("input", ".mkHeadMenu .hmFiltraExclusivo", (e) => {
                mkt.hm.FiltraExclusivo(e.value, e.closest(".mkHeadMenu")?.getAttribute("data-mkt"));
            });
            mkt.Ao("input", ".mkHeadMenu .hmContemInput", (e) => {
                let eHmenu = mkt.Q("body .mkHeadMenu");
                mkt.hm.ContemInput(e.value, eHmenu?.getAttribute("data-colname"), e.closest(".mkHeadMenu")?.getAttribute("data-mkt"));
            });
        }
        eHm = mkt.Q("body .mkHeadMenu");
        let thisList = this.getIndexOf().toString();
        eHm.setAttribute("data-colname", colName);
        eHm.setAttribute("data-mkt", thisList);
        if (this.c.objFiltro[colName]?.formato == "string") {
            mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = this.c.objFiltro[colName]?.conteudo;
        }
        else {
            mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
        }
        mkt.Q(".mkHeadMenu input[name='filtrarPossibilidades']").value = "";
        if (this.c.objFiltro[colName]?.formato == "mkHeadMenuSel") {
            this.hmunsel = this.c.objFiltro[colName].conteudo;
        }
        else {
            this.hmunsel = [];
        }
        this.exclusivos = await mkt.addTask({ k: "Exclusivos", v: this.dadosFull });
        this.exclusivos = this.exclusivos.v[colName.split(".")[0]];
        let exclusivosProcessado = [];
        if (colName.includes(".")) {
            this.exclusivos?.forEach((ex) => {
                let colv = mkt.getV(colName, ex).toString();
                exclusivosProcessado.push(colv);
            });
            this.exclusivos = exclusivosProcessado;
        }
        if (!this.exclusivos) {
            this.exclusivos = [];
        }
        ;
        mkt.hm.FiltraExclusivo("", thisList);
        mkt.atribuir(mkt.Q("body"), () => { mkt.hm.Hide(event); }, "onclick");
        let colNameLabel = colName;
        let esteLabel = this.getModel()?.filter((f) => { return f.k == colName; })?.[0]?.l;
        if (esteLabel) {
            colNameLabel = esteLabel;
        }
        if (colNameLabel == colName) {
            if (eHead) {
                colNameLabel = eHead?.innerHTML;
            }
            else {
                colNameLabel = colName;
            }
        }
        mkt.QAll("body .mkHeadMenu .hmTitulo").forEach((e) => {
            e.innerHTML = colNameLabel;
        });
        eHm.classList.remove("oculto");
        mkt.Q(".mkHeadMenu input[name='filtrarCampo']").focus();
    };
    headAtivar = () => {
        let eTrHeadPai = mkt.Q(this.c.container + " thead tr");
        let opcoes = this.getModel().map(o => { if (o.f == false) {
            return o.k;
        } }).filter(r => { return r != null; });
        if (eTrHeadPai) {
            Array.from(eTrHeadPai.children).forEach((th) => {
                let possui = false;
                [...th.classList].forEach((classe) => {
                    if (classe.indexOf("sort-") == 0) {
                        possui = classe;
                    }
                });
                if (possui != false) {
                    let colName = possui.replace("sort-", "");
                    if (colName != "") {
                        if (this.c.headSort == true) {
                            mkt.Ao("click", th, (e) => {
                                this.orderBy(colName);
                            });
                        }
                        if (this.c.headMenu == true) {
                            if (!opcoes?.includes(colName)) {
                                mkt.Ao("mousemove", th, (e) => {
                                    this.headSeeMenuAbrir(colName, e);
                                });
                            }
                        }
                    }
                }
            });
        }
    };
    setDirSort = (propriedade, direcao = 2) => {
        if (propriedade != null) {
            if (direcao == 2) {
                if (propriedade != this.c.sortBy) {
                    this.c.sortDir = 0;
                }
                else {
                    this.c.sortDir == 0 ? (this.c.sortDir = 1) : (this.c.sortDir = 0);
                }
            }
            else if (direcao == 1) {
                this.c.sortDir = 1;
            }
            else {
                this.c.sortDir = 0;
            }
            this.c.sortBy = propriedade;
        }
    };
    orderBy = (propriedade, direcao = 2) => {
        this.setDirSort(propriedade, Number(direcao));
        this.dadosFull = mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
        this.efeitoSort();
        this.atualizarListagem();
    };
    efeitoSort = () => {
        let thsAll = mkt.QAll(this.c.ths);
        if (thsAll.length != 0) {
            thsAll.forEach((th) => {
                th.classList.remove("mkEfeitoDesce");
                th.classList.remove("mkEfeitoSobe");
            });
        }
        let thsSort = mkt.QAll(this.c.ths);
        if (thsSort.length != 0) {
            thsSort.forEach((thSort) => {
                if (thSort.classList.contains(`sort-${this.c.sortBy}`)) {
                    if (this.c.sortDir == 1) {
                        thSort.classList.add("mkEfeitoDesce");
                    }
                    else {
                        thSort.classList.add("mkEfeitoSobe");
                    }
                }
            });
        }
    };
    clearFiltro = (campoEspecifico = null) => {
        if (campoEspecifico) {
            if (this.c.objFiltro[campoEspecifico]) {
                delete this.c.objFiltro[campoEspecifico];
            }
            mkt.QAll(this.c.filtro + "[name='" + campoEspecifico + "']").forEach((e) => {
                e.value = "";
            });
        }
        else {
            this.c.objFiltro = {};
            mkt.QAll(this.c.filtro).forEach((e) => {
                e.value = "";
            });
        }
    };
    clearFiltroUpdate = () => {
        this.clearFiltro();
        this.atualizarListagem();
    };
    getObj = (valorKey) => {
        let temp = null;
        if (Array.isArray(this.dadosFull) && mkt.classof(this.c.pk) == "String") {
            this.dadosFull.forEach((o) => {
                if (o[this.c.pk] == valorKey) {
                    temp = o;
                }
            });
        }
        return temp;
    };
    getObjs = (k, v) => {
        let array = [];
        let errNotPresent = false;
        let errKeyInvalid = false;
        if (Array.isArray(this.dadosFull)) {
            if (mkt.classof(k) == "String") {
                this.dadosFull.forEach((o) => {
                    if (k in o) {
                        if (o[k] == v) {
                            array.push(o);
                        }
                    }
                    else {
                        errNotPresent = true;
                    }
                });
            }
            else {
                errKeyInvalid = true;
            }
        }
        if (errNotPresent)
            mkt.w("Erro getObjs(): Key não está presente em um ou mais objetos.");
        if (errKeyInvalid)
            mkt.w("Erro getObjs(): Key precisa ser no formato string.");
        return array;
    };
    setObj = (v, objeto) => {
        let temp = null;
        if (Array.isArray(this.dadosFull) && (mkt.classof(this.c.pk) == "String")) {
            let o = this.find(this.c.pk, v);
            if (o) {
                if (mkt.classof(objeto) == "Object") {
                    for (let p in objeto) {
                        o[p] = objeto[p];
                    }
                }
                temp = o;
            }
            else {
                this.dadosFull.push(objeto);
                temp = objeto;
            }
        }
        return temp;
    };
    getModel = (valorKey) => {
        if (valorKey) {
            let obj = this.getObj(valorKey);
            if (obj != null) {
                let model = mkt.clonar(this.c.model);
                model.forEach((i) => {
                    i.v = obj[i.k];
                    let temp = document.createElement("template");
                    temp.innerHTML = i.field;
                    let field = temp.content.cloneNode(true).querySelector("*");
                    if (i.tag == "textarea") {
                        field.innerHTML = obj[i.k] ? obj[i.k] : "";
                    }
                    else if (i.tag == "img") {
                        field.setAttribute("src", obj[i.k] ? obj[i.k] : "");
                    }
                    else {
                        field.setAttribute("value", obj[i.k] ? obj[i.k] : "");
                    }
                    i.field = field?.outerHTML;
                });
                return model;
            }
            else {
                mkt.w("getModel() - Objeto solicitado inexistente: ", valorKey);
                return null;
            }
        }
        else {
            return this.c.model;
        }
    };
    getUsedKeys = (formatoKV = false) => {
        let kv = [];
        let chaves = new Set();
        this.dadosFull.forEach((o) => {
            Object.keys(o).forEach((p) => {
                chaves.add(p);
            });
        });
        if (formatoKV) {
            [...chaves].forEach((k) => {
                let obj = {};
                obj.k = k;
                kv.push(obj);
            });
            return kv;
        }
        else {
            return [...chaves];
        }
    };
    getNewPK = () => {
        let maior = 0;
        if (mkt.classof(this.c.pk) == "String") {
            this.dadosFull.forEach((o) => {
                if (o[this.c.pk] > maior) {
                    maior = Number(o[this.c.pk]);
                }
            });
        }
        return Number(maior) + 1;
    };
    getAllTr = () => {
        return Array.from(mkt.QAll(this.c.container + " tbody tr"));
    };
    add = (objDados, ordenar = true) => {
        objDados = this.c.aoReceberDados(objDados, this);
        this.dadosFull.push(objDados);
        if (ordenar)
            mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
        this.atualizarListagem();
    };
    edit = (objDados, k, v, ordenar = true) => {
        objDados = this.c.aoReceberDados(objDados, this);
        this.dadosFull = mkt.setObjetoFromId(k, v, objDados, this.dadosFull);
        if (ordenar)
            mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
        this.atualizarListagem();
    };
    del = (k, v) => {
        this.dadosFull = mkt.delObjetoFromId(k, v, this.dadosFull);
        mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
        this.atualizarListagem();
    };
    addMany = (arrayDados) => {
        this.dadosFull.push(...arrayDados);
        this.atualizarListagem();
    };
    find = (k, v) => {
        return this.dadosFull.find((o) => o[k] == v);
    };
    getIndexOf = () => {
        return mkt.a.build.indexOf(this);
    };
    static getThis = (build) => {
        return mkt.a.build[build];
    };
    toJSON = () => {
        return this.dadosFull;
    };
    toString = () => {
        return mkt.stringify(this.dadosFull);
    };
    static toString = () => {
        return 'class mkt { /* classe gerenciadora de listagens */ }';
    };
    valueOf = () => {
        return this.dadosFull;
    };
    get [Symbol.toStringTag]() {
        return "mkt";
    }
    [Symbol.iterator]() {
        let iteratorArray = this.dadosFull[Symbol.iterator]();
        return {
            next() {
                return iteratorArray.next();
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    static a = {
        ALL: "*/*",
        FORMDATA: "multipart/form-data",
        GET: "GET",
        HTML: "text/html",
        JSON: "application/json",
        POST: "POST",
        SVGINI: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>",
        SVGFIM: "</svg>",
        AoConfig: {
            capture: false,
            once: false,
            passive: true,
        },
        build: [],
        clacre: "Classificar Crescente",
        cladec: "Classificar Decrescente",
        mkConfirmaFuncaoFora: () => { },
        contaListas: 0,
        contaOrdena: 0,
        contaImportados: 0,
        contem: "Contém...",
        debug: 0,
        definePropertyExceptions: ["regras"],
        espaco: "&nbsp;",
        exeTimer: 500,
        limparIndivisual: "Limpar filtros de",
        limparTodos: "Limpar todos filtros",
        log: true,
        meses: [
            [1, "Janeiro", "JAN", "01"],
            [2, "Fevereiro", "FEV", "02"],
            [3, "Março", "MAR", "03"],
            [4, "Abril", "ABR", "04"],
            [5, "Maio", "MAI", "05"],
            [6, "Junho", "JUN", "06"],
            [7, "Julho", "JUL", "07"],
            [8, "Agosto", "AGO", "08"],
            [9, "Setembro", "SET", "09"],
            [10, "Outubro", "OUT", "10"],
            [11, "Novembro", "NOV", "11"],
            [12, "Dezembro", "DEZ", "12"],
        ],
        msg: {
            po: "Preenchimento Obrigatório",
            so: "Seleção Obrigatória",
            fi: "Formato Inválido",
            in: "Indisponível",
            negado: "Negado",
            maxc: "Limite de caracteres atingido",
            minc: "Mínimo de caracteres: ",
            nummax: "Máximo: ",
            nummin: "Mínimo: ",
            some: "Requer: ",
            datamax: "Data maior que o esperado",
            charproibido: "Não utilize: ",
            apenasnumeros: "Apenas Números",
            apenasnumerosvirgula: "Apenas Números e Virgula",
            apenasletras: "Apenas Letras",
            datamaiorque: "Deve ser maior que hoje",
            datamenorque: "Deve ser menor que hoje",
            carregarmais: "Carregar Mais Resultados",
            emailinvalido: "Email com formato inválido",
        },
        mkFaseAtual: 1,
        poppers: new Map(),
        queue: new Map(),
        svgAB: "<path fill-rule='evenodd' d='M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z'/><path d='M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z'/>",
        svgBA: "<path fill-rule='evenodd' d='M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z'/><path d='M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z'/>",
        svgFecha: "<path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'/>",
        svgFiltro: "<path d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z'/>",
        svgLeft: "<path fill-rule='evenodd' d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0'/>",
        svgRight: "<path fill-rule='evenodd' d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708'/>",
        svgSquare: "<path d='M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z'/>",
        timers: [],
        util: {
            cpf: ["000.000.000-00", "^([0-9]{3}([\.]?[0-9]{3}){2}[-]?[0-9]{2})$", (cpf) => {
                    let m1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
                    let m2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
                    if (!cpf) {
                        return false;
                    }
                    cpf = mkt.apenasNumeros(cpf);
                    if (cpf.length != 11) {
                        return false;
                    }
                    let temp = cpf.slice(0, 9);
                    let c = 0;
                    for (let i = 0; i < 9; i++) {
                        c += Number(temp.charAt(i)) * m1[i];
                    }
                    let r = c % 11;
                    (r < 2) ? r = 0 : r = 11 - r;
                    temp += r.toString();
                    c = 0;
                    for (let i = 0; i < 10; i++) {
                        c += Number(temp.charAt(i)) * m2[i];
                    }
                    r = c % 11;
                    (r < 2) ? r = 0 : r = 11 - r;
                    return cpf.charAt(10) == r.toString();
                }],
            cep: ["00.000-000", "^([0-9]{2}[\.]?[0-9]{3}[-]?[0-9]{3})$", (cep) => {
                    if (!cep) {
                        return false;
                    }
                    cep = mkt.apenasNumeros(cep);
                    if (cep.length != 8) {
                        return false;
                    }
                    return true;
                }],
            cnpj: [
                "00.000.000/0000-00",
                "^([0-9]{2}([\.]?[0-9]{3}){2}[\/]?[0-9]{4}[-]?[0-9]{2})$", (cnpj) => {
                    let m1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
                    let m2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
                    if (!cnpj) {
                        return false;
                    }
                    cnpj = mkt.apenasNumeros(cnpj);
                    if (cnpj.length != 14) {
                        return false;
                    }
                    let temp = cnpj.slice(0, 12);
                    let c = 0;
                    for (let i = 0; i < 12; i++) {
                        c += Number(temp.charAt(i)) * m1[i];
                    }
                    let r = (c % 11);
                    (r < 2) ? r = 0 : r = 11 - r;
                    temp += r.toString();
                    c = 0;
                    for (let i = 0; i < 13; i++) {
                        c += Number(temp.charAt(i)) * m2[i];
                    }
                    r = (c % 11);
                    (r < 2) ? r = 0 : r = 11 - r;
                    return cnpj.charAt(13) == r.toString();
                }
            ],
            cpf_cnpj: [
                (str) => {
                    if (mkt.apenasNumeros(str).length <= 11) {
                        return "000.000.000-00";
                    }
                    else {
                        return "00.000.000/0000-00";
                    }
                    ;
                },
                "^([0-9]{2}([\.]?[0-9]{3}){2}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}([\.]?[0-9]{3}){2}[-]?[0-9]{2})$", (cpf_cnpj) => {
                    return mkt.a.util.cpf[2](cpf_cnpj) || mkt.a.util.cnpj[2](cpf_cnpj);
                }
            ],
            cnh: ["00000000000", "^([0-9]{11})$", (cnh) => {
                    if (!cnh) {
                        return false;
                    }
                    cnh = mkt.apenasNumeros(cnh);
                    if (cnh.length != 11) {
                        return false;
                    }
                    return true;
                }],
            rg: ["00.000.000-0", "^[0-9]{2}([\.]?[0-9]{3}){2}[-]?[0-9]$", (rg) => {
                    rg = rg.replace(/[^0-9]/g, '');
                    if (rg.length !== 9)
                        return false;
                    let soma = 0;
                    const pesos = [2, 3, 4, 5, 6, 7, 8, 9, 100];
                    for (let i = 0; i < 8; i++) {
                        soma += parseInt(rg[i]) * pesos[i];
                    }
                    let resto = soma % 11;
                    let dig = resto === 0 ? 0 : 11 - resto;
                    if (dig === 10)
                        dig = 0;
                    if (parseInt(rg[8]) !== dig) {
                        return false;
                    }
                    return true;
                }],
            placa: ["AAA-0S00", "^([A-Za-z]{3}[-]?[0-9]{1}[A-Za-z0-9]{1}[0-9]{2})$"],
            placaAntesMercosul: ["AAA-0000", "^([A-Za-z]{3}[-]?[0-9]{4})$"],
            placaMercosul: [
                "AAA-0A00",
                "^([A-Za-z]{3}[-]?[0-9]{1}[A-Za-z]{1}[0-9]{2})$",
            ],
            pis: [
                "000.00000.00-0",
                "^([0-9]{3}[\.]?[0-9]{5}[\.]?[0-9]{2}[-]?[0-9]{1})$",
            ],
            money: ["#0.000.000.000.000.000,00"],
            dia: ["00", "^([0-3]?[0-9])$"],
            mes: ["00", "^([0-1]?[0-9])$"],
            ano: ["0000", "^([0-2]?([0-9]){3})$"],
            anoRecente: ["0000", "^(1[8-9]([0-9]){2})|(20([0-9]){2})$"],
            ip: ["000.000.000.000", "^([0-2]?[0-9]?[0-9]([\.][0-2]?[0-9]?[0-9]){3})$"],
            data: ["0000-00-00", "^([0-9]{4}(-[0-9]{2}){2})$"],
            dataIso8601: [
                "0000-00-00T00:00:00.000Z",
                "^([0-9]{4}(-[0-9]{2}){2}T[0-9]{2}(:[0-9]{2})\.[0-9]{3}Z)$",
            ],
            numeros: ["0", "^[0-9]*$"],
            numerosvirgula: ["0", "^[0-9,]*$"],
            letras: ["A", "^[A-Za-z]*$"],
            telefone_ddd: ["(00) 00000-00000", "^[0-9]{11}$"],
            email: ["S", "^(([a-zA-Z0-9_\.]+[a-zA-Z0-9_]+)+)@([a-zA-Z0-9_]\.+[a-zA-Z]+)+$"],
        },
        wpool: null,
    };
    static Q = (query) => {
        if (mkt.classof(query) == "String")
            return document.querySelector(query);
        return query;
    };
    static QAll = (query = "body") => {
        if (mkt.classof(query) == "String") {
            return Array.from(document.querySelectorAll(query));
        }
        else if (mkt.classof(query).endsWith("Element")) {
            return [query];
        }
        else if (mkt.classof(query) == "Array") {
            return query;
        }
        else {
            mkt.w("QAll() - Requer String / Elemento. ClassOf: ", mkt.classof(query), " Query: ", query);
            return [];
        }
    };
    static QverOff = (query = "body") => {
        return mkt.aCadaElemento(query, (e) => {
            e?.classList.add("oculto");
        });
    };
    static QverOn = (query = "body") => {
        return mkt.aCadaElemento(query, (e) => {
            e?.classList.remove("oculto");
        });
    };
    static Qoff = (query = "body") => {
        return mkt.aCadaElemento(query, (e) => {
            e.setAttribute("disabled", "");
            e.classList.add("disabled");
            e.setAttribute("tabindex", "-1");
        });
    };
    static Qon = (query = "body") => {
        return mkt.aCadaElemento(query, (e) => {
            e.removeAttribute("disabled");
            e.classList.remove("disabled");
            e.removeAttribute("tabindex");
        });
    };
    static Ao = (tipoEvento = "click", query, executar, autoExecutar = false, config = mkt.a.AoConfig) => {
        mkt.QAll(query).forEach((e) => {
            e.addEventListener(tipoEvento, (ev) => {
                if (ev)
                    ev.stopPropagation();
                executar(e, ev);
            }, config);
            if (autoExecutar === true) {
                executar(e, null);
            }
        });
    };
    static atribuir = (e, gatilho, atributo = "oninput") => {
        if (e) {
            if (atributo) {
                let tipo = mkt.classof(gatilho);
                if (tipo == "Function") {
                    e[atributo] = gatilho;
                }
                else if (tipo == "String") {
                    let attr = e?.getAttribute(atributo);
                    if (attr) {
                        if (!attr.includes(gatilho)) {
                            e?.setAttribute(atributo, attr + ";" + gatilho);
                        }
                    }
                    else {
                        e?.setAttribute(atributo, gatilho);
                    }
                }
                else {
                    mkt.w("mkt.atribuir() - Formato não implementado: ", tipo);
                }
            }
            else {
                mkt.w("mkt.atribuir() - Precisa de um gatilho: ", gatilho);
            }
        }
        else {
            mkt.w("mkt.atribuir() - Precisa de um elemento: ", e);
        }
    };
    static html = (query, conteudo) => {
        let e = mkt.Q(query);
        if (e) {
            e.innerHTML = conteudo;
        }
        return e;
    };
    static wait = (ms) => {
        return new Promise(r => setTimeout(r, ms));
    };
    static QSetAll = (query = "input[name='#PROP#']", dados = null, comEvento = true) => {
        let eAfetados = [];
        if (mkt.classof(dados) == "Object") {
            for (let p in dados) {
                let eDynamicQuery = mkt.Q(query.replaceAll("#PROP#", p));
                if (eDynamicQuery) {
                    if (mkt.getV(p, dados) != null) {
                        eDynamicQuery.value = mkt.getV(p, dados);
                        if (comEvento) {
                            eDynamicQuery.classList.add("atualizar");
                        }
                        else {
                            eDynamicQuery.classList.add("atualizarSemEvento");
                        }
                        eAfetados.push(eDynamicQuery);
                    }
                }
            }
        }
        else if (mkt.classof(dados) == "String") {
            mkt.QAll(query).forEach((e) => {
                e.value = dados;
            });
        }
        else {
            mkt.w("QSetAll - Tipo de dado não implementado: " + mkt.classof(dados));
        }
        return eAfetados;
    };
    static eventInput = (e) => {
        e.dispatchEvent(new Event("input"));
    };
    static QSubSet = (queryContainer, dados, eventInput = true) => {
        let eAfetados = [];
        if (mkt.classof(dados) == "Object") {
            mkt.QAll(queryContainer).forEach(e => {
                let v = mkt.getV(e.getAttribute("name"), dados);
                if (v == null) {
                    e.setAttribute("value", "");
                }
                else {
                    if (e.tagName == "IMG") {
                        e.src = v;
                    }
                    else if (e.tagName == "DIV") {
                        e.innerHTML = v;
                    }
                    else {
                        e.value = v;
                    }
                }
                eAfetados.push(e);
                if (eventInput) {
                    mkt.eventInput(e);
                }
            });
        }
        return eAfetados;
    };
    static Qison = (query = "body") => {
        return (mkt.QAll(query).some((e) => { return e.classList.contains("disabled"); }))
            ? false
            : true;
    };
    static QverToggle = (query = "body") => {
        return mkt.aCadaElemento(query, (e) => {
            e?.classList.toggle("oculto");
        });
    };
    static l = (...s) => {
        if (mkt.a.log) {
            console.log(...s);
        }
    };
    static w = (...s) => {
        if (mkt.a.log) {
            console.warn(...s);
        }
    };
    static gc = (...s) => {
        if (mkt.a.log) {
            console.groupCollapsed(...s);
        }
    };
    static ge = () => {
        if (mkt.a.log) {
            console.groupEnd();
        }
    };
    static erro = (...s) => {
        if (mkt.a.log) {
            console.error(...s);
        }
    };
    static ct = (s) => {
        let t = mkt.a.timers.find((t) => t.name == s);
        if (!t) {
            mkt.a.timers.push({
                name: s,
                ini: mkt.dataGetMs(),
                fim: 0,
                tempo: -1,
            });
        }
    };
    static cte = (s, config = null, ...rest) => {
        let t = mkt.a.timers.find((t) => t.name == s);
        if (t.fim == 0) {
            t.fim = mkt.dataGetMs();
            t.tempo = t.fim - t.ini;
        }
        if (config) {
            if (!config.quiet) {
                let corTempo = "#0F0";
                if (t.tempo > 80) {
                    corTempo = "#9F0;";
                }
                if (t.tempo > 200) {
                    corTempo = "#FF0;";
                }
                if (t.tempo > 500) {
                    corTempo = "#F90;";
                }
                if (t.tempo > 2000) {
                    corTempo = "#F00;";
                }
                mkt.l("%c" + t.tempo.toString().padStart(5) + `%c ms -> ${config._url.pathname}`, `color:${corTempo};`, "color:#777;", ``, ...rest);
            }
        }
    };
    static errosLog = () => {
        let mktArmazenado = localStorage.mktRequests;
        if (localStorage.mktRequests)
            mktArmazenado = JSON.parse(localStorage.mktRequests);
        return console.table(mktArmazenado);
    };
    static exeTimer = () => {
        mkt.mkRecRenderizar();
        mkt.wait(mkt.a.exeTimer).then(r => {
            mkt.exeTimer();
        });
    };
    static Inicializar = () => {
        mkt.clicarNaAba(mkt.Q(".mkAbas a.active"));
        mkt.exeTimer();
    };
    static moldeOA = async (dados, modelo = "#modelo", repositorio = ".tableListagem .listBody", allowTags = false, removeAspas = false) => {
        return new Promise((r) => {
            let eModelo = mkt.Q(modelo);
            if (!eModelo) {
                mkt.erro("Template informado não encontrado: ", modelo);
                return r(null);
            }
            let eRepositorio = mkt.Q(repositorio);
            if (!eRepositorio) {
                mkt.erro("Repositório informado não encontrado :", repositorio);
                return r(null);
            }
            let listaNode = "";
            let moldeO_Execute = (o) => {
                let node = eModelo.innerHTML;
                let ret = "";
                if (node.indexOf("${") >= 0) {
                    let ini = node.split("${");
                    ret = ini[0];
                    for (let i in ini) {
                        if (i == "0")
                            continue;
                        let end = ini[i].indexOf("}");
                        let key = ini[i].slice(0, end).trim();
                        if ((mkt.classof(o) == "Object" || mkt.classof(o) == "Array") && o != null) {
                            let v = mkt.getV(key, o);
                            if (removeAspas)
                                v = mkt.removerAspas(v);
                            if (v != null) {
                                ret += v;
                            }
                        }
                        ret += ini[i].slice(end + 1);
                    }
                    node = ret;
                }
                if (node.indexOf("#{") >= 0) {
                    let ini = node.split("#{");
                    ret = ini[0];
                    for (let i in ini) {
                        if (i == "0")
                            continue;
                        let end = ini[i].indexOf("}");
                        let key = ini[i].slice(0, end).trim();
                        if ((mkt.classof(o) == "Object" || mkt.classof(o) == "Array") && o != null) {
                            let v = mkt.getV(key, o);
                            if (removeAspas)
                                v = mkt.removerAspas(v);
                            if (v != null) {
                                ret += "${" + v + "}";
                            }
                        }
                        ret += ini[i].slice(end + 1);
                    }
                    node = ret;
                }
                listaNode += node;
            };
            mkt.aCadaObjExecuta(dados, moldeO_Execute);
            if (allowTags) {
                listaNode = listaNode.replaceAll("&lt;", "<");
                listaNode = listaNode.replaceAll("&gt;", ">");
            }
            eRepositorio.innerHTML = listaNode;
            [...eRepositorio.querySelectorAll("*")].forEach(e => {
                if (e.classList.contains("r_e_m"))
                    e.remove();
            });
            r(true);
        });
    };
    static getV = (keys, objeto) => {
        if (typeof objeto == "object") {
            if (mkt.classof(keys) == "String") {
                if (keys.includes(".")) {
                    let ks = keys.split(".");
                    let lastObj = objeto;
                    let lastV = {};
                    ks.forEach((k) => {
                        if (lastObj) {
                            lastV = lastObj[k];
                            if (typeof lastV == "object") {
                                lastObj = lastV;
                            }
                        }
                    });
                    return lastV;
                }
                else {
                    return objeto[keys];
                }
            }
            else {
                mkt.w("getV() - Nome da propriedade precisa ser em String. (" + mkt.classof(keys) + "):", keys);
            }
        }
        else {
            mkt.w("Para ver a chave, o parametro objeto precisa receber um objeto. (" + typeof objeto + ")");
        }
        return null;
    };
    static setV = (keys, value, objeto) => {
        if (typeof objeto == "object") {
            if (mkt.classof(keys) == "String") {
                if (keys.includes(".")) {
                    let ks = keys.split(".");
                    let lastObj = objeto;
                    ks.forEach((k) => {
                        if (ks.indexOf(k) == (ks.length - 1)) {
                            lastObj[k] = value;
                        }
                        else {
                            if (mkt.classof(lastObj[k]) != "Object") {
                                lastObj[k] = {};
                            }
                        }
                        lastObj = lastObj[k];
                    });
                    return objeto;
                }
                else {
                    objeto[keys] = value;
                    return objeto;
                }
            }
            else {
                mkt.w("setV() - Nome da propriedade precisa ser em string. (" + mkt.classof(keys) + "):", keys);
            }
        }
        else {
            mkt.w("setV() - Objeto precisa receber um objeto. (" + typeof objeto + ")");
        }
        return null;
    };
    static processoFiltragem = (aTotal, objFiltro, inst) => {
        let aFiltrada = [];
        if (Array.isArray(aTotal)) {
            let temp = [];
            aTotal.forEach((o) => {
                let podeExibir = true;
                if (inst.c.filtroExtra != null)
                    podeExibir = inst.c.filtroExtra(o);
                if (mkt.classof(podeExibir) != "Boolean") {
                    podeExibir = true;
                    mkt.w("filtroExtra() precisa retornar boolean");
                }
                for (let propFiltro in objFiltro) {
                    let m = null;
                    if (o[propFiltro] != null) {
                        m = o[propFiltro];
                    }
                    if (propFiltro.includes(".")) {
                        m = mkt.getV(propFiltro, o);
                    }
                    if (m != null) {
                        let k = objFiltro[propFiltro];
                        if (k.formato === "string") {
                            k.conteudo = k.conteudo.toString().toLowerCase();
                            if (!mkt.contem(m, k.conteudo)) {
                                podeExibir = false;
                            }
                        }
                        else if (k.formato === "mkHeadMenuSel") {
                            let item = mkt.removeEspecias(m).toString().toLowerCase().trim();
                            if (k.conteudo.includes(item)) {
                                podeExibir = false;
                            }
                        }
                        else if (k.formato === "stringNumerosVirgula") {
                            let algum = false;
                            let arrayM = m.toString().split(",");
                            let arrayK = k.conteudo.toString().split(",");
                            arrayK.forEach((numeroK) => {
                                algum = arrayM.some((numeroM) => {
                                    return Number(numeroM) == Number(numeroK);
                                });
                            });
                            if (!algum) {
                                podeExibir = false;
                            }
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
                    if (objFiltro["mkFullFiltro"]) {
                        let k = objFiltro["mkFullFiltro"]["conteudo"]
                            .toString()
                            .toLowerCase();
                        podeExibir = false;
                        mkt.aCadaSubPropriedade(o, (v) => {
                            if (v != null) {
                                v = v.toString().toLowerCase();
                                if (v.match(k)) {
                                    podeExibir = true;
                                }
                            }
                        });
                    }
                }
                if (podeExibir) {
                    temp.push(o);
                }
            });
            aFiltrada = temp;
        }
        else {
            aFiltrada = [];
        }
        return aFiltrada;
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
    static setObjetoFromId = (nomeKey, valorKey, itemModificado, listaDados) => {
        if (Array.isArray(listaDados)) {
            for (let i = 0; i < listaDados.length; i++) {
                if (listaDados[i][nomeKey] == valorKey) {
                    listaDados[i] = itemModificado;
                }
            }
        }
        return listaDados;
    };
    static hm = {
        Hide: (ev) => {
            let ehm = mkt.Q("body .mkHeadMenu");
            let ethm = ev.target.closest('.mkHeadMenu');
            if (!ethm) {
                ehm?.classList.add("oculto");
            }
        },
        Previous: (colName, iof) => {
            if ((mkt.classof(iof) == "String") && (mkt.classof(colName) == "String")) {
                let opcoes = mkt.getThis(Number(iof)).getModel().map((o) => { if (o.f)
                    return o.k; }).filter((r) => { return r != null; });
                let posAtual = opcoes.indexOf(colName);
                let posAnterior = 0;
                if (posAtual >= 0) {
                    posAnterior = posAtual - 1;
                }
                if (posAnterior < 0) {
                    posAnterior = opcoes.length - 1;
                }
                if (opcoes[posAnterior])
                    mkt.getThis(Number(iof)).headMenuAbrir(opcoes[posAnterior]);
            }
            else {
                mkt.w("mkt.hm.Previous() - Parametros precisam ser duas string: ", colName, iof);
            }
        },
        Next: (colName, iof) => {
            if (mkt.classof(iof) == "String") {
                let opcoes = mkt.getThis(Number(iof)).getModel().map((o) => { if (o.f)
                    return o.k; }).filter((r) => { return r != null; });
                let posAtual = opcoes.indexOf(colName);
                let posSeguinte = 0;
                if (posAtual >= 0) {
                    posSeguinte = posAtual + 1;
                }
                if (posSeguinte >= opcoes.length) {
                    posSeguinte = 0;
                }
                if (opcoes[posSeguinte])
                    mkt.getThis(Number(iof)).headMenuAbrir(opcoes[posSeguinte]);
            }
            else {
                mkt.w("mkt.hm.Next() - Parametros precisam ser uma string: ", colName, iof);
            }
        },
        Crescente: (colName, iof) => {
            if (mkt.classof(iof) == "String") {
                mkt.getThis(Number(iof)).orderBy(colName, 0);
            }
            else {
                mkt.w("mkt.hm.Crescente() - Parametros precisam ser string: ", colName, iof);
            }
        },
        Decrescente: (colName, iof) => {
            if (mkt.classof(iof) == "String") {
                mkt.getThis(Number(iof)).orderBy(colName, 1);
            }
            else {
                mkt.w("mkt.hm.Decrescente() - Parametros precisam ser string: ", colName, iof);
            }
        },
        Limpar: (colName, iof) => {
            mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
            mkt.getThis(Number(iof)).hmunsel = [];
            mkt.hm.FiltraExclusivo("", iof);
            mkt.getThis(Number(iof)).clearFiltro(colName);
            mkt.getThis(Number(iof)).atualizarListagem();
        },
        LimparTodos: (colName, iof) => {
            mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
            mkt.getThis(Number(iof)).hmunsel = [];
            mkt.hm.FiltraExclusivo("", iof);
            mkt.getThis(Number(iof)).clearFiltro();
            mkt.getThis(Number(iof)).atualizarListagem();
        },
        ContemInput: (v, colName, iof) => {
            mkt.getThis(Number(iof)).c.objFiltro[colName] = {
                formato: "string",
                operador: "",
                conteudo: v,
            };
            let getCampoUI = mkt.Q(`${mkt.getThis(Number(iof)).c.filtro}[name="${colName}"]`);
            if (getCampoUI)
                getCampoUI.value = v;
            mkt.getThis(Number(iof)).atualizaNaPaginaUm();
        },
        FiltraExclusivo: (v, iof) => {
            if (mkt.classof(iof) == "String") {
                let vProcessado = mkt.removeEspecias(v).toLowerCase().trim();
                let exFiltrado = mkt.getThis(Number(iof)).exclusivos?.filter((f) => {
                    return mkt.removeEspecias(f).toLowerCase().trim().includes(vProcessado);
                });
                let muitosExclusivos = false;
                if (exFiltrado) {
                    if (exFiltrado.length > 100) {
                        muitosExclusivos = true;
                    }
                }
                else {
                    exFiltrado = [];
                }
                ;
                if (mkt.getThis(Number(iof)).hmunsel.length <= 0) {
                    mkt.Q("body .mkHeadMenu .possibilidades").classList.remove("st");
                }
                let htmlPossiveis = "<ul class='filtravel'>";
                if (exFiltrado.length > 0) {
                    let fullsel = "sel";
                    if (mkt.Q("body .mkHeadMenu .possibilidades").classList.contains("st")) {
                        fullsel = "";
                    }
                    htmlPossiveis += "<li class='hmMarcarExclusivos nosel botao " + fullsel + "' id='headMenuTodos'>" + mkt.a.SVGINI + mkt.a.svgSquare + mkt.a.SVGFIM + mkt.a.espaco + "Selecionar Todos (" + exFiltrado.length + ")";
                    if (v != "") {
                        htmlPossiveis += " Pesquisados";
                    }
                    htmlPossiveis += "</li>";
                    exFiltrado.forEach((v) => {
                        let sel = "sel";
                        let v2 = mkt.removeEspecias(v).toLowerCase().trim();
                        mkt.getThis(Number(iof)).hmunsel.forEach((hm) => {
                            if (mkt.removeEspecias(hm).toLowerCase().trim() == v2) {
                                sel = "";
                            }
                        });
                        let vOut = v;
                        if (new RegExp(mkt.a.util.data[1]).test(vOut)) {
                            vOut = mkt.dataToLocale(vOut);
                        }
                        else if (new RegExp(mkt.a.util.dataIso8601[1]).test(vOut)) {
                            vOut = mkt.dataToLocale(vOut);
                        }
                        vOut = vOut.toString();
                        if (vOut.length > 40) {
                            vOut = vOut.slice(0, 37) + "...";
                        }
                        htmlPossiveis += "<li name='" + mkt.removerAspas(v2) + "' class='hmMarcarExclusivos nosel botao " + sel + "'>" + mkt.a.SVGINI + mkt.a.svgSquare + mkt.a.SVGFIM + mkt.a.espaco + vOut + "</li>";
                    });
                }
                htmlPossiveis += "</ul>";
                mkt.Q("body .mkHeadMenu .possibilidades").innerHTML = htmlPossiveis;
                mkt.Ao("click", ".mkHeadMenu .hmMarcarExclusivos", (e) => {
                    let eHmenu = mkt.Q("body .mkHeadMenu");
                    if (e?.id == "headMenuTodos") {
                        e = null;
                    }
                    mkt.hm.MarcarExclusivos(e, eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
                });
            }
            else {
                mkt.w("mkt.hm.FiltraExclusivo() - Parametros precisam ser string: ", v, iof);
            }
        },
        MarcarExclusivos: (e, colName, iof) => {
            if (mkt.classof(iof) == "String") {
                let este = mkt.getThis(Number(iof));
                if (e) {
                    let name = e.getAttribute("name");
                    if (name) {
                        if (este.hmunsel.includes(name)) {
                            e.classList.add("sel");
                            if (name != null) {
                                este.hmunsel.splice(este.hmunsel.indexOf(name), 1);
                                if (este.hmunsel.length == 0) {
                                    mkt.Q("#headMenuTodos").classList.add("sel");
                                    mkt.Q("body .mkHeadMenu .possibilidades").classList.toggle("st");
                                }
                            }
                        }
                        else {
                            e.classList.remove("sel");
                            if (name != null) {
                                este.hmunsel.push(name);
                                if (este.hmunsel.length == este.exclusivos.length) {
                                    mkt.Q("#headMenuTodos").classList.remove("sel");
                                    mkt.Q("body .mkHeadMenu .possibilidades").classList.toggle("st");
                                }
                            }
                        }
                    }
                    else {
                        mkt.w("mkt.hm.MarcarExclusivos() - Atributo NAME não encontrado em: ", e);
                    }
                }
                else {
                    mkt.Q("body .mkHeadMenu .possibilidades").classList.toggle("st");
                    if (mkt.Q("body .mkHeadMenu .possibilidades").classList.contains("st")) {
                        mkt.QAll(".mkHeadMenu .possibilidades li").forEach((el) => {
                            let name = el.getAttribute("name");
                            el.classList.remove("sel");
                            if (name != null) {
                                if (!este.hmunsel.includes(name)) {
                                    este.hmunsel.push(name);
                                }
                            }
                        });
                    }
                    else {
                        mkt.QAll(".mkHeadMenu .possibilidades li").forEach((el) => {
                            let name = el.getAttribute("name");
                            el.classList.add("sel");
                            if (name != null) {
                                este.hmunsel.splice(este.hmunsel.indexOf(name), 1);
                            }
                        });
                    }
                }
                este.c.objFiltro[colName] = {
                    formato: "mkHeadMenuSel",
                    operador: "",
                    conteudo: este.hmunsel,
                };
                este.atualizaNaPaginaUm();
                mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
            }
            else {
                mkt.w("mkt.hm.MarcarExclusivos() - Parametros colName, iof precisam ser string: ", colName, iof);
            }
        },
        HideX: Function,
    };
    static CarregarON = (nomeDoRequest = "") => {
        if (!mkt.Q("body .CarregadorMkBlock")) {
            let divCarregadorMkBlock = document.createElement("div");
            divCarregadorMkBlock.className = "CarregadorMkBlock";
            let divCarregadormkt = document.createElement("div");
            divCarregadormkt.className = "CarregadorMk";
            let buttonCarregadorMkTopoDireito = document.createElement("button");
            buttonCarregadorMkTopoDireito.className = "CarregadorMkTopoDireito";
            buttonCarregadorMkTopoDireito.setAttribute("type", "button");
            buttonCarregadorMkTopoDireito.setAttribute("onClick", "mkt.CarregarOFF()");
            buttonCarregadorMkTopoDireito.innerHTML =
                `${mkt.a.SVGINI}<path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z'/>${mkt.a.SVGFIM}`;
            divCarregadorMkBlock.appendChild(divCarregadormkt);
            divCarregadorMkBlock.appendChild(buttonCarregadorMkTopoDireito);
            document.body.appendChild(divCarregadorMkBlock);
        }
        mkt.Q("body .CarregadorMkBlock").classList.remove("oculto");
        mkt.Q("body").classList.add("CarregadorMkSemScrollY");
    };
    static CarregarOFF = (nomeDoRequest = "") => {
        if (mkt.Q("body .CarregadorMkBlock") != null) {
            mkt.Q("body .CarregadorMkBlock").classList.add("oculto");
        }
        mkt.Q("body").classList.remove("CarregadorMkSemScrollY");
    };
    static CarregarHtml = (estilo = "", classe = "relative") => {
        return `<div class="CarregadorMk ${classe}" style="${estilo}"></div>`;
    };
    static detectedServerOff = (mensagem = "Servidor OFF-LINE") => {
        let divOfflineBlock = null;
        if (mkt.Q("body .offlineBlock") == null) {
            divOfflineBlock = document.createElement("div");
            divOfflineBlock.className = "offlineBlock";
            let divOfflineBlockInterna = document.createElement("div");
            divOfflineBlockInterna.className = "text-center";
            divOfflineBlockInterna.innerHTML = mensagem;
            let buttonOfflineBlock = document.createElement("button");
            buttonOfflineBlock.setAttribute("type", "button");
            buttonOfflineBlock.setAttribute("onClick", "mkt.detectedServerOn()");
            buttonOfflineBlock.innerHTML =
                `${mkt.a.SVGINI}<path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z'/>${mkt.a.SVGFIM}`;
            divOfflineBlock.appendChild(divOfflineBlockInterna);
            divOfflineBlock.appendChild(buttonOfflineBlock);
            document.body.appendChild(divOfflineBlock);
        }
        mkt.Q("body .offlineBlock").classList.remove("oculto");
        mkt.Q("body").classList.add("CarregadorMkSemScrollY");
        return divOfflineBlock;
    };
    static detectedServerOn = () => {
        mkt.Q("body .offlineBlock")?.classList?.add("oculto");
        mkt.Q("body").classList.remove("CarregadorMkSemScrollY");
    };
    static importar = async (tagBuscar = ".divListagemContainer", tipo = "race", quiet = true) => {
        return new Promise((r, x) => {
            let num = mkt.a.contaImportados++;
            if (!quiet) {
                mkt.gc("\t(" + num + ") Executando Importador no modo: ", tipo);
            }
            let ps = [];
            mkt.QAll(tagBuscar + " *").forEach((e) => {
                let destino = e.getAttribute("mkImportar");
                if (destino != null) {
                    ps.push({ p: mkt.get.html({ url: destino, quiet: quiet, carregador: false }), e: e, n: num });
                }
            });
            if (!quiet) {
                mkt.l(ps);
                mkt.ge();
            }
            Promise[tipo](ps.map((x) => { return x.p; })).then((ret) => {
                ps.forEach(async (o) => {
                    let re = await o.p;
                    if (re.retorno != null) {
                        o.e.removeAttribute("mkImportar");
                        o.e.innerHTML = re.retorno;
                        try {
                            mkt.nodeToScript(o.e);
                        }
                        catch (error) {
                            mkt.gc("Auto Import por TAG lancou erros:");
                            mkt.erro("ERRO: ", error);
                            mkt.ge();
                        }
                    }
                    else {
                        x(false);
                        mkt.l("Falhou ao coletar dados");
                    }
                });
                r(true);
            });
        });
    };
    static post = {
        json: async (config, json) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mkt.a.POST;
            config.tipo = mkt.a.JSON;
            config.dados = json;
            let retorno = await mkt.request(config);
            return retorno;
        },
        html: async (config, text) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mkt.a.POST;
            config.tipo = mkt.a.HTML;
            config.dados = text;
            let retorno = await mkt.request(config);
            return retorno;
        },
        form: async (config, formdata) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mkt.a.POST;
            config.tipo = mkt.a.FORMDATA;
            config.dados = formdata;
            let retorno = await mkt.request(config);
            return retorno;
        }
    };
    static get = {
        json: async (config) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mkt.a.GET;
            config.tipo = mkt.a.JSON;
            return await mkt.request(config);
        },
        html: async (config) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mkt.a.GET;
            config.tipo = mkt.a.HTML;
            let retorno = await mkt.request(config);
            return retorno;
        },
        blob: async (config) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mkt.a.GET;
            config.tipo = mkt.a.ALL;
            let retorno = await mkt.request(config);
            return retorno;
        }
    };
    static request = async (config) => {
        if (typeof config != "object") {
            mkt.w("É necessário informar o objeto de configuração com a URL.");
            return { url: null, retorno: null };
        }
        if (!config?.url) {
            mkt.w("Necessário informar uma URL nos requests.");
            return { url: config?.url, retorno: null };
        }
        if (!config?.metodo) {
            mkt.w("Nenhum método informado. Avançando com GET");
            config.metodo = "GET";
        }
        else {
            if (config.metodo == "POST" && config.dados == null) {
                mkt.w("Método POST, mas SEM DADOS informados. Enviando string vazia ''.");
                config.dados = "";
            }
        }
        let nomeRequest = config.metodo + ": " + config.url;
        mkt.ct("Request: " + nomeRequest);
        if (!config?.tipo) {
            mkt.w("Nenhum tipo de dado informado. Avançando com " + mkt.a.JSON);
            config.tipo = mkt.a.JSON;
        }
        if (!config?.headers) {
            config.headers = new Headers();
            if (config.tipo == mkt.a.JSON) {
                config.headers.append("Content-Type", config.tipo);
            }
            let aft = mkt.Q("input[name='__RequestVerificationToken']")?.value;
            config.headers.append("MKANTI-FORGERY-TOKEN", aft || "");
        }
        if (!config.quiet)
            config.quiet = false;
        if (!config.colorConteudo)
            config.colorConteudo = "#ACF";
        if (!config.colorRequest)
            config.colorRequest = "#777";
        if (!config.colorType)
            config.colorType = "#777";
        if (!config.colorStatusCode)
            config.colorStatusCode = "#777";
        if (!config.url.includes("://")) {
            if (config.url.charAt(0) == ".") {
                config.url = window.location.href + config.url;
            }
            else if (config.url.charAt(0) == "/") {
                config.url = window.location.origin + config.url;
            }
        }
        config._url = new URL(config.url);
        config.json = mkt.stringify(config.dados);
        if (config.metodo != mkt.a.GET) {
            if (config.tipo == mkt.a.JSON) {
                config.body = config.json;
            }
            else if (config.tipo == mkt.a.FORMDATA) {
                config.body = config.dados;
            }
        }
        if (!config.quiet) {
            mkt.gc(`%c${config.metodo}: ${config._url.pathname}`, `color:${config.colorRequest}`);
            mkt.l(`${config._url.origin}${config._url.pathname}%c${config._url.search}`, "color:yellow;");
            if (config.dev) {
                mkt.l("Header: ", Object.fromEntries(config.headers.entries()));
                mkt.l("Config: ", config);
            }
            if (config.metodo == mkt.a.POST) {
                mkt.l("DADOS: ", config.dados);
                mkt.gc("JSON: ");
                mkt.l(config.json);
                mkt.ge();
                if (typeof config.dados == "object") {
                    if (config.dados.entries != null) {
                        mkt.gc("FORM OBJECT");
                        mkt.l(Object.fromEntries(config.dados.entries()));
                        mkt.ge();
                    }
                }
            }
            mkt.ge();
        }
        if (config.carregador) {
            mkt.CarregarON(nomeRequest);
        }
        config.retorno = null;
        config.statusCode = "SEM CONEXÃO";
        try {
            config.pacote = await fetch(config.url, {
                method: config.metodo,
                headers: config.headers,
                body: config.body,
            });
            if (!config.pacote.ok) {
                config.conectou = false;
                config.statusCode = config.pacote.status;
                config.erros = await config.pacote.text();
                mkt.gc(`HTTP RETURNO: ${config.pacote.status} ${config.pacote.statusText}`);
                mkt.l(config.erros);
                mkt.ge();
                if (config.pacote.status >= 300) {
                    if (!localStorage.mktRequests) {
                        localStorage.mktRequests = mkt.stringify([]);
                    }
                    let erros = JSON.parse(localStorage.mktRequests);
                    erros.push({
                        quando: mkt.dataGetFullToday(),
                        status: config.pacote.status,
                        texto: config.erros,
                        url: config.url,
                    });
                    if (erros.length > 10) {
                        erros.shift(1);
                    }
                    localStorage.mktRequests = mkt.stringify(erros);
                }
            }
            else {
                config.conectou = true;
                config.statusCode = config.pacote.status;
                if (config.statusCode != 204) {
                    if (config.tipo == mkt.a.JSON) {
                        config.retorno = await config.pacote.json();
                    }
                    else if (config.tipo == mkt.a.HTML) {
                        config.retorno = await config.pacote.text();
                    }
                    else if (config.tipo == mkt.a.ALL) {
                        config.retorno = await config.pacote.blob();
                    }
                    else if (config.tipo == mkt.a.FORMDATA) {
                        config.retorno = await config.pacote.json();
                    }
                }
                if (!config.quiet) {
                    let tam = config.retorno?.length;
                    if (!tam) {
                        tam = "";
                    }
                    else {
                        tam = "[" + tam + "] ";
                    }
                    let tipo = "";
                    if (config.tipo.includes("json")) {
                        tipo = "JSON";
                    }
                    else if (config.tipo.includes("html")) {
                        tipo = "HTML";
                    }
                    if (config.pacote.status == "200" && tipo == "JSON") {
                        if (!config.colorResponseOK)
                            config.colorResponseOK = "#0F0";
                    }
                    else {
                        config.colorResponseOK = config.colorRequest;
                    }
                    mkt.gc(`%cRetorno %c${config.pacote.status} %c(${config.metodo}) %c${tipo} %c${tam} ${config._url.pathname}`, `color:${config.colorResponseOK}`, `color:${config.colorStatusCode}`, `color:${config.colorRequest}`, `color:${config.colorType}`, `color:${config.colorConteudo}`);
                }
                mkt.cte("Request: " + nomeRequest, config);
                if (!config.quiet) {
                    mkt.l(config.retorno);
                    mkt.ge();
                }
                if (config.done) {
                    config.done(config);
                }
            }
        }
        catch (error) {
            config.conectou = false;
            config.catch = error;
        }
        if (!config.conectou) {
            mkt.gc("(" + config.statusCode + ") HTTP ERRO:");
            if (config.catch && !config.quiet) {
                mkt.l("Config: ", config);
                mkt.erro("Erro: ", config.catch);
            }
            if (config.error) {
                config.error(config);
            }
            mkt.ge();
        }
        if (config.carregador) {
            mkt.CarregarOFF(nomeRequest);
        }
        return config;
    };
    static mkConfirma = async (texto = "Você tem certeza?", p = null) => {
        let possiveisBotoes = ["bCinza", "bVermelho", "bVerde"];
        let corSim = "bVerde";
        if (p?.corSim != undefined)
            corSim = p.corSim;
        let corNao = "bCinza";
        if (p?.corNao != undefined)
            corNao = p.corNao;
        let emSim = "Sim";
        if (p?.emSim != undefined)
            emSim = p.emSim;
        let emNao = "N&#227;o";
        if (p?.emNao != undefined)
            emNao = p.emNao;
        let fnFora = () => { return mkt.w("Selecione apenas as opções da tela."); };
        if (p?.fnFora != undefined)
            fnFora = p.fnFora;
        let classContainer = "";
        if (p?.classContainer != undefined)
            classContainer = p.classContainer;
        return new Promise((r) => {
            function verficiarResposta() {
                let resposta = null;
                if (mkt.Q(".mkConfirmadorBloco .mkConfirmadorArea .bBotao.icoSim.true"))
                    resposta = true;
                if (mkt.Q(".mkConfirmadorBloco .mkConfirmadorArea .bBotao.icoNao.true"))
                    resposta = false;
                if (resposta !== null) {
                    mkt.Q(".mkConfirmadorBloco .icoSim").classList.remove("true");
                    mkt.Q(".mkConfirmadorBloco .icoNao").classList.remove("true");
                    mkt.Q(".mkConfirmadorBloco").classList.add("oculto");
                    retornar(resposta);
                }
            }
            if (!document.querySelector(".mkConfirmadorBloco")) {
                let divMkConfirmarBloco = document.createElement("div");
                let divMkConfirmarFora = document.createElement("div");
                let divMkConfirmarArea = document.createElement("div");
                let divMkConfirmarTitulo = document.createElement("div");
                let divMkConfirmarTexto = document.createElement("div");
                let divMkConfirmarBotoes = document.createElement("div");
                let divMkConfirmarSim = document.createElement("button");
                let divMkConfirmarNao = document.createElement("button");
                divMkConfirmarBloco.className = "mkConfirmadorBloco microPos5";
                divMkConfirmarFora.className = "mkConfirmadorFora";
                divMkConfirmarArea.className =
                    "mkConfirmadorArea microPos5 tb fsb " + classContainer;
                divMkConfirmarTitulo.className = "mkConfirmadorTitulo";
                divMkConfirmarTexto.className = "mkConfirmadorTexto";
                divMkConfirmarBotoes.className = "mkConfirmadorBotoes fsb";
                divMkConfirmarSim.className = "bBotao icoSim " + corSim;
                divMkConfirmarNao.className = "bBotao icoNao " + corNao;
                divMkConfirmarTitulo.innerHTML =
                    "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z'/></svg><span>Confirmação</span>";
                divMkConfirmarTexto.innerHTML = texto;
                divMkConfirmarSim.innerHTML = emSim;
                divMkConfirmarNao.innerHTML = emNao;
                divMkConfirmarFora.setAttribute("onclick", "mkt.mkConfirmaFuncaoFora()");
                divMkConfirmarSim.setAttribute("onclick", "this.classList.add(true);");
                divMkConfirmarNao.setAttribute("onclick", "this.classList.add(true);");
                mkt.Q("body").appendChild(divMkConfirmarBloco);
                divMkConfirmarBloco.appendChild(divMkConfirmarFora);
                divMkConfirmarBloco.appendChild(divMkConfirmarArea);
                divMkConfirmarArea.appendChild(divMkConfirmarTitulo);
                divMkConfirmarArea.appendChild(divMkConfirmarTexto);
                divMkConfirmarArea.appendChild(divMkConfirmarBotoes);
                divMkConfirmarBotoes.appendChild(divMkConfirmarSim);
                divMkConfirmarBotoes.appendChild(divMkConfirmarNao);
            }
            else {
                possiveisBotoes.forEach((s) => {
                    mkt.QAll(".mkConfirmadorBloco .bBotao").forEach((botao) => {
                        botao.classList.remove(s);
                    });
                });
                mkt.Q(".mkConfirmadorBloco .bBotao.icoSim").classList.add(corSim);
                mkt.Q(".mkConfirmadorBloco .bBotao.icoNao").classList.add(corNao);
                mkt.Q(".mkConfirmadorBloco").classList.remove("oculto");
                mkt.Q(".mkConfirmadorTexto").innerHTML = texto;
            }
            const checkResposta = setInterval(verficiarResposta, 100);
            function retornar(resultado = false) {
                clearInterval(checkResposta);
                return r(resultado);
            }
        });
    };
    static getCountry = () => {
        return Intl.DateTimeFormat().resolvedOptions().locale.toUpperCase().slice(3);
    };
    static numToDisplay = (num, c = {}) => {
        if (c.casas == null)
            c.casas = 2;
        if (c.mincasas == null)
            c.mincasas = c.casas;
        if (c.maxcasas == null)
            c.maxcasas = c.casas;
        if (c.milhar == null)
            c.milhar = false;
        if (c.locale == null)
            c.locale = "pt-BR";
        let opcoes = {
            minimumFractionDigits: c.mincasas,
            maximumFractionDigits: c.maxcasas,
            useGrouping: c.milhar,
        };
        if (mkt.classof(num) != "Number") {
            return mkt.toNumber(num, c).toLocaleString(c.locale, opcoes);
        }
        return num.toLocaleString(c.locale, opcoes);
    };
    static toMoeda = (valor) => {
        if (valor != null) {
            if (mkt.classof(valor) == "Number") {
                valor = valor.toFixed(2);
            }
            let d = [...valor.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a); }).join("").padStart(3, "0");
            return new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(Number(d.slice(0, -2) + "." + d.slice(-2)));
        }
        return "";
    };
    static fromMoeda = (texto) => {
        if (texto) {
            let d = [...texto.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a); }).join("").padStart(3, "0");
            return Number(d.slice(0, -2) + "." + d.slice(-2));
        }
        return 0;
    };
    static toNumber = (valor, c = {}) => {
        if (c.casas == null)
            c.casas = 2;
        if (valor != null) {
            if (mkt.classof(valor) == "String") {
                let us = [".", ","].reduce((x, y) => (valor.lastIndexOf(x) > valor.lastIndexOf(y)) ? x : y);
                let posPonto = valor.lastIndexOf(us);
                if (posPonto >= 0) {
                    let i = valor.slice(0, posPonto);
                    let d = valor.slice(posPonto + 1).slice(0, 2).padEnd(2, "0");
                    i = [...i.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a); }).join("");
                    d = [...d.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a); }).join("");
                    valor = i + "." + d;
                }
                else {
                    valor = [...valor.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a); }).join("").padStart(3, "0");
                    valor = valor.slice(0, -(c.casas)) + "." + valor.slice(-(c.casas));
                }
            }
            else if (mkt.classof(valor) == "Number") {
                valor = valor.toFixed(c.casas);
            }
            else {
                mkt.w("toNumber() - Formato de entrada não implementado: ", mkt.classof(valor));
            }
            return Number(valor);
        }
        return 0;
    };
    static numMedia = (menor, maior) => {
        return mkt.numToDisplay((mkt.toNumber(menor) + mkt.toNumber(maior)) / 2);
    };
    static dataGetDia = (ms = null) => {
        if (ms != null)
            return Number(mkt.dataGetData(ms).split("-")[2]);
        else
            return Number(mkt.dataGetData().split("-")[2]);
    };
    static dataGetMes = (ms = null) => {
        if (ms != null)
            return Number(mkt.dataGetData(ms).split("-")[1]);
        else
            return Number(mkt.dataGetData().split("-")[1]);
    };
    static dataGetAno = (ms = null) => {
        if (ms != null)
            return Number(mkt.dataGetData(ms).split("-")[0]);
        else
            return Number(mkt.dataGetData().split("-")[0]);
    };
    static dataGetData = (ms = null) => {
        let ano = new Date().getUTCFullYear();
        let mes = new Date().getUTCMonth() + 1;
        let dia = new Date().getUTCDate();
        if (ms != null) {
            ano = new Date(ms).getUTCFullYear();
            mes = new Date(ms).getUTCMonth() + 1;
            dia = new Date(ms).getUTCDate();
        }
        return ano.toString().padStart(4, "0") + "-" + mes.toString().padStart(2, "0") + "-" + dia.toString().padStart(2, "0");
    };
    static dataGetDataToday = () => {
        return new Date(mkt.dataGetMs()).toLocaleDateString();
    };
    static dataGetHoraToday = () => {
        return new Date(Number(mkt.dataGetMs())).toLocaleTimeString();
    };
    static dataGetFullToday = () => {
        return mkt.dataGetDataToday() + " " + mkt.dataGetHoraToday();
    };
    static dataToBRData = (data) => {
        let arrayData = data.split("-");
        let stringRetorno = "";
        if (arrayData.length >= 3) {
            stringRetorno = arrayData[2] + "/" + arrayData[1] + "/" + arrayData[0];
        }
        else {
            stringRetorno = data;
        }
        return stringRetorno;
    };
    static dataToIsoData = (data) => {
        let dataDDMMYYYY = new RegExp("^[0-3][0-9][/][0-1][0-9][/][0-2][0-9]{3}$");
        let stringRetorno = data;
        if (dataDDMMYYYY.test(data)) {
            let arrayData = data.split("/");
            if (arrayData.length >= 3) {
                stringRetorno = arrayData[2] + "-" + arrayData[1] + "-" + arrayData[0];
            }
            else {
                stringRetorno = data;
            }
        }
        return stringRetorno;
    };
    static isData = (i) => {
        return new RegExp(mkt.a.util.data[1]).test(i);
    };
    static dataFormatarSOA = (soa, reverse = false) => {
        function dataFormatarS_Execute(s, rev = false) {
            if (rev) {
                s = mkt.dataToIsoData(s);
            }
            else {
                let busca = new RegExp("^[0-2][0-9]{3}[-][0-1][0-9][-][0-3][0-9]$");
                let busca2 = new RegExp("^[0-2][0-9]{3}[-][0-1][0-9][-][0-3][0-9][T| ][0-2][0-9]:[0-5][0-9]");
                if (busca2.test(s)) {
                    s = mkt.dataToLocale(s).replaceAll(",", "");
                }
                else if (busca.test(s)) {
                    s = mkt.dataToBRData(s);
                }
            }
            return s;
        }
        function dataFormatarO_Execute(o) {
            for (var propName in o) {
                if (mkt.classof(o[propName]) == "String") {
                    o[propName] = dataFormatarS_Execute(o[propName], reverse);
                }
            }
            return o;
        }
        let tipo = mkt.classof(soa);
        if (tipo == "Object" || tipo == "Array") {
            return mkt.aCadaObjExecuta(soa, dataFormatarO_Execute);
        }
        else if (tipo == "String") {
            return dataFormatarS_Execute(soa, reverse);
        }
        return soa;
    };
    static masterFormatarSOA = (soa) => {
        return mkt.dataFormatarSOA(mkt.limparOA(soa));
    };
    static dataToLocale = (data) => {
        let dataNum = Number(data);
        if (mkt.classof(dataNum) != "Number") {
            dataNum = data;
        }
        if (mkt.classof(data) == "Date") {
            return data.toLocaleString();
        }
        return new Date(dataNum).toLocaleString();
    };
    static dataGetSegundosDiferenca = (msOld, msNew = null) => {
        if (msNew == null)
            msNew = mkt.dataGetMs();
        return mkt.dataMsToSegundos(msNew - msOld);
    };
    static dataGetDiasDiferenca = (msOld, msNew = null) => {
        if (msNew == null)
            msNew = mkt.dataGetMs();
        return mkt.dataMsToDias(msNew - msOld);
    };
    static dataGetTempoDiferenca = (msOld, msNew = null) => {
        let dias = mkt.dataGetDiasDiferenca(msOld, msNew);
        if (dias < 0) {
            dias = dias * -1;
        }
        let strTempo = "";
        if (dias > 29) {
            if (dias < 60) {
                strTempo = "1 mês";
            }
            else {
                if (dias > 365) {
                    let anos = Math.floor(dias / 365);
                    let diasRestoAno = dias % 365;
                    if (anos < 2) {
                        strTempo += anos + " ano ";
                    }
                    else {
                        strTempo += anos + " anos ";
                    }
                    if (diasRestoAno > 30) {
                        if (diasRestoAno < 60) {
                            strTempo += "1 mês";
                        }
                        else {
                            strTempo += Math.floor(diasRestoAno / 30) + " meses";
                        }
                    }
                }
                else {
                    strTempo = Math.floor(dias / 30) + " meses";
                }
            }
        }
        else {
            if (dias < 1) {
                let segundos = mkt.dataGetSegundosDiferenca(msOld, msNew);
                if (segundos > 7199) {
                    strTempo = Math.floor(segundos / 3600) + " horas";
                }
                else {
                    if (segundos > 3599) {
                        strTempo = "1 hora";
                    }
                    else {
                        if (segundos > 119) {
                            strTempo = Math.floor(segundos / 60) + " minutos";
                        }
                        else {
                            if (segundos > 59) {
                                strTempo = "1 minuto";
                            }
                            else {
                                strTempo = Math.floor(segundos) + " segundos";
                            }
                        }
                    }
                }
            }
            else {
                strTempo = dias + " dias";
            }
        }
        return strTempo;
    };
    static dataGetMs = (data = null) => {
        if (data != null) {
            if (data.length > 10) {
                return new Date(data).getTime();
            }
            else {
                let dataCortada = data.split("-");
                let oDia = Number(dataCortada[2]);
                let oMes = Number(dataCortada[1]) - 1;
                let oAno = Number(dataCortada[0]);
                return new Date(oAno, oMes, oDia).getTime();
            }
        }
        else
            return new Date().getTime();
    };
    static dataMsToSegundos = (num, reverse = false) => {
        if (reverse) {
            return num * 1000;
        }
        return Math.trunc(num / 1000);
    };
    static dataMsToMinutos = (num, reverse = false) => {
        if (reverse) {
            return num * 60000;
        }
        return Math.trunc(num / 60000);
    };
    static dataMsToHoras = (num, reverse = false) => {
        if (reverse) {
            return num * 3600000;
        }
        return Math.trunc(num / 3600000);
    };
    static dataMsToDias = (num, reverse = false) => {
        if (reverse) {
            return Math.trunc(num * 86400000);
        }
        return Math.trunc(num / 86400000);
    };
    static mkRecChange = (recItem, texto) => {
        let e = recItem?.parentElement?.previousElementSibling;
        if (e) {
            e.value = texto;
            mkt.wait(10).then(r => {
                mkt.mkRecUpdate(e);
                e.focus();
            });
        }
        else {
            mkt.w("Não foi possível alterar o elemento: ", e);
        }
    };
    static mkRecFoco = (input, f) => {
        let eList = input?.nextElementSibling;
        if (eList) {
            if (!f) {
                eList.classList.add("emFoco");
            }
            else {
                eList.classList.remove("emFoco");
            }
        }
        else {
            mkt.w("Não foi possível alterar o elemento: ", eList);
        }
        mkt.Reposicionar(eList, false);
    };
    static mkRecRenderizar = async () => {
        mkt.QAll("input.mkRec").forEach(async (e) => {
            if (!e.nextElementSibling?.classList.contains("mkRecList")) {
                let ePai = e.parentElement;
                let ePos = Array.from(ePai?.children).indexOf(e);
                let divMkRecList = document.createElement("div");
                divMkRecList.className = "mkRecList emFoco";
                divMkRecList.setAttribute("tabindex", "-1");
                ePai?.insertBefore(divMkRecList, ePai?.children[ePos + 1]);
                let oninput = e.getAttribute("oninput");
                if (!oninput || !oninput.includes(";mkt.mkRecUpdate(this)")) {
                    e.setAttribute("oninput", oninput + ";mkt.mkRecUpdate(this)");
                }
                let onfocus = e.getAttribute("onfocus");
                if (!onfocus || !onfocus.includes(";mkt.mkRecFoco(this,true)")) {
                    e.setAttribute("onfocus", onfocus + ";mkt.mkRecFoco(this,true)");
                }
                let onblur = e.getAttribute("onblur");
                if (!onblur || !onblur.includes(";mkt.mkRecFoco(this,false)")) {
                    e.setAttribute("onblur", onblur + ";mkt.mkRecFoco(this,false)");
                }
                e.setAttribute("autocomplete", "off");
                document.addEventListener("scroll", (event) => {
                    mkt.Reposicionar(divMkRecList, false);
                });
                window.addEventListener("resize", (event) => {
                    mkt.Reposicionar(divMkRecList, true);
                });
                mkt.mkRecUpdate(e);
            }
            else {
                if (!e.getAttribute("data-selarray") && e.getAttribute("data-refill")) {
                }
                let geraEvento = false;
                if (e.classList.contains("atualizar"))
                    geraEvento = true;
                if (e.classList.contains("atualizar") || e.classList.contains("atualizarSemEvento")) {
                    e.classList.remove("atualizar");
                    e.classList.remove("atualizarSemEvento");
                    e.classList.add("atualizando");
                    mkt.mkRecUpdate(e);
                    e.classList.remove("atualizando");
                }
                if (geraEvento) {
                    e.dispatchEvent(new Event("input"));
                    e.dispatchEvent(new Event("change"));
                }
            }
        });
    };
    static mkRecUpdate = (e) => {
        if (e?.getAttribute("data-selarray") != "") {
            let eList = e.nextElementSibling;
            let array = e.dataset.selarray;
            eList.innerHTML = "";
            if (mkt.isJson(array)) {
                let kvList = mkt.parseJSON(array);
                let c = 0;
                kvList.forEach((o) => {
                    if (o.v != null && o.v != "") {
                        if (mkt.like(e.value, o.v) && e.value.trim() != o.v.trim()) {
                            c++;
                            let item = document.createElement("div");
                            let itemTexto = document.createElement("span");
                            item.className = "recItem";
                            item.setAttribute("data-k", o.k);
                            item.setAttribute("onmousedown", "mkt.mkRecChange(this,'" + o.v + "')");
                            itemTexto.innerHTML = o.v;
                            item.appendChild(itemTexto);
                            eList.appendChild(item);
                        }
                    }
                });
                if (c <= 0) {
                    eList.innerHTML = "Sem recomendações";
                }
            }
            else {
                mkt.w("mkRecUpdate(e):  atributo selarray Não é um JSON válido: ", array);
            }
        }
        else {
            mkt.w("mkRecUpdate(e): Elemento não encontrado ou selarray dele está vazia.", e);
        }
    };
    static regras = [];
    static regraExe = async (e, tipoEvento = "blur", ev = null) => {
        return new Promise((resolver) => {
            let tempRegras = [];
            mkt.regras.forEach((r) => {
                if (mkt.isInsideDom(r.e)) {
                    tempRegras.push(r);
                }
                ;
            });
            mkt.regras = tempRegras;
            let erros = [];
            let regrasDoE = mkt.regras.find((o) => o.e == e);
            let eDisplay = regrasDoE?.c.querySelector(".mkRegrar[data-valmsg-for='" + regrasDoE.n + "']");
            let regras = regrasDoE?.r;
            let promises = [];
            if (regras) {
                regras.forEach((re) => {
                    if (!re.target) {
                        re.target = "value";
                    }
                    if (re.on == null) {
                        re.on = true;
                    }
                    if (re.vazio == null) {
                        re.vazio = false;
                    }
                    if (re.quiet == null) {
                        re.quiet = true;
                    }
                    let podeValidar = re.on;
                    if (!mkt.isVisible(e)) {
                        podeValidar = false;
                    }
                    if (e.classList.contains("disabled")) {
                        podeValidar = false;
                    }
                    if (re.vazio == true && e[re.target] == "") {
                        podeValidar = false;
                    }
                    if (podeValidar || re.f) {
                        promises.push(new Promise((prom) => {
                            re.e = e;
                            let regraK = re.k?.toLowerCase();
                            switch (regraK) {
                                case "mascarar":
                                    if (e[re.target]) {
                                        let mascarado = mkt.mascarar(e[re.target], re.v);
                                        if (mascarado != null)
                                            e[re.target] = mascarado;
                                    }
                                    prom(re.k);
                                    break;
                                case "moeda":
                                    if (e[re.target]) {
                                        e[re.target] = mkt.toMoeda(e[re.target]);
                                    }
                                    prom(re.k);
                                    break;
                                case "numero":
                                    if (!(new RegExp(mkt.a.util.numerosvirgula[1]).test(e[re.target]))) {
                                        if (!re.m)
                                            re.m = mkt.a.msg.apenasnumerosvirgula;
                                        erros.push(re);
                                        e[re.target] = e[re.target].replaceAll(/((?![0-9,]).)/g, "");
                                    }
                                    if (tipoEvento == "blur") {
                                        let valor = e[re.target];
                                        let posPonto = valor.lastIndexOf([".", ","].reduce((x, y) => (valor.lastIndexOf(x) > valor.lastIndexOf(y)) ? x : y));
                                        if (posPonto >= 0) {
                                            e[re.target] = Number(mkt.apenasNumeros(valor.slice(0, posPonto)) + "." + mkt.apenasNumeros(valor.slice(posPonto + 1))).toString().replaceAll(".", ",");
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "charproibido":
                                    for (let c of re.v) {
                                        if (e[re.target].includes(c)) {
                                            if (!re.m)
                                                re.m = mkt.a.msg.charproibido + c;
                                            erros.push(re);
                                            e[re.target] = e[re.target].replaceAll(c, "");
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "apenasnumeros":
                                    if (!(new RegExp(mkt.a.util.numeros[1]).test(e[re.target]))) {
                                        if (!re.m)
                                            re.m = mkt.a.msg.apenasnumeros;
                                        erros.push(re);
                                        e[re.target] = e[re.target].replaceAll(/((?![0-9]).)/g, "");
                                    }
                                    prom(re.k);
                                    break;
                                case "apenasletras":
                                    if (!(new RegExp(mkt.a.util.letras[1]).test(e[re.target]))) {
                                        if (!re.m)
                                            re.m = mkt.a.msg.apenasletras;
                                        erros.push(re);
                                        e[re.target] = e[re.target].replaceAll(/((?![a-zA-Z]).)/g, "");
                                    }
                                    prom(re.k);
                                    break;
                                case "maxchars":
                                    e.setAttribute("maxlength", re.v);
                                    if (e[re.target].length > Number(re.v)) {
                                        if (!re.m)
                                            re.m = mkt.a.msg.maxc;
                                        erros.push(re);
                                        e[re.target] = e[re.target].slice(0, Number(re.v));
                                    }
                                    prom(re.k);
                                    break;
                                case "minchars":
                                    e.setAttribute("minlength", re.v);
                                    if (e[re.target].length < Number(re.v)) {
                                        if (!re.m)
                                            re.m = mkt.a.msg.minc + re.v;
                                        erros.push(re);
                                        let _a = [...e[re.target]];
                                        if (!re.fill)
                                            re.fill = "0";
                                        while (_a.length <= Number(re.v)) {
                                            _a.unshift(re.fill.charAt(0));
                                        }
                                        e[re.target] = _a.join("");
                                    }
                                    prom(re.k);
                                    break;
                                case "datamax":
                                    if (mkt.dataGetMs(e[re.target]) > mkt.dataGetMs(re.v)) {
                                        if (!re.m)
                                            re.m = mkt.a.msg.datamax;
                                        erros.push(re);
                                        e[re.target] = re.v;
                                    }
                                    prom(re.k);
                                    break;
                                case "nummin":
                                    e.setAttribute("min", re.v);
                                    if (mkt.toNumber(Number(e[re.target])) < Number(re.v)) {
                                        if (!re.m)
                                            re.m = mkt.a.msg.nummin + re.v;
                                        erros.push(re);
                                        e[re.target] = re.v;
                                    }
                                    prom(re.k);
                                    break;
                                case "nummax":
                                    e.setAttribute("max", re.v);
                                    if (mkt.toNumber(Number(e[re.target])) > Number(re.v)) {
                                        if (!re.m)
                                            re.m = mkt.a.msg.nummax + re.v;
                                        erros.push(re);
                                        e[re.target] = re.v;
                                    }
                                    prom(re.k);
                                    break;
                                case "obrigatorio":
                                    if (re.v == null)
                                        re.v = "true";
                                    if (re.v == "true") {
                                        if (e[re.target] == "") {
                                            if (!re.m) {
                                                if (mkt.classof(e) == "mkSelElement") {
                                                    re.m = mkt.a.msg.so;
                                                }
                                                else {
                                                    re.m = mkt.a.msg.po;
                                                }
                                            }
                                            erros.push(re);
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "regex":
                                    if ((tipoEvento == "full") || (tipoEvento == "blur")) {
                                        if (!(new RegExp(re.v).test(e[re.target]))) {
                                            if (!re.m)
                                                re.m = mkt.a.msg.fi;
                                            erros.push(re);
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "email":
                                    if ((tipoEvento == "full") || (tipoEvento == "blur")) {
                                        if (!re.v)
                                            re.v = mkt.a.util.email[1];
                                        if (!(new RegExp(re.v).test(e[re.target]))) {
                                            if (!re.m)
                                                re.m = mkt.a.msg.emailinvalido;
                                            erros.push(re);
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "some":
                                    if ((tipoEvento == "full") || (tipoEvento == "blur")) {
                                        let _vs;
                                        re.vmfail = [];
                                        let b = false;
                                        Array.isArray(re.v) ? _vs = re.v : _vs = [re.v];
                                        for (let i = 0; i < _vs.length; i++) {
                                            if (!([...e[re.target]].some(le => new RegExp(_vs[i]).test(le)))) {
                                                if (!re.m) {
                                                    re.m = mkt.a.msg.some;
                                                }
                                                re.vmfail.push(re.vm[i]);
                                                b = true;
                                            }
                                        }
                                        if (b) {
                                            erros.push(re);
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "mincharsinfo":
                                    if ((tipoEvento == "full") || (tipoEvento == "blur")) {
                                        e.setAttribute("minlength", re.v);
                                        if (e[re.target].length < Number(re.v)) {
                                            if (!re.m)
                                                re.m = mkt.a.msg.minc + re.v;
                                            erros.push(re);
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "maxcharsinfo":
                                    if ((tipoEvento == "full") || (tipoEvento == "blur")) {
                                        if (e[re.target].length > Number(re.v)) {
                                            if (!re.m)
                                                re.m = mkt.a.msg.maxc + re.v;
                                            erros.push(re);
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "fn":
                                    if ((tipoEvento == "full") || (tipoEvento == "blur")) {
                                        re.v = eval(re.v);
                                        if (!(re.v(e[re.target]))) {
                                            if (!re.m)
                                                re.m = mkt.a.msg.negado;
                                            erros.push(re);
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "datamaiorque":
                                    if ((tipoEvento == "full") || (tipoEvento == "blur")) {
                                        if (mkt.dataGetMs(e[re.target]) < mkt.dataGetMs(re.v)) {
                                            if (!re.m)
                                                re.m = mkt.a.msg.datamaiorque;
                                            erros.push(re);
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "datamenorque":
                                    if ((tipoEvento == "full") || (tipoEvento == "blur")) {
                                        if (mkt.dataGetMs(e[re.target]) > mkt.dataGetMs(re.v)) {
                                            if (!re.m)
                                                re.m = mkt.a.msg.datamenorque;
                                            erros.push(re);
                                        }
                                    }
                                    prom(re.k);
                                    break;
                                case "server":
                                    if ((tipoEvento == "full") || (tipoEvento == "blur")) {
                                        if (!re.m)
                                            re.m = mkt.a.msg.in;
                                        if (e[re.target] != "") {
                                            e.classList.add("pending");
                                            let queryString = "?" + regrasDoE.n + "=" + encodeURIComponent(e[re.target]);
                                            if (re.a) {
                                                let arrAdd = re.a.split(",");
                                                arrAdd.forEach((s) => {
                                                    let eAdd = regrasDoE.c.querySelector("*[name='" + s.trim() + "']");
                                                    if (eAdd) {
                                                        queryString += "&" + s.trim() + "=" + eAdd[re.target];
                                                    }
                                                    else {
                                                        mkt.w("Regrar: Campo Adicional (a) solicitado não encontrado: ", s.trim());
                                                    }
                                                });
                                            }
                                            mkt.get.json({ url: re.v + queryString, quiet: re.quiet }).then((p) => {
                                                if (p.retorno != true) {
                                                    if (mkt.classof(p.retorno) == "String") {
                                                        re.m = p.retorno;
                                                    }
                                                    erros.push(re);
                                                }
                                                if (p.retorno != null) {
                                                    e.classList.remove("pending");
                                                }
                                                prom(re.k);
                                            });
                                        }
                                        else {
                                            erros.push(re);
                                            prom(re.k);
                                        }
                                    }
                                    else {
                                        prom(re.k);
                                    }
                                    break;
                                default:
                                    mkt.w("Regrar() - Regra não encontrada: ", regraK);
                                    prom(null);
                            }
                        }));
                    }
                });
            }
            Promise.all(promises).then(ok => {
                if (erros.length > 0) {
                    let mensagens = erros.map((a) => {
                        if (Array.isArray(a.vmfail)) {
                            a.m = mkt.a.msg.some + a.vmfail.join(", ");
                        }
                        return a.m;
                    }).join("<br/>");
                    mkt.regraDisplay(e, true, eDisplay, mensagens);
                    if (eDisplay)
                        mkt.Terremoto(eDisplay);
                }
                else {
                    mkt.regraDisplay(e, false, eDisplay, "");
                }
                resolver(erros);
            });
        });
    };
    static regrasValidas = async (container, ev = null) => {
        container = mkt.Q(container);
        let validou = false;
        let promises = [];
        mkt.regras.forEach((regra) => {
            if (mkt.isInside(regra.e, container)) {
                promises.push(mkt.regraExe(regra.e, "full", ev));
            }
        });
        let resultado = [];
        resultado = await Promise.all(promises);
        validou = resultado.flat().length <= 0;
        if (!validou) {
            mkt.vibrar(false);
            mkt.gc("Validou a ação? ", (validou ? "Sim." : "Não."), " TipoEvento: full");
            resultado.flat().forEach((r) => {
                mkt.gc("Regra:", r.k?.toString().toUpperCase(), "Campo: " + r.e?.name);
                mkt.l(r.e);
                mkt.ge();
            });
            mkt.ge();
        }
        else {
            mkt.l("Validou a ação? Sim. TipoEvento: full");
        }
        return validou;
    };
    static regraDisplay = (e, erro, eDisplay, mensagem = "") => {
        if (erro) {
            e.classList.remove("valid");
            e.classList.add("input-validation-error");
            eDisplay?.classList.remove("oculto");
            eDisplay?.classList.add("field-validation-error");
        }
        else {
            if (e.offsetParent && !e.classList.contains("disabled")) {
                e.classList.add("valid");
            }
            e.classList.remove("input-validation-error");
            eDisplay?.classList.add("oculto");
        }
        if (eDisplay)
            eDisplay.innerHTML = mensagem;
    };
    static regraOcultar = (container) => {
        container = mkt.Q(container);
        mkt.regras.forEach((r) => {
            let e = r.e;
            let eDisplay = r.c.querySelector(".mkRegrar[data-valmsg-for='" + r.n + "']");
            if (container) {
                if (mkt.isInside(e, container)) {
                    mkt.regraDisplay(e, false, eDisplay);
                }
            }
            else {
                mkt.regraDisplay(e, false, eDisplay);
            }
        });
    };
    static regraRemover = async (container) => {
        container = mkt.Q(container);
        let tempRegras = [];
        mkt.regras.forEach((r) => {
            if (!mkt.isInside(r.e, container)) {
                tempRegras.push(r);
            }
            ;
        });
        mkt.regras = tempRegras;
    };
    static regrarAtivador = (e, nomeRegra, turnON = true) => {
        if (nomeRegra != null) {
            e = mkt.Q(e);
            if (e) {
                let eRegras = mkt.regras.filter(r => { return r.e == e; });
                eRegras.forEach((r) => {
                    r.r.forEach((re) => {
                        if (nomeRegra == re.k) {
                            re.on = turnON;
                        }
                    });
                });
            }
            else {
                mkt.w("regrarOn - Elemento não encontrado: ", e);
            }
        }
        else {
            mkt.w("regrarOn - Requer parametro 'nomeRegra' com uma string: ", nomeRegra);
        }
    };
    static regrar = (container, nome, ...obj) => {
        if (typeof nome != "string") {
            return mkt.w("Regrar() precisa receber o nome do input como string");
        }
        container = mkt.Q(container);
        let e = container?.querySelector("*[name='" + nome + "']");
        if (e) {
            if (e.getAttribute("type") == "file") {
                mkt.Ao("change", e, () => { mkt.regraExe(e, "change"); });
            }
            else {
                mkt.atribuir(e, () => { mkt.regraExe(e, "input"); }, "oninput");
                mkt.atribuir(e, (ev) => { mkt.regraExe(e, "blur", ev); }, "onblur");
            }
            let auto = false;
            let novaregra = { c: container, n: nome, e: e, r: [...obj] };
            let posE = mkt.regras.findIndex((o) => o.e == e);
            if (posE >= 0) {
                novaregra.r.forEach((i) => {
                    let posRe = mkt.regras[posE].r.findIndex((o) => o.k == i.k);
                    if (posRe >= 0) {
                        for (let p in novaregra.r) {
                            mkt.regras[posE].r[posRe] = novaregra.r[p];
                        }
                    }
                    else {
                        mkt.regras[posE].r.push(i);
                        if (i.a)
                            auto = true;
                    }
                });
            }
            else {
                mkt.regras.push(novaregra);
                novaregra.r.forEach((i) => {
                    if (i.a)
                        auto = true;
                });
            }
            if (auto) {
                mkt.regraExe(e, "inicial");
            }
        }
        else {
            mkt.w("Regrar Requer Elemento (" + nome + "): ", e, " Container: ", container);
        }
    };
    static mascarar = (texto, mascara) => {
        if (mkt.classof(mascara) != "String") {
            if (mkt.classof(mascara) == "Function") {
                mascara = mascara(texto);
            }
        }
        if (mascara) {
            if (texto) {
                if (mkt.classof(texto) != "String")
                    texto = texto?.toString();
                if (mkt.classof(mascara) != "String")
                    mascara = mascara?.toString();
                let ms = [...mkt.clonar(mascara)];
                let ss = [...mkt.clonar(texto)];
                let ts = [];
                let pm = 0;
                ss.forEach(s => {
                    let t = null;
                    if (/[0-9]/.test(s)) {
                        t = "0";
                    }
                    else if (/[a-zA-Z]/.test(s)) {
                        t = "A";
                    }
                    else {
                        t = " ";
                    }
                    ts.push(t);
                    pm++;
                });
                let r = [];
                for (let tp = 0, mp = 0; (tp < ts.length) && (mp < ms.length); tp++, mp++) {
                    if (((ms[mp] === "0" || ms[mp] === "A") && (ms[mp] == ts[tp]))
                        || (ms[mp] === "S" && (ts[tp] === "A" || ts[tp] === "0"))) {
                        r.push(ss[tp]);
                    }
                    else {
                        if (ss[tp] === ms[mp]) {
                            r.push(ss[tp]);
                        }
                        else {
                            if (ms[mp] != "0" && ms[mp] != "A" && ms[mp] != "S") {
                                r.push(ms[mp]);
                                tp--;
                            }
                            else {
                                mp--;
                            }
                        }
                    }
                }
                return r.join("");
            }
        }
        else {
            mkt.w("Mascarar Requer Texto: ", texto, " e Mascara: ", mascara);
        }
        return null;
    };
    static mascaraTelefoneDDI = (texto) => {
        let str = texto;
        let resultado = "";
        if (mkt.classof(str) == "String") {
            let parteDDI = "";
            let parteDDDTelefone = "";
            if (str.indexOf("+") >= 0) {
                str = str.replaceAll("+", "");
                if (str.indexOf(" ") >= 0) {
                    parteDDI = mkt.apenasNumeros(str.split(" ")[0]);
                    parteDDDTelefone = str.slice(str.split(" ")[0].length);
                }
                else {
                    parteDDI = mkt.apenasNumeros(str).slice(0, 2);
                    parteDDDTelefone = str.slice(str.indexOf(parteDDI) + parteDDI.length);
                }
                resultado = "+" + parteDDI;
                if (texto.length >= 5) {
                    resultado += " ";
                }
                parteDDDTelefone = parteDDDTelefone.trim();
                if (parteDDDTelefone.indexOf(" ") >= 0) {
                    let parteDDD = mkt.apenasNumeros(parteDDDTelefone.split(" ")[0]);
                    let parteTelefone = mkt.apenasNumeros(parteDDDTelefone.slice(parteDDDTelefone.split(" ")[0].length).trim());
                    let p1 = parteTelefone.length - 5;
                    if (p1 > 0) {
                        parteTelefone = parteTelefone.slice(0, p1 + 1) + "-" + parteTelefone.slice(p1 + 1);
                    }
                    resultado += "(" + parteDDD + ") " + parteTelefone;
                }
                else {
                    if (parteDDI == "55") {
                        let parteDDD = mkt.apenasNumeros(parteDDDTelefone).slice(0, 2);
                        let parteTelefone = mkt.apenasNumeros(parteDDDTelefone).slice(2);
                        let p1 = parteTelefone.length - 5;
                        if (p1 > 0) {
                            parteTelefone = parteTelefone.slice(0, p1 + 1) + "-" + parteTelefone.slice(p1 + 1);
                        }
                        resultado += "(" + parteDDD + ") " + parteTelefone;
                    }
                    else {
                        resultado += mkt.apenasNumeros(parteDDDTelefone);
                    }
                }
            }
            else {
                if ((mkt.apenasNumeros(str).startsWith("55")) && (mkt.apenasNumeros(str).length >= 12)) {
                    let temp = str.trim();
                    let pos = temp.indexOf("55");
                    resultado = "+55 " + mkt.mascarar(temp.slice(pos + 2), mkt.a.util.telefone_ddd[0]);
                }
                else {
                    resultado = mkt.mascarar(str, mkt.a.util.telefone_ddd[0]);
                }
            }
        }
        else {
            mkt.w("mascaraTelefoneDDI() - Parametro precisa ser string: ", mkt.classof(texto));
        }
        if (resultado == "")
            resultado = texto;
        if (mkt.apenasNumeros(resultado).length > 13)
            resultado = resultado.slice(0, resultado.length - 1);
        mkt.l("Tel DDI: ", texto, " -> ", resultado);
        return resultado;
    };
    static contem = (strMaior, strMenor) => {
        strMaior = mkt.removeEspecias(strMaior).toLowerCase();
        strMenor = mkt.removeEspecias(strMenor).toLowerCase();
        return (strMaior.includes(strMenor));
    };
    static like = (strMenor, strMaior) => {
        let result = false;
        let rmMaior = mkt.removeEspecias(strMaior.toLowerCase().trim());
        let rmMenor = mkt.removeEspecias(strMenor.toLowerCase().trim());
        if (rmMaior.match(rmMenor)) {
            result = true;
        }
        return result;
    };
    static classof = (o) => {
        let nomeClasse = Object.prototype.toString.call(o).slice(8, -1);
        if (nomeClasse == "Number") {
            if (o.toString() == "NaN") {
                nomeClasse = "NaN";
            }
        }
        ;
        return nomeClasse;
    };
    static clonar = (i) => {
        return mkt.parseJSON(mkt.stringify(i));
    };
    static ordenar = (array, nomeProp, sortDir) => {
        if (nomeProp) {
            array.sort((oA, oB) => {
                let a = nomeProp ? mkt.getV(nomeProp, oA) : null;
                let b = nomeProp ? mkt.getV(nomeProp, oB) : null;
                if (typeof a == "string")
                    a = a.toLowerCase().trim();
                if (typeof b == "string")
                    b = b.toLowerCase().trim();
                if (a !== b) {
                    if (a > b)
                        return 1;
                    if (a < b)
                        return -1;
                }
                if (!a || !b) {
                    return 0;
                }
                return -1;
            });
            if (!mkt.a.contaOrdena) {
                mkt.a.contaOrdena = 0;
            }
            mkt.a.contaOrdena++;
            if (sortDir === 1) {
                array = array.reverse();
            }
            else if (sortDir === 2) {
                if (mkt.a.contaOrdena % 2 == 0) {
                    array = array.reverse();
                }
            }
        }
        return array;
    };
    static toBooleanOA = (oa) => {
        let toBoolean_Execute = (o) => {
            for (let propName in o) {
                let comparado = o[propName]?.toString()?.toLowerCase();
                if (comparado == "true") {
                    o[propName] = true;
                }
                if (comparado == "false") {
                    o[propName] = false;
                }
            }
            return o;
        };
        return mkt.aCadaObjExecuta(oa, toBoolean_Execute);
    };
    static limparOA = (oa) => {
        let limparO_Execute = (o) => {
            for (let propName in o) {
                if (o[propName] === null ||
                    o[propName] === undefined ||
                    o[propName] === "" ||
                    o[propName] === "undefined") {
                    delete o[propName];
                }
            }
            return o;
        };
        return mkt.aCadaObjExecuta(oa, limparO_Execute);
    };
    static limparFull = (sub) => {
        return mkt.aCadaSubPropriedade(sub, (v, i, a) => {
            if (v === null || v === undefined || v === "" || v === "undefined") {
                delete a[i];
            }
        });
    };
    static aCadaSubPropriedade = (OA, funcao = null, exceto = "Object") => {
        let c = 0;
        for (let a in OA) {
            if (mkt.classof(OA[a]) != exceto) {
                if (funcao) {
                    funcao(OA[a], a, OA);
                }
            }
            c++;
            if (mkt.classof(OA[a]) == "Object") {
                c += mkt.aCadaSubPropriedade(OA[a], funcao, exceto);
            }
        }
        return c;
    };
    static aCadaObjExecuta = (oa, func) => {
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
    static aCadaElemento = (query, fn) => {
        let elementos = mkt.QAll(query);
        elementos.forEach((e) => {
            fn(e);
        });
        return elementos;
    };
    static parseJSON = (t, removeRaw = false) => {
        if (removeRaw) {
            if (mkt.classof(t) == "String") {
                t = t.removeRaw(removeRaw);
            }
        }
        if (t === "")
            return "";
        if (mkt.isJson(t)) {
            return JSON.parse(t);
        }
        else {
            mkt.w("JSON Inválido: Não foi possível converter o JSON.");
            return null;
        }
    };
    static stringify = (o) => {
        return JSON.stringify(o)
            ?.replaceAll("\n", "")
            ?.replaceAll("\r", "")
            ?.replaceAll("\t", "")
            ?.replaceAll("\b", "")
            ?.replaceAll("\f", "");
    };
    static clicarNaAba = (e) => {
        let pag = Number(e?.getAttribute("data-pag"));
        if (mkt.classof(pag) == "Number") {
            let mkAbasTotal = 0;
            let mkAbas = e.closest(".mkAbas");
            mkAbas?.querySelectorAll("a").forEach((a) => {
                a.classList.remove("active");
                mkAbasTotal++;
            });
            e.classList.add("active");
            for (let i = 1; i <= mkAbasTotal; i++) {
                mkt.QAll(".mkAba" + i).forEach((e) => {
                    if (i == pag) {
                        e.classList.remove("oculto");
                    }
                    else {
                        e.classList.add("oculto");
                    }
                });
            }
        }
    };
    static Workers = (numWorkers = navigator.hardwareConcurrency || 5) => {
        if (numWorkers > 3)
            numWorkers = 3;
        if (numWorkers < 1)
            numWorkers = 1;
        return new Promise((r) => {
            if (!document.querySelector("#mktWorker")) {
                let we = document.createElement("script");
                we.setAttribute("type", "javascript/worker");
                we.setAttribute("id", "mktWorker");
                we.innerHTML = `
				const classof = (o) => {
					let nomeClasse = Object.prototype.toString.call(o).slice(8, -1);
					// Exceção, apenas quando "Number" converter os NaN pra "NaN".
					if (nomeClasse == "Number") {
						if (o.toString() == "NaN") {
							nomeClasse = "NaN";
						}
					}
					return nomeClasse;
				}
				onmessage = (ev) => {
					if (ev?.data?.k) {
						let job = ev.data;
				
						if (ev.data.k == "Exclusivos") { // Exclusivos
							let chaves = new Set();
							job.v.forEach((o) => {
								Object.keys(o).forEach((p) => {
									chaves.add(p);
								});
							});
							let campos = {};
							let virouJson = {};
							chaves.forEach((k) => {
								let tempSet = new Set();
								let tempJson = new Set();
								job.v.forEach((o) => {
									let temp = o[k];
									let tipo = classof(o[k])
									if (tipo == "String") {
										temp = temp.trim();
									}
									if (tipo == "Object") {
										temp = JSON.stringify(temp);
										if (tempJson) tempJson.add(k);
									}
									if (temp) tempSet.add(temp.toString());
								});
								campos[k] = [...tempSet];
								virouJson[k] = [...tempJson];
								virouJson[k]?.forEach((kJson) => {
									for (let i = 0; i < campos[kJson].length; i++) {
										campos[kJson][i] = JSON.parse(campos[kJson][i]);
									};
								});
							});
							postMessage({ k: "Exclusivos", v: campos });
				
						} else if (ev.data.k == "ChavesRepetidas") { // ChavesRepetidas
							let resultado = new Set();
							let jaTem = new Set();
							job.v.forEach(o => {
								if (jaTem.has(o[job.target])) {
									resultado.add(o[job.target]);
								}
								jaTem.add(o[job.target]);
							})
							postMessage({ k: "ChavesRepetidas", v: [...resultado] });
				
						} else if (ev.data.k == "Duplices") { // Duplices
							let resultado = new Set();
							let jaTem = new Set();
							job.v.forEach(o => {
								let ch = o[job.target];
								if (o[job.target]) {
									delete o[job.target];
								}
								let str = JSON.stringify(o);
								if (jaTem.has(str)) {
									resultado.add(ch);
								}
								jaTem.add(str);
							})
							postMessage({ k: "ChavesRepetidas", v: [...resultado] });
						}
					}
				}`;
                document.body.append(we);
            }
            let workerBlob = window.URL.createObjectURL(new Blob([mkt.Q("#mktWorker")?.textContent], { type: "text/javascript" }));
            class WorkerPool {
                idleWorkers;
                workQueue;
                workerMap;
                constructor(numWorkers, workerSource) {
                    this.idleWorkers = [];
                    this.workQueue = [];
                    this.workerMap = new Map();
                    for (let i = 0; i < numWorkers; i++) {
                        let worker = new Worker(workerSource);
                        worker.onmessage = msg => {
                            this._workerDone(worker, null, msg.data);
                        };
                        worker.onerror = error => {
                            this._workerDone(worker, error, null);
                        };
                        this.idleWorkers[i] = worker;
                    }
                }
                _workerDone(worker, error, msg) {
                    let [res, rej] = this.workerMap.get(worker);
                    this.workerMap.delete(worker);
                    if (this.workQueue.length === 0) {
                        this.idleWorkers.push(worker);
                    }
                    else {
                        let [task, res, rej] = this.workQueue.shift();
                        this.workerMap.set(worker, [res, rej]);
                        worker.postMessage(task);
                    }
                    error === null ? res(msg) : rej(error);
                }
                addTask(task) {
                    return new Promise((res, rej) => {
                        if (this.idleWorkers.length > 0) {
                            let worker = this.idleWorkers.pop();
                            if (worker) {
                                this.workerMap.set(worker, [res, rej]);
                                worker.postMessage(task);
                            }
                            else {
                                mkt.w("addTask() - Worker desocupado: ", worker, " não encontrado. " + this.idleWorkers.length + " desocupados: ", this.idleWorkers, " Solicitando novo!");
                                this.workQueue.push([task, res, rej]);
                            }
                        }
                        else {
                            this.workQueue.push([task, res, rej]);
                        }
                    });
                }
            }
            mkt.a.wpool = new WorkerPool(numWorkers, workerBlob);
            r(mkt.a.wpool);
        });
    };
    static addTask = (msg, numWorkers = undefined) => {
        return new Promise((r) => {
            if (!mkt.a.wpool) {
                mkt.Workers(numWorkers).then(() => {
                    r(mkt.a.wpool.addTask(msg));
                });
            }
            else {
                r(mkt.a.wpool.addTask(msg));
            }
        });
    };
    static removeAcentos = (s) => {
        if (s == null)
            return "";
        s = s.toString();
        let r = "";
        let sS = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
        let sN = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
        for (let p = 0; p < s.length; p++) {
            let pSS = sS.indexOf(s.charAt(p));
            if (pSS != -1) {
                r += sN.charAt(pSS);
            }
            else {
                r += s.charAt(p);
            }
        }
        return r;
    };
    static removeEspecias = (s) => {
        if (s == null)
            return "";
        s = s.toString();
        return mkt.apenasNumerosLetras(mkt.removeAcentos(s));
    };
    static removerAspas = (s) => {
        if (mkt.classof(s) == "String") {
            s = s.replaceAll('"', "&quot;");
            s = s.replaceAll("\'", "&#39;");
        }
        return s;
    };
    static apenasNumeros = (s = "") => {
        if (s == null)
            return "";
        return s.toString().replace(/(?![0-9])./g, "");
    };
    static apenasLetras = (s = "") => {
        if (s == null)
            return "";
        return s.replace(/(?![a-zA-Z])./g, "");
    };
    static apenasNumerosLetras = (s = "") => {
        if (s == null)
            return "";
        return s.replace(/(?![a-zA-Z0-9])./g, "");
    };
    static nodeToScript = (node) => {
        if (node.tagName === "SCRIPT") {
            let eScript = document.createElement("script");
            eScript.text = node.innerHTML;
            let i = -1, attrs = node.attributes, attr;
            while (++i < attrs.length) {
                eScript.setAttribute((attr = attrs[i]).name, attr.value);
            }
            node.parentNode.replaceChild(eScript, node);
        }
        else {
            var i = -1, children = node.childNodes;
            while (++i < children.length) {
                mkt.nodeToScript(children[i]);
            }
        }
        return node;
    };
    static isInside = (e, container) => {
        let resultado = false;
        if (e) {
            let ePai = e;
            let c = 0;
            while (ePai != mkt.Q("BODY") && c < 100) {
                if (ePai) {
                    ePai = ePai?.parentElement;
                    if (ePai == container) {
                        resultado = true;
                        break;
                    }
                }
                else {
                    return false;
                }
                c++;
            }
        }
        else {
            mkt.w("isInside() requer ao menos o Elemento: ", e, " Container: ", container);
        }
        return resultado;
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
    static allParentOffset = (e) => {
        let conta = 0;
        let last = null;
        while (e != null) {
            e = e.offsetParent;
            if (e) {
                last = e;
                conta += e.offsetTop;
            }
            else {
                break;
            }
        }
        if (last?.tagName == "BODY") {
            return 0;
        }
        else {
            return conta;
        }
    };
    static Reposicionar = (e, largura = null) => {
        let eAnterior = e.previousElementSibling;
        if (largura) {
            e.style.minWidth = (eAnterior.offsetWidth - 3) + "px";
            e.style.maxWidth = (eAnterior.offsetWidth - 3) + "px";
        }
        if (mkt.a.poppers.get(e) == null) {
            mkt.a.poppers.set(e, Popper.createPopper(eAnterior, e, {
                placement: "bottom-start",
                strategy: "fixed",
                modifiers: [],
            }));
        }
    };
    static BoolToSimNaoSOA = (soa) => {
        function BoolToSimNaoOA_Execute(o) {
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
        if (mkt.classof(soa) == "String") {
            if (soa.toString().toLowerCase() == "true") {
                soa = "Sim";
            }
            if (soa.toString().toLowerCase() == "false") {
                soa = "N&atilde;o";
            }
            return soa;
        }
        return mkt.aCadaObjExecuta(soa, BoolToSimNaoOA_Execute);
    };
    static formatadorDeTexto = (texto) => {
        return texto
            .replaceAll("[b]", "<b>")
            .replaceAll("[/b]", "</b>");
    };
    static eToText = (query) => {
        let e = mkt.Q(query);
        let v = "";
        let classes = "";
        let div = document.createElement("div");
        if (e) {
            let ePai = e.parentElement;
            classes = e.classList.toString();
            if (mkt.classof(e) == "HTMLTextAreaElement") {
                v = e.innerHTML;
            }
            if (mkt.classof(e) == "HTMLInputElement") {
                v = e.value;
            }
            else if (mkt.classof(e) == "mkSelElement") {
                v = e.values.join(", ");
            }
            div.innerHTML = v;
            div.setAttribute("class", classes);
            ePai?.insertBefore(div, ePai?.children[Array.from(ePai?.children).indexOf(e) + 1]);
            e.remove();
            return div;
        }
        return null;
    };
    static getEFromNames = (arrayNames = [], classe = "*") => {
        if (mkt.classof(arrayNames) == "Array") {
            let queries = [];
            arrayNames.forEach((e) => {
                queries.push(mkt.Q(classe + "[name='" + e + "']"));
            });
            return queries;
        }
        else {
            mkt.w("getEFromNames() - Requer uma array de nomes: ", mkt.classof(arrayNames));
            return [];
        }
    };
    static uuid = () => {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => {
            return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
        });
    };
    static cursorFim = (e) => {
        let len = e.value.length;
        mkt.wait(1).then(r => {
            e.setSelectionRange(len, len);
        });
    };
    static geraObjForm = (form, bool = false) => {
        if (mkt.classof(form) != "Object") {
            form = mkt.Q(form);
        }
        let rObjeto = mkt.limparOA(Object.fromEntries(new FormData(form).entries()));
        if (form) {
            if (bool) {
                rObjeto = mkt.toBooleanOA(rObjeto);
            }
            for (let [k, v] of Object.entries(rObjeto)) {
                mkt.setV(k, v, rObjeto);
                if (k.includes(".")) {
                    delete rObjeto[k];
                }
            }
            Array.from(form.querySelectorAll("mk-sel")).forEach((mk) => {
                mkt.setV(mk.name, mk.value, rObjeto);
            });
            Array.from(form.querySelectorAll("mk-bot.changed")).forEach((mk) => {
                mkt.setV(mk.name, mk.value, rObjeto);
            });
        }
        if (bool) {
            rObjeto = mkt.toBooleanOA(rObjeto);
        }
        mkt.limparFull(rObjeto);
        return rObjeto;
    };
    static QScrollTo = (query = "body") => {
        let temp = mkt.Q(query);
        let distTopo = temp.offsetTop;
        window.scrollTo({
            top: distTopo,
            behavior: "smooth",
        });
        return temp;
    };
    static GetParam = (name = null, url = null) => {
        if (!url)
            url = document.location.toString();
        if (name != null) {
            return new URL(url).searchParams.get(name);
        }
        else {
            return new URL(url).searchParams.toString();
        }
    };
    static isVisible = (e) => {
        if (mkt.isInsideDom(e)) {
            if (!mkt.isOculto(e)) {
                return true;
            }
            ;
        }
        return false;
    };
    static isOculto = (e) => {
        e = mkt.Q(e);
        return !(e.offsetWidth > 0 || e.offsetHeight > 0);
    };
    static isInsideDom = (e) => {
        return mkt.Q(e).closest("html") ? true : false;
    };
    static downloadData = (base64, nomeArquivo = "Arquivo") => {
        const link = document.createElement("a");
        link.href = base64;
        link.download = nomeArquivo;
        link.click();
        return nomeArquivo;
    };
    static onlyFloatKeys = (ev) => {
        let permitido = "0123456789,-";
        let isNegado = true;
        for (var i = 0; i < permitido.length; i++) {
            if (permitido[i] == ev.key?.toString()) {
                isNegado = false;
            }
        }
        ev.key == "ArrowLeft" ? (isNegado = false) : null;
        ev.key == "ArrowRight" ? (isNegado = false) : null;
        ev.key == "Backspace" ? (isNegado = false) : null;
        ev.key == "Delete" ? (isNegado = false) : null;
        ev.key == "Tab" ? (isNegado = false) : null;
        if (isNegado) {
            ev.preventDefault();
        }
    };
    static eventBlock = (ev) => {
        mkt.w("Negado", ev);
        ev.preventDefault();
    };
    static selecionarInner = (e) => {
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(e);
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    };
    static formatarNumValue = (e) => {
        e.value = mkt.numToDisplay(e.value);
    };
    static fileReader = async (arquivo, eventos) => {
        return new Promise((r) => {
            let leitor = new FileReader();
            let gatilhos = (event) => {
                if (event.type == "error") {
                    mkt.erro("fileReader() - Erro: ", event);
                    r(null);
                }
                else if (event.type == "loadend") {
                    arquivo.b64 = leitor.result;
                    r(arquivo);
                }
                if (eventos)
                    eventos(event, Math.trunc((event.loaded / event.total) * 100));
            };
            if (arquivo) {
                if (arquivo.name != "") {
                    leitor.addEventListener("loadstart", gatilhos);
                    leitor.addEventListener("progress", gatilhos);
                    leitor.addEventListener("error", gatilhos);
                    leitor.addEventListener("abort", gatilhos);
                    leitor.addEventListener("load", gatilhos);
                    leitor.addEventListener("loadend", gatilhos);
                    leitor.readAsDataURL(arquivo);
                }
                else {
                    mkt.l("fileReader() - Nome do arquivo necessário: ", arquivo.name);
                    r(null);
                }
            }
            else {
                mkt.w("fileReader() - Arquivo Nulo: ", arquivo);
                r(null);
            }
            ;
        });
    };
    static getModelo = (array) => {
        let chaves = new Set();
        array.forEach((o) => {
            Object.keys(o).forEach((p) => {
                chaves.add(p);
            });
        });
        let modelo = {};
        chaves.forEach((k) => {
            modelo[k] = [];
            array.forEach((o) => {
                let tipo = typeof o[k];
                if (modelo[k].indexOf(tipo) < 0)
                    modelo[k].push(tipo);
            });
        });
        return modelo;
    };
    static getExclusivos = async (array) => {
        let res = await mkt.addTask({ k: "Exclusivos", v: array });
        return res.v;
    };
    static encheArray = (arrTemplate, inicio = 1, total) => {
        let novaArray = [];
        if (Array.isArray(arrTemplate)) {
            if (arrTemplate.length > 0) {
                if (arrTemplate.length < inicio) {
                    mkt.erro("O arrTemplate tem menos itens do que o informado para o inicio");
                    return novaArray;
                }
            }
            else {
                mkt.erro("Função encheArray precisa receber ao menos 1 item em arrTemplate.");
                return novaArray;
            }
        }
        else {
            mkt.erro("Função encheArray precisa receber uma array com dados em arrTemplate.");
            return novaArray;
        }
        if (inicio <= 0) {
            mkt.erro("O inicio precisa ser maior que zero.");
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
                    mkt.erro("O arrTemplate tem menos itens do que o informado para o fim.");
                    return novaArray;
                }
            }
            else {
                mkt.erro("Função encheArrayUltimos precisa receber ao menos 1 item em arrTemplate.");
                return novaArray;
            }
        }
        else {
            mkt.erro("Função encheArrayUltimos precisa receber uma array com dados em arrTemplate.");
            return novaArray;
        }
        if (fim <= 0) {
            mkt.erro("O fim precisa ser maior que zero.");
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
    static fase = (possiveis, config) => {
        class FasearMK {
            possiveis;
            atual;
            historico;
            config;
            constructor(possiveis, config) {
                this.possiveis = possiveis;
                this.atual = possiveis[0];
                this.historico = [this.atual];
                if (typeof config != "object") {
                    config = {};
                }
                if (!config.classe) {
                    config.classe = "";
                }
                if (!config.aoAvancar) {
                    config.aoAvancar = this.aoAvancar;
                }
                this.config = config;
                this.update();
            }
            async aoAvancar() { }
            async avancar(novaFase = null) {
                return new Promise(async (r, err) => {
                    if (await mkt.regrasValidas(".modalFase" + this.atual)) {
                        if (novaFase) {
                            if (novaFase instanceof HTMLElement) {
                                if (novaFase.getAttribute("data-libera")) {
                                    this.atual = Number(novaFase.getAttribute("data-pag"));
                                    this.config.aoAvancar();
                                }
                                else {
                                    mkt.w("Avançar para fase específica negado. Requer Libera!");
                                }
                            }
                            else {
                                this.atual = novaFase;
                            }
                            this.historico.push(this.atual);
                            this.update();
                            r(this.atual);
                        }
                        else {
                            let proxFase = this.possiveis[this.possiveis.indexOf(this.atual) + 1];
                            if (proxFase) {
                                this.atual = proxFase;
                                this.historico.push(this.atual);
                                this.update();
                                r(this.atual);
                            }
                            else {
                                err("Não é possível avançar mais.");
                            }
                        }
                    }
                    else {
                        err("Fase não passou no validador.");
                    }
                });
            }
            async voltar() {
                return new Promise((r, err) => {
                    if (this.possiveis.indexOf(this.atual) >= 1) {
                        this.historico.pop();
                        let novaFase = this.historico[this.historico.length - 1];
                        if (novaFase) {
                            this.atual = novaFase;
                            this.update();
                            r(this.atual);
                        }
                        else {
                            err("Não há histórico de onde voltar.");
                        }
                    }
                    else {
                        err("Já está na primeira fase possível.");
                    }
                });
            }
            update() {
                mkt.QAll(this.config.classe + " ul.mkUlFase li a").forEach((e) => {
                    e.parentElement?.classList.remove("mkFaseBack");
                    e.parentElement?.classList.remove("mkFaseAtivo");
                    e.parentElement?.classList.remove("disabled");
                    let eNumPag = Number(e.getAttribute("data-pag"));
                    let bLibera = e.getAttribute("data-libera");
                    if (this.possiveis.indexOf(this.atual) > this.possiveis.indexOf(eNumPag)) {
                        e.parentElement?.classList.add("mkFaseBack");
                    }
                    if (this.possiveis.indexOf(this.atual) == this.possiveis.indexOf(eNumPag)) {
                        e.parentElement?.classList.add("mkFaseAtivo");
                    }
                    if (bLibera == "false") {
                        e.parentElement?.classList.add("disabled");
                    }
                });
                for (let i = 0; i < this.possiveis.length; i++) {
                    let elemento = mkt.Q(this.config.classe + " .modalFase" + this.possiveis[i]);
                    if (elemento) {
                        elemento?.classList.add("oculto");
                    }
                    else {
                        mkt.w("Fase não encontrada: .modalFase" + i);
                    }
                }
                mkt.QverOff(this.config.classe + " .btnVoltar");
                mkt.QverOff(this.config.classe + " .btnAvancar");
                mkt.QverOff(this.config.classe + " .btnConclusivo");
                if (Array.isArray(this.possiveis)) {
                    if (this.possiveis.length >= 0) {
                        if (this.possiveis.indexOf(this.atual) >= this.possiveis.length - 1) {
                            mkt.QverOn(this.config.classe + " .btnConclusivo");
                        }
                        else {
                            mkt.QverOn(this.config.classe + " .btnAvancar");
                        }
                        ;
                        if (this.possiveis.indexOf(this.atual) >= 1) {
                            mkt.QverOn(this.config.classe + " .btnVoltar");
                        }
                        ;
                        mkt.QverOn(this.config.classe + " .modalFase" + this.atual);
                    }
                    else {
                        mkt.w("A array mkt.fase.possiveis não contém opções para dar update.");
                    }
                }
                else {
                    mkt.erro("mkt.fase.possiveis Deve ser uma Array!");
                }
            }
            has(x) {
                return typeof x === "number" && this.possiveis.includes(x);
            }
            toString() {
                return `[${this.possiveis.join()}]`;
            }
            [Symbol.iterator]() {
                let next = 0;
                let last = this.possiveis;
                return {
                    next() {
                        return next < last.length ? { value: last[next++] } : { done: true };
                    },
                    [Symbol.iterator]() {
                        return this;
                    },
                };
            }
        }
        return new FasearMK(possiveis, config);
    };
    static mkInclude = async () => {
        return new Promise((r) => {
            mkt.QAll("body *").forEach(async (e) => {
                let destino = e.getAttribute("mkInclude");
                if (destino != null) {
                    let p = await mkt.get.html({ url: destino, quiet: true });
                    if (p.retorno != null) {
                        e.innerHTML = p.retorno;
                    }
                    else {
                        mkt.l("Falhou ao coletar dados");
                    }
                    r(p.retorno);
                }
            });
        });
    };
    static capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    static vibrar = async (tipo) => {
        if (tipo === false) {
            navigator.vibrate([100, 30, 100, 30, 100]);
        }
        else if (tipo === true) {
            navigator.vibrate([300]);
        }
        else {
            navigator.vibrate([200, 50, 200]);
        }
    };
    static Terremoto = (e = null) => {
        e = mkt.Q(e);
        if (e) {
            e.classList.add("mkTerremoto");
            mkt.wait(500).then(r => {
                e.classList.remove("mkTerremoto");
            });
        }
    };
    static fUIFaseUpdateLinkFase = () => {
        mkt.QAll("ul.mkUlFase li a").forEach((e) => {
            e.parentElement?.classList.remove("mkFaseBack");
            e.parentElement?.classList.remove("mkFaseAtivo");
            e.parentElement?.classList.remove("disabled");
            let eNumPag = Number(e.getAttribute("data-pag"));
            let bLibera = e.getAttribute("data-libera");
            if (mkt.a.mkFaseAtual > eNumPag) {
                e.parentElement?.classList.add("mkFaseBack");
            }
            if (mkt.a.mkFaseAtual == eNumPag) {
                e.parentElement?.classList.add("mkFaseAtivo");
            }
            if (bLibera == "false") {
                e.parentElement?.classList.add("disabled");
            }
        });
    };
    static to64 = (texto = "") => {
        return btoa(encodeURIComponent(texto));
    };
    static from64 = (texto = "") => {
        return decodeURIComponent(atob(texto));
    };
}
Object.keys(mkt).forEach((n) => {
    if (!mkt.a.definePropertyExceptions.includes(n)) {
        Object.defineProperty(mkt, n, { enumerable: false, writable: false, configurable: false });
    }
});
class mkSel extends HTMLElement {
    config = {
        name: "",
        filtrado: "",
        eK: null,
        eV: null,
        eList: null,
        eUL: null,
        rolaCima: null,
        rolaBaixo: null,
        populado: 0,
        vazio: " -- Selecione -- ",
        svg: null,
        scrollcharge: true,
        selapenas: 1,
        _data: new Map(),
        opcoes: "",
        value: "",
        url: "",
        selecionados: new Map(),
        changed: false,
        fail: 0,
        geraInputEvent: () => {
            this.dispatchEvent(new Event("input"));
            this.config.changed = true;
        },
        pesquisaKeyDown: (ev) => {
            let isNegado = false;
            if (ev.key == "Escape") {
                this.config.eK.blur();
            }
            if (ev.key == "ArrowUp" || ev.key == "ArrowDown" || ev.key == "Enter") {
                isNegado = true;
                let eListItem;
                let array = Array.from(this.config.eUL.children).filter((e) => {
                    return e.style.display != "none";
                });
                let eAlvo = array.find((e) => e.getAttribute("m") == "1");
                Array.from(this.config.eUL.children).forEach((e) => e.removeAttribute("m"));
                if (ev.key == "Enter") {
                    if (eAlvo) {
                        this.config.mecanicaSelecionar(eAlvo.getAttribute("k"));
                    }
                    if (this.config.selapenas == 1) {
                        this.config.eK.blur();
                    }
                    else {
                        this.aoFocus();
                    }
                }
                if (ev.key == "ArrowUp") {
                    let ultimo = array[array.length - 1];
                    if (eAlvo) {
                        let indexProximo = array.indexOf(eAlvo) - 1;
                        if (array[indexProximo]) {
                            eListItem = array[indexProximo];
                        }
                        else {
                            eListItem = ultimo;
                        }
                    }
                    else {
                        eListItem = ultimo;
                    }
                    eListItem?.setAttribute("m", "1");
                    let alvoOffsetTop = eListItem?.offsetTop || 0;
                    this.config.eList.scrollTop =
                        alvoOffsetTop - 120 - (this.config.eList.offsetHeight - this.config.eList.clientHeight) / 2;
                }
                if (ev.key == "ArrowDown") {
                    if (eAlvo) {
                        let indexProximo = array.indexOf(eAlvo) + 1;
                        if (array[indexProximo]) {
                            eListItem = array[indexProximo];
                        }
                        else {
                            eListItem = array[0];
                        }
                    }
                    else {
                        eListItem = array[0];
                    }
                    eListItem?.setAttribute("m", "1");
                    let alvoOffsetTop = eListItem?.offsetTop || 0;
                    this.config.eList.scrollTop =
                        alvoOffsetTop - 120 - (this.config.eList.clientHeight - this.config.eList.offsetHeight) / 2;
                }
            }
            if (isNegado) {
                ev.preventDefault();
            }
        },
        convertValueToMap: () => {
            this.config.selecionados.clear();
            if (this.config.selapenas == 1) {
                this.config.selecionados.set(this.value, this.config._data.get(this.value));
                this.config.updateSelecionadosValues();
            }
            else {
                if (this.value) {
                    let obj = this.value.split(",");
                    if (obj) {
                        let map = obj.map(s => { return [s.toString(), ""]; });
                        this.config.selecionados = new Map(map);
                        this.config.updateSelecionadosValues();
                    }
                }
            }
        },
        mecanicaSelecionar: (novoK) => {
            if (novoK != null) {
                let novoV = this.config._data.get(novoK);
                if (mkt.classof(this.config.selapenas) == "Number") {
                    if (this.config.selapenas == 1) {
                        this.config.selecionados = new Map();
                        this.config.selecionados.set(novoK?.toString(), novoV?.toString());
                        this.value = novoK;
                        this.config.updateSelecionadosValues();
                        this.config.geraInputEvent();
                    }
                    else if ((this.config.selapenas > 1) || (this.config.selapenas < 0)) {
                        let jaSelecionado = false;
                        if (this.config.selecionados.has(novoK)) {
                            jaSelecionado = true;
                        }
                        ;
                        if (jaSelecionado) {
                            this.config.selecionados.delete(novoK);
                        }
                        else {
                            if (this.config.selecionados.size < this.config.selapenas || this.config.selapenas < 0) {
                                this.config.selecionados.set(novoK?.toString(), novoV?.toString());
                            }
                        }
                        if (this.config.selecionados.size == 0) {
                            this.value = "";
                        }
                        else {
                            this.value = [...this.config.selecionados.keys()].join(",");
                        }
                        this.config.updateSelecionadosValues();
                        this.config.geraInputEvent();
                    }
                }
                else {
                    mkt.w("mkSelElement - atributo 'selapenas' precisa ser número: ", mkt.classof(this.config.selapenas));
                }
            }
            else {
            }
            this.config.updateSelecionadosValues();
        },
        moveScrollList: (este, num, op) => {
            op ? este.classList.add("move") : este.classList.remove("move");
            this.config.scrollRecursiveMove(este, (4 * num));
        },
        scrollRecursiveMove: (este, num) => {
            this.config.eList.scrollTop = this.config.eList.scrollTop + num;
            if (este.classList.contains("move")) {
                mkt.wait(20).then(r => {
                    this.config.scrollRecursiveMove(este, num);
                });
            }
        },
        updateSelecionadosValues: () => {
            [...this.config.selecionados.keys()].forEach(k => {
                this.config.selecionados.set(k, this.opcoes.get(k));
            });
        },
        checkMaisLinhas: () => {
            let altura = this.config.eList.scrollHeight - this.config.eList.offsetHeight - 10;
            if (this.config.eList.scrollTop >= altura) {
                this.maisLinhas(this.config.populado, 10);
            }
        },
        set: (key, value) => {
            this.config._data.set(key, value);
            this.setAttribute("opcoes", mkt.stringify([...this.config._data]));
        },
        del: (key) => {
            this.config._data.delete(key);
            this.setAttribute("opcoes", mkt.stringify([...this.config._data]));
        },
    };
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        let template = document.createElement("template");
        template.innerHTML = `<style>
:host {
	display: inline-block;
	border: 1px inset #9aa7b3;
	border-radius: 4px;
	background: #EEE;
	width:100%;
	line-height: normal;
	align-content: center;
	align-items: center;
}
:host .setaCima {
	opacity: 0;
	transition: 0.2s ease-in-out;
	transform: translate(0px, 5px);
}
:host .setaBaixo {
	opacity: 1;
	transition: 0.5s ease-in-out;
	transform: translate(0px, 0px);
}
:host([hidden]) {
	display: none;
}
:host([focused]) {
	outline: 1px solid #666;
}
:host([focused]) .setaBaixo {
	opacity: 0;
	transition: 0.2s ease-in-out;
	transform: translate(0px, -5px);
}
:host([focused]) .setaCima {
	opacity: 1;
	transition: 0.5s ease-in-out;
	transform: translate(0px, 0px);
}
:host([focused]) .lista{
	display: block;
}
:host(:not([focused])) *{
	cursor: pointer;
}
:host([disabled]) {
	opacity: 0.4;
	cursor: not-allowed;
	pointer-events: auto;
}
:host([disabled]) *{
	cursor: not-allowed;
	pointer-events: auto;
}
.mkSeletor{
	display:flex;
	width:100%;
	height: 100%;
	min-height: inherit;
}
.mkSeletor input{
	width:100%;
}
.mkSeletor svg{
	width: 14px;
	user-select: none;
  justify-self: end;
}
.lista{
	display: none;
	position: fixed;
	border: 1px solid var(--mkSelListBorder);
	border-radius: 5px;
	cursor: pointer;
	user-select: none;
	max-height: 300px;
	width: max-content;
	z-index: calc(var(--mkSelIndex));
	padding: 2px 1px;
	overflow-y: auto;
	scrollbar-color: #777 transparent;
	scrollbar-width: none;
	background: #FFF;
	background: var(--mkSelListBackground);
	color: var(--mkSelListColor);
	box-shadow: 1px 2px 2px 0px var(--mkSelListBorder);
}
input {
	border: 0px;
	outline: none;
	font: inherit;
	background: inherit;
}
ul,li{
	display: flex;
	flex-direction: column;
	list-style: none;
	padding: 0px;
	margin: 0px;
}
li{
	padding: 3px 0px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
li:not(:first-child){
	border-top: 1px solid #0001;
}
.topoSel li[selecionado]{
	order: -1;
}
li[selecionado]{
	background: var(--fundoItemSelecionado);
  border-left: 3px solid var(--bordaItemSelecionado);
  padding-left: 2px;
  border-radius: 2px;
}
li[selecionado]::before{
	content: "\\2714";
	position: absolute;
	padding: 0px 5px;
	width: 8px;
	height: 15px;
	right: 6px;
}
li[m="1"] {
	background: #ccf;
}
.rolaCima{
	top: 0;
}
.rolaBaixo{
	bottom: 0;
}
.rolaCima,
.rolaBaixo{
	display: flex;
	position: sticky;
	border-radius: 3px;
	z-index:1;
	justify-content: center;
	background-color: #ccc;
}
.rolaCima *,
.rolaBaixo *{
	pointer-events: none;
	padding: 0px 2px;
	height: 14px;
}
</style>
<div class="mkSeletor" part="mkSeletor">
	<input part="k" type="text" placeholder="Filtro \u{1F50D}" value="${this.config.vazio}" class="k" autocomplete="off"/>
	<svg xmlns='http://www.w3.org/2000/svg' class="arrowAbreFecha" part='arrowAbreFecha' viewBox='0 0 16 16'>
	<path class='setaCima' d='M14.6,6.9L8.4,0.7c-0.2-0.2-0.6-0.2-0.9,0L1.4,6.9c-0.2,0.2,0,0.4,0.2,0.4h4.5c0.1,0,0.3-0.1,0.4-0.2L7,6.7C7.5,6.1,8.5,6,9,6.6l0.6,0.6C9.7,7.3,9.9,7.4,10,7.4h4.4C14.6,7.4,14.7,7.1,14.6,6.9z'/>
	<path class='setaBaixo' d='M1.4,8.9l6.1,6.3c0.2,0.2,0.6,0.2,0.9,0l6.1-6.3c0.2-0.2,0-0.4-0.2-0.4H9.9c-0.1,0-0.3,0.1-0.4,0.2L9,9.2C8.5,9.8,7.5,9.9,7,9.3L6.4,8.7C6.3,8.6,6.1,8.5,6,8.5H1.6C1.4,8.5,1.3,8.8,1.4,8.9z'/>
  </svg>
</div>
<div class="lista" part="lista">
<div class="rolaCima" part="rolaCima" style="display: none;">
<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' style='-webkit-box-reflect: left;' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5'/></svg>
<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' style='-webkit-box-reflect: right;' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5'/></svg>
</div>
<ul></ul>
<div class="rolaBaixo" part="rolaBaixo" style="display: none;">
<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' style='-webkit-box-reflect: left;' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1'/></svg>
<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' style='-webkit-box-reflect: right;' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1'/></svg>
</div>
</div>`;
        this.shadowRoot?.append(template.content);
        this.config.eK = this.shadowRoot?.querySelector(".k");
        this.config.eList = this.shadowRoot?.querySelector(".lista");
        this.config.eUL = this.shadowRoot?.querySelector(".lista ul");
        this.config.rolaCima = this.shadowRoot?.querySelector(".rolaCima");
        this.config.rolaBaixo = this.shadowRoot?.querySelector(".rolaBaixo");
        this.config.svg = this.shadowRoot?.querySelector(".arrowAbreFecha");
        if (this.getAttribute("scrollcharge"))
            this.config.scrollcharge = this.getAttribute("scrollcharge")?.toString().toLowerCase() != "false";
        if (this.getAttribute("vazio"))
            this.config.vazio = this.getAttribute("vazio");
        if (this.getAttribute("selapenas"))
            this.config.selapenas = Number(this.getAttribute("selapenas"));
        if (this.getAttribute("name"))
            this.config.name = this.getAttribute("name");
        this.atualizarDisplay();
        this.config.eK.onfocus = () => {
            this.setAttribute("focused", "");
            this.aoFocus();
        };
        this.config.eK.onblur = () => {
            this.aoBlur();
        };
        this.config.eK.oninput = (ev) => {
            ev.stopPropagation();
            this.aoInput();
        };
        this.config.eK.onkeydown = (ev) => {
            this.config.pesquisaKeyDown(ev);
        };
        mkt.Ao("mousedown", this.config.eUL, (e, ev) => {
            this.selecionar(ev);
        });
        this.config.svg.onclick = (ev) => {
            ev.stopPropagation();
            this.config.eK.focus();
        };
        this.config.rolaBaixo.onmouseenter = (ev) => {
            this.config.moveScrollList(this.config.rolaBaixo, 1, true);
        };
        this.config.rolaBaixo.onmouseout = (ev) => {
            this.config.moveScrollList(this.config.rolaBaixo, 1, false);
        };
        this.config.rolaCima.onmouseenter = (ev) => {
            this.config.moveScrollList(this.config.rolaCima, -1, true);
        };
        this.config.rolaCima.onmouseout = (ev) => {
            this.config.moveScrollList(this.config.rolaCima, -1, false);
        };
        document.addEventListener("scroll", (event) => {
            mkt.Reposicionar(this.config.eList, false);
        });
        window.addEventListener("resize", (event) => {
            mkt.Reposicionar(this.config.eList, true);
        });
        this.config.eList.addEventListener("scroll", () => {
            this.config.checkMaisLinhas();
        });
    }
    forceUpdate() {
        this.removeAttribute("focused");
        if (mkt.isJson(this.config.opcoes)) {
            let colect = mkt.parseJSON(this.config.opcoes);
            if (mkt.classof(colect) == "Array") {
                if (mkt.classof(colect[0]) == "Array") {
                    colect.forEach((v, i, a) => {
                        a[i][0] = a[i][0].toString().replaceAll(",", "");
                        a[i][1] = a[i][1].toString();
                    });
                }
                else {
                    if (mkt.classof(colect[0]) == "Object") {
                        colect = colect.map((r) => { return [r.k?.toString().replaceAll(",", ""), r.v?.toString()]; });
                    }
                    else {
                        colect = null;
                    }
                }
            }
            try {
                this.config._data = new Map(colect);
            }
            catch (e) {
                mkt.erro("mk-sel > Opções precisa ser Array. Recebido:", mkt.classof(colect), colect);
            }
        }
        else {
            this.config._data = new Map();
        }
        this.config.eUL.classList.add("topoSel");
        if (mkt.classof(this.config.selapenas) == "Number") {
            if (this.config.selapenas == 1) {
                this.config.selecionados = new Map();
                this.config._data.forEach((v, k) => {
                    if (k == this.value) {
                        this.config.mecanicaSelecionar(k);
                    }
                });
            }
            else {
                if (mkt.isJson(this.value)) {
                    let colect = mkt.parseJSON(this.value);
                    if (mkt.classof(colect) == "Array") {
                        let map = new Map(mkt.parseJSON(this.value).map((a) => { return [a?.toString()]; }));
                        this.config.selecionados = map;
                        this.config.updateSelecionadosValues();
                    }
                    else {
                        if (colect != null) {
                            let array = this.value?.split(",").map((a) => { return [a?.toString()]; });
                            this.config.selecionados = new Map(array);
                            this.config.updateSelecionadosValues();
                        }
                        else {
                            this.config.selecionados = new Map();
                        }
                    }
                }
                else {
                    this.config.selecionados = new Map();
                }
            }
        }
        this.aoPopularLista();
        this.aoAtualizaSelecionadosNaLista();
        this.atualizarDisplay();
    }
    aoFocus() {
        this.config.filtrado = "";
        this.config.eK.value = "";
        this.aoAtualizaSelecionadosNaLista();
        let ePrimeiroSel = null;
        Array.from(this.config.eUL.children).forEach((li) => {
            li.style.display = "";
            li.removeAttribute("cursor");
            if (li.hasAttribute("selecionado") && ePrimeiroSel == null)
                ePrimeiroSel = li;
        });
        let primeiroOffSet = ePrimeiroSel?.offsetTop || 0;
        this.config.eList.scrollTop =
            primeiroOffSet - 120 - (this.config.eList.offsetHeight - this.config.eList.clientHeight) / 2;
        mkt.Reposicionar(this.config.eList, true);
        mkt.a.poppers.get(this.config.eList).update();
        this.config.checkMaisLinhas();
    }
    aoBlur() {
        mkt.wait(150).then(r => {
            if (document.activeElement !== this) {
                this.atualizarDisplay();
                this.removeAttribute("focused");
                if (this.config.changed) {
                    this.config.changed = false;
                    this.dispatchEvent(new Event("change"));
                }
            }
        });
    }
    async aoInput() {
        let strInputado = this.config.eK.value;
        if (this.config.eUL.children.length < this.config._data.size) {
            await this.maisLinhas(this.config.populado, this.config._data.size);
        }
        if (this.pos) {
            let strTratada = encodeURI(mkt.removeAcentos(strInputado));
            if (strTratada.length > 3) {
                if (this.config.url != "") {
                    let novaUrl = this.config.url + "?s=" + strTratada;
                    let r = await mkt.get.json({ url: novaUrl });
                    if (r.retorno != null) {
                        let map = new Map(r.retorno);
                        this.config._data = map;
                        this.opcoes = map;
                        this.config.eK.value = strInputado;
                    }
                }
                else {
                    mkt.w("mkSelElement - Não foi possível fazer o refill: Sem URL setada.");
                }
            }
        }
        let cVisivel = 0;
        this.config.rolaCima.style.display = "none";
        this.config.rolaBaixo.style.display = "none";
        Array.from(this.config.eUL.children).forEach((li) => {
            let exibe = false;
            if (mkt.like(strInputado, li.innerHTML)) {
                exibe = true;
                cVisivel++;
            }
            if (exibe) {
                li.style.display = "";
            }
            else {
                li.style.display = "none";
            }
        });
        if (cVisivel >= 10) {
            this.config.rolaCima.style.display = "";
            this.config.rolaBaixo.style.display = "";
        }
        mkt.Reposicionar(this.config.eList, true);
    }
    async maisLinhas(inicio, total) {
        let linha = document.createElement("template");
        linha.innerHTML = "<li k='${0}'>${1}</li>";
        let hold = document.createElement("template");
        let ate = inicio + total;
        let dados = [...this.config._data];
        if (this.config.name == "multiSelecionado" || this.config.name == "staPersonalizado") {
            this.config.selecionados.keys().forEach((k) => {
                let indexof = dados.findIndex(o => { return o[0] == k; });
                if (indexof >= 0) {
                    dados.unshift(dados.splice(indexof, 1)[0]);
                }
            });
        }
        let dadosFiltrado = dados.slice(inicio, ate);
        this.config.populado = Math.max(this.config.populado, ate);
        await mkt.moldeOA(dadosFiltrado, linha, hold);
        this.config.eUL.append(hold.content.cloneNode(true));
        this.config.rolaCima.style.display = "none";
        this.config.rolaBaixo.style.display = "none";
        if (this.config.eUL.children.length >= 10) {
            this.config.rolaCima.style.display = "";
            this.config.rolaBaixo.style.display = "";
        }
        this.aoAtualizaSelecionadosNaLista();
        return this.config.populado;
    }
    async aoPopularLista() {
        this.config.convertValueToMap();
        this.config.eUL.innerHTML = "";
        this.config.populado = 0;
        if (mkt.classof(this.config._data) == "Map") {
            if (this.config.scrollcharge) {
                await this.maisLinhas(this.config.populado, 10);
            }
            else {
                await this.maisLinhas(this.config.populado, this.config._data.size);
            }
        }
    }
    selecionar(ev) {
        let li = ev.target;
        if (li) {
            let novoK = li.getAttribute("k");
            this.config.mecanicaSelecionar(novoK);
            if (mkt.classof(this.config.selapenas) == "Number") {
                if (this.config.selapenas != 1) {
                    this.config.eK.focus();
                }
            }
            this.aoAtualizaSelecionadosNaLista();
        }
        else {
            mkt.w("Evento sem Target: ", ev);
        }
    }
    aoAtualizaSelecionadosNaLista() {
        if (this.config.selapenas == 1) {
            Array.from(this.config.eUL.children).forEach((li) => {
                if (this.config.selecionados.has(li.getAttribute("k"))) {
                    li.setAttribute("selecionado", "");
                }
                else {
                    li.removeAttribute("selecionado");
                }
            });
        }
        else {
            Array.from(this.config.eUL.children).forEach((li) => {
                if (this.config.selecionados.has(li.getAttribute("k"))) {
                    li.setAttribute("selecionado", "");
                }
                else {
                    li.removeAttribute("selecionado");
                }
            });
        }
    }
    atualizarDisplay = async () => {
        this.classList.remove("mkEfeitoPulsar");
        let display = " -- Selecione -- ";
        if (this.config.vazio) {
            display = this.config.vazio;
        }
        if (this.config.selecionados.size != 0) {
            if (this.config.selapenas == 1) {
                if (this.getFirstSelecionado?.[1]) {
                    display = this.getFirstSelecionado?.[1];
                }
                else {
                    if (this.getFirstSelecionado?.[0] !== "") {
                        display = null;
                    }
                }
            }
            else {
                display = `${this.config.selecionados.size} selecionados`;
            }
        }
        else {
            if (this.config.selapenas != 1) {
                display = `0 selecionados`;
            }
        }
        ;
        if (!display) {
            ++this.config.fail;
            display = " -- Erro -- ";
            this.classList.add("mkEfeitoPulsar");
            if (this.config.fail == 2) {
                mkt.w(this.config.name, "mkSel - Opção Inexistente:", this.value, ". Limpeza forçada. Tentativa: ", this.config.fail);
                this.removeAttribute("value");
            }
            if (this.config.fail < 4) {
                mkt.wait(20).then(r => {
                    this.forceUpdate();
                });
            }
        }
        else {
            this.config.fail = 0;
        }
        ;
        this.config.eK.value = display;
        if (this.config._data.size <= 0) {
        }
    };
    async refill(url = null) {
        let urlExecutar = this.config.url;
        if (url != null) {
            urlExecutar = urlExecutar + url;
        }
        if (urlExecutar) {
            let r = await mkt.get.json({ url: urlExecutar });
            if (r.retorno != null) {
                this.setAttribute("opcoes", mkt.stringify(r.retorno));
                this.dispatchEvent(new CustomEvent("refill"));
            }
        }
        else {
            mkt.w("mkSelElement - Não foi possível fazer o refill: Sem URL setada: ", urlExecutar);
        }
    }
    geraListaAntesDoElemento() {
        let divLabelsSelecionadas = document.createElement("ul");
        divLabelsSelecionadas.setAttribute("class", "mkSelOutDisplay");
        let valoresNotNull = [...this.selecionadosMap.values()].filter((i) => i != null);
        divLabelsSelecionadas.innerHTML = valoresNotNull.map((i) => "<li>" + i + "</li>").join("");
        this.before(divLabelsSelecionadas);
        mkt.Ao("input", this, (e) => {
            e.updateListaAntesDoElemento(divLabelsSelecionadas);
        });
    }
    updateListaAntesDoElemento(e) {
        e.innerHTML = [...this.selecionadosMap.values()].map((i) => "<li>" + i + "</li>").join("");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "disabled") {
            this.config.eK.disabled = newValue !== null;
            this.config.eK.blur();
        }
        else if (name === "size") {
            this.config.eK.size = newValue;
        }
        else if (name === "name") {
            this.config.name = newValue;
        }
        else if (name === "value") {
            if (this.config.value != newValue) {
                this.config.value = newValue;
                this.config.convertValueToMap();
                this.atualizarDisplay();
            }
        }
        else if (name === "opcoes") {
            if (this.getAttribute("opcoes")) {
                this.opcoes = this.getAttribute("opcoes");
            }
            this.removeAttribute("opcoes");
        }
        else if (name === "url") {
            this.url = newValue;
        }
        else if (name === "pos") {
            if (mkt.classof(this.config.url) == "String") {
                this.config.eK.placeholder = "Pesquisar 🔍";
                this.config.vazio = "Pesquisar 🔍";
                this.atualizarDisplay();
            }
            else {
                mkt.w("mkSelElement - Seletor Pós precisam de uma URL para consulta: ", this.config.url);
                this.removeAttribute("pos");
            }
        }
        else if (name === "refill") {
            this.removeAttribute("refill");
            if (newValue == null) {
                this.refill();
            }
        }
        else if (name === "scrollbarwidth") {
            this.config.eList.style.scrollbarWidth = newValue;
        }
        else if (name === "scrollbarcolor") {
            this.config.eList.style.scrollbarColor = newValue;
        }
        else if (name === "selapenas") {
            this.config.selapenas = Number(newValue);
        }
        else if (name === "class") {
            if (this.classList.contains("atualizar")) {
                this.classList.remove("atualizar");
                this.event;
            }
        }
    }
    get getFirstSelecionado() { return [...this.selecionadosMap]?.[0] || null; }
    get selecionadosMap() { return this.config.selecionados; }
    get values() { return [...this.selecionadosMap.values()]; }
    get valuesOk() { return this.values.map(i => { if (i) {
        return mkt.removeEspecias(i).toLowerCase();
    }
    else {
        return "";
    } }); }
    get keys() { return [...this.selecionadosMap.keys()]; }
    get opcoes() { return this.config._data; }
    set opcoes(text) {
        if (text) {
            if (mkt.classof(text) == "String") {
                this.config.opcoes = text;
                this.forceUpdate();
            }
            else {
                if (mkt.classof(text) == "Map") {
                    this.config.opcoes = mkt.stringify([...text]);
                    this.forceUpdate();
                }
                else {
                    mkt.w("mkSelElement - set opcoes() - Formato inválido: ", mkt.classof(text));
                }
            }
        }
    }
    get event() { return this.config.geraInputEvent(); }
    get url() { return this.config.url; }
    set url(text) { if (text != null)
        this.config.url = text; }
    get size() { return this.getAttribute("size"); }
    set size(value) { if (value)
        this.setAttribute("size", value); }
    get disabled() { return this.hasAttribute("disabled"); }
    set disabled(value) {
        if (value)
            this.setAttribute("disabled", "");
        else
            this.removeAttribute("disabled");
    }
    get pos() { return this.hasAttribute("pos"); }
    set pos(value) {
        if (value)
            this.setAttribute("pos", "");
        else
            this.removeAttribute("pos");
    }
    get value() {
        if (this.getAttribute("value") == null) {
            return "";
        }
        return this.getAttribute("value");
    }
    set value(text) {
        if (text != null) {
            this.setAttribute("value", text);
        }
    }
    get name() { return this.getAttribute("name"); }
    set name(text) { if (text) {
        this.setAttribute("name", text);
    } }
    get [Symbol.toStringTag]() { return "mkSelElement"; }
    static observedAttributes = ["disabled", "size", "value", "name", "opcoes", "url", "scrollbarwidth", "scrollbarcolor", "selapenas", "refill", "pos", "class"];
}
customElements.define("mk-sel", mkSel);
class mkBot extends HTMLElement {
    config = {
        dados: null,
        area: null,
        sobreposto: null,
        clicavel: false,
        exibirbarra: false,
    };
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        let template = document.createElement("template");
        template.innerHTML = `<style>
:host {
	display: flex;
	border-radius: 8px;
	background: #0008;
	width:100%;
	height: 100%;
	cursor: pointer;
	padding: 0px;
  margin: 0px;
	transition: 0.2s;
  user-select: none;
	box-shadow: 1px 2px 2px 0px #0009;
	overflow: hidden;
}
:host(:hover){
	border: 1px inset #999;
	transform: translate(1px, 1px);
	box-shadow: 0px -1px 2px 0px #0009;
}
.all{
	display: flex;
	border-radius: inherit;
	justify-content: center;
	width: 100%;
	height: 100%;
	position: relative;
}
.area{
	border-radius: 3px;
	overflow: hidden;
	box-shadow: 0px 0px 2px 0px #0009;
	width: 100%;
	height: 100%;
}
.imagem{
	object-fit: contain;
	border-radius: inherit;
	width: 100%;
	height: 100%;
}
.sobreposto{
	position: absolute;
	background: transparent;	
	width: 100%;
	height: 100%;
}
</style>
<div class="all">
<div class="area" part="area"></div>
<div class='sobreposto' style="display: none;"></div>
`;
        this.shadowRoot?.append(template.content);
        this.config.area = this.shadowRoot?.querySelector(".area");
        this.config.sobreposto = this.shadowRoot?.querySelector(".sobreposto");
        this.config.name = this.getAttribute("name");
        this.config.inicial = this.getAttribute("inicial");
        this.removeAttribute("inicial");
        this.config.dados = this.getAttribute("value");
        this.removeAttribute("value");
        this.config.clicavel = this.hasAttribute("clicavel");
        this.removeAttribute("clicavel");
        this.config.exibirbarra = this.hasAttribute("exibirbarra");
        this.removeAttribute("exibirbarra");
        if (this.config.inicial == null)
            this.config.inicial = "";
        if (this.config.dados == null)
            this.config.dados = "";
        this.editou("#BUILD");
    }
    editou(from) {
        if (this.config.dados == "") {
            if (this.config.inicial == "") {
                this.config.area.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' class='imagem' part='imagem' viewBox='0 0 24 24' fill='none'><path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 12v7a2 2 0 0 1-2 2h-3m5-9c-6.442 0-10.105 1.985-12.055 4.243M21 12v-1.5M3 16v3a2 2 0 0 0 2 2v0h11M3 16V5a2 2 0 0 1 2-2h8M3 16c1.403-.234 3.637-.293 5.945.243M16 21c-1.704-2.768-4.427-4.148-7.055-4.757M8.5 7C8 7 7 7.3 7 8.5S8 10 8.5 10 10 9.7 10 8.5 9 7 8.5 7zM19 2v3m0 3V5m0 0h3m-3 0h-3'/></svg>";
            }
            else {
                this.config.area.innerHTML = "<img class='imagem' part='imagem' src='" + this.config.inicial + "'>";
            }
        }
        else {
            let tipo = null;
            let retornar = "";
            let terminacao = this.config.dados.slice(this.config.dados.length - 3, this.config.dados.length).toString().toLowerCase();
            if ((this.config.dados.includes("application/pdf")) || (terminacao == "pdf")) {
                tipo = "pdf";
            }
            if (tipo == "pdf") {
                retornar += `<embed type="application/pdf" class="imagem" part="imagem" src="${this.config.dados}`;
                if (!this.config.exibirbarra) {
                    retornar += `#toolbar=0`;
                }
                retornar += `">`;
            }
            else {
                retornar = `<img src="${this.config.dados}" class="imagem" alt="Imagem" onerror="this.onerror=null;this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktaW1hZ2UtYWx0IiB2aWV3Qm94PSIwIDAgMTYgMTYiPg0KICA8cGF0aCBkPSJNNyAyLjVhMi41IDIuNSAwIDEgMS01IDAgMi41IDIuNSAwIDAgMSA1IDBtNC4yMjUgNC4wNTNhLjUuNSAwIDAgMC0uNTc3LjA5M2wtMy43MSA0LjcxLTIuNjYtMi43NzJhLjUuNSAwIDAgMC0uNjMuMDYyTC4wMDIgMTN2MmExIDEgMCAwIDAgMSAxaDE0YTEgMSAwIDAgMCAxLTF2LTQuNXoiLz4NCjwvc3ZnPg==';" />`;
            }
            if (!this.config.clicavel) {
                this.config.sobreposto.style.display = "";
            }
            this.config.area.innerHTML = retornar;
        }
    }
    get [Symbol.toStringTag]() { return "mk-bot"; }
    get value() {
        if (this.config.dados == null)
            return "";
        return this.config.dados;
    }
    set value(text) {
        if (text != null) {
            this.config.dados = text;
            this.editou("#VALUE");
            this.dispatchEvent(new Event("input"));
            this.dispatchEvent(new Event("change"));
            this.classList.add("changed");
        }
        ;
    }
    get name() { return this.getAttribute("name"); }
    set name(text) { if (text) {
        this.setAttribute("name", text);
    } }
    get disabled() { return this.hasAttribute("disabled"); }
    set disabled(value) {
        if (value)
            this.setAttribute("disabled", "");
        else
            this.removeAttribute("disabled");
    }
    get inicial() {
        if (this.config.inicial == null)
            return "";
        return this.config.inicial;
    }
    set inicial(text) {
        if (text != null) {
            this.config.inicial = text;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "value") {
            if (newValue != "" && newValue != null) {
                if (this.config.dados != newValue) {
                    this.value = newValue;
                }
                this.removeAttribute("value");
            }
        }
        else if (name === "name") {
            this.config.name = newValue;
        }
        else if (name === "inicial") {
            if (this.config.inicial != newValue) {
                this.config.inicial = newValue;
            }
        }
    }
    static observedAttributes = ["disabled", "value", "name", "inicial"];
}
customElements.define("mk-bot", mkBot);
mkt.Inicializar();
