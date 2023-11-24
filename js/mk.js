"use strict";
// Transformar para uma unidade / modulado. Dependencias diretas/indiretas:
// - $ JQuery Framework JS
// - $ Mask
// - $ Print
// - $ Unobtrutive Validate (Está vinculado ao Data Annotation do C#)
// - Bootstrap Toast
// - Bootstrap Dropdown (quase)
// - Bootstrap Modal
// - Poper
var mkt; // Variavel de Testes;
var mkt2; // Variavel de Testes;
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			CLASSE MK Instanciavel			\\
//___________________________________\\
class mk {
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			PROPRIEDADES								\\
    //___________________________________\\
    // Armazenadores
    dadosFull = []; // Todos os dados sem filtro, mas ordenaveis.
    dadosFiltrado = []; // Mesmos dadosFull, mas após filtro.
    dadosExibidos = []; // Clonado de dadosFiltrado, mas apenas os desta pagina.
    alvo = {}; // Guarda o objeto selecionado permitindo manupular outro dado com este de referencia.
    thisListNum = 0;
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			CONSTRUTOR (contrutor)			\\
    //___________________________________\\
    // É possível construir o objeto usando undefined ou null para atingir os valores padrão.
    constructor(urlOrigem = mk.delUrlQuery(window.location.href) + "/GetList", todaListagem = ".divListagemContainer", idModelo = "#modelo", filtro = ".iConsultas", arg = null) {
        this.thisListNum = ++mk.contaListas;
        if (idModelo == null || idModelo == "")
            idModelo = "#modelo";
        // ReSET dos parametros (Null para Valor Padrão)
        if (urlOrigem == null || urlOrigem === "") {
            urlOrigem = (mk.delUrlQuery(window.location.href) + "/GetList").replaceAll("//GetList", "/GetList");
        }
        else {
            if (typeof urlOrigem == "string") {
                urlOrigem = urlOrigem.replaceAll("//GetList", "/GetList");
            }
        }
        if (todaListagem == null || todaListagem == "")
            todaListagem = ".divListagemContainer";
        if (filtro == null || filtro == "")
            filtro = ".iConsultas";
        // Objeto de parametros
        if (arg == null)
            arg = {};
        if (arg.importar == null)
            arg.importar = false;
        if (arg.aoReceberDados == null)
            arg.aoReceberDados = mk.aoReceberDados;
        if (arg.modicaFiltro == null)
            arg.modicaFiltro = this.modicaFiltro;
        if (arg.antesDePopularTabela == null)
            arg.antesDePopularTabela = mk.antesDePopularTabela;
        if (arg.aoCompletarExibicao == null)
            arg.aoCompletarExibicao = mk.aoCompletarExibicao;
        if (arg.keys == null)
            arg.keys = [];
        // Setando Config
        this.listagemConfigurar(urlOrigem, todaListagem, idModelo, filtro, arg);
        this.aoReceberDados = arg.aoReceberDados;
        this.modicaFiltro = arg.modicaFiltro;
        this.antesDePopularTabela = arg.antesDePopularTabela;
        this.aoCompletarExibicao = arg.aoCompletarExibicao;
        // Finaliza Contrutor chamando o método de coleta
        this.getList(arg.importar);
    }
    // Fn Individuais da Listagem.
    aoReceberDados = (objeto) => {
        return objeto;
    };
    antesDePopularTabela = () => { };
    modicaFiltro = (obj) => {
        let resultado = true;
        //if(obj.X == "Y") return false;
        return resultado;
    };
    aoCompletarExibicao = () => { };
    antesDeOrdenar = () => { };
    // Por garantia a funcao async para o carregador da lista esperar a funcao concluir.
    antesDeOrdenarAsync = async () => {
        return new Promise((r) => {
            this.antesDeOrdenar();
            r(true);
        });
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			CONFIGURACOES								\\
    //___________________________________\\
    c = {
        objFiltro: {},
        divTabela: ".divListagemContainer",
        urlOrigem: "",
        pagAtual: 1,
        tablePorPagina: null,
        tableTotal: null,
        sortBy: "",
        sortDir: false,
        totalFull: this.dadosFull.length,
        totalFiltrado: this.dadosFiltrado.length,
        totalExibidos: this.dadosExibidos.length,
        pagPorPagina: 5,
        pagItensIni: 0,
        pagItensFim: 0,
        totPags: 0,
        pk: null, // Possivel setar o nome do campo que é primary key já na construcao
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			LISTAGEM										\\
    //___________________________________\\
    // Seta as variaveis de uso interno.
    listagemConfigurar = (urlOrigem, todaListagem, idModelo, fTag, arg) => {
        this.c.urlOrigem = urlOrigem;
        this.c.filtro = fTag;
        this.c.divTabela = todaListagem;
        this.c.idModelo = idModelo;
        this.c.tbody = todaListagem + " tbody";
        this.c.ths = todaListagem + " th";
        this.c.pagBotoes = todaListagem + " .pagBotoes";
        this.c.tableResultado = todaListagem + " .tableResultado";
        this.c.tablePorPagina = todaListagem + " input[name='tablePorPagina']";
        this.c.tableExibePorPagina = todaListagem + " .tableExibePorPagina";
        this.c.tableTotal = this.c.divTabela + " .tableTotal";
        this.c.tableFiltrado = this.c.divTabela + " .tableFiltrado";
        this.c.tableIni = this.c.divTabela + " .tableIni";
        this.c.tableFim = this.c.divTabela + " .tableFim";
        this.c.tableInicioFim = this.c.divTabela + " .tableInicioFim";
        this.c.pag = this.c.pagBotoes + " .pag";
        this.c.pagBotao = this.c.pagBotoes + " .pagBotao";
        this.c.m = arg.keys;
        // Primary Key
        if (!arg.pk) {
            // PrimaryKey do Parametro tem preferência sobre Modelo.
            // Quando PrimaryKey não informada no parametro, tentar usar a do modelo.
            this.c.pk = mk.Q(idModelo)?.getAttribute("pk");
            // Quando Não está nem no parametro e nem no modelo, padrão "pk";
            if (!this.c.pk)
                this.c.pk = "pk";
        }
        else {
            this.c.pk = arg.pk;
        }
        let sortBy = mk.Q(idModelo)?.getAttribute("ob");
        if (!sortBy)
            sortBy = this.c.pk;
        let sortDir = mk.Q(idModelo)?.getAttribute("od");
        if (!sortDir)
            sortDir = 1;
        this.setDirSort(sortBy, Number(sortDir));
    };
    // Iterator
    [Symbol.iterator]() {
        let iteratorArray = this.dadosFull[Symbol.iterator]();
        // Iteration result
        return {
            next() {
                return iteratorArray.next();
            },
            // Iterable
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    // Criar eventos para UI permitindo o usuario interagir com a tabela.
    configurarUI = () => {
        if (mk.Q(this.c.divTabela)) {
            // Seta Gatilho dos botoes de paginacao.
            mk.QAll(this.c.pagBotao).forEach((li) => {
                li.addEventListener("click", (ev) => {
                    this.mudaPag(ev.target);
                });
            });
            // Seta Gatilho do indicador de quantidade por pagina.
            if (mk.Q(this.c.tablePorPagina)) {
                mk.Ao("input", this.c.tablePorPagina, async () => {
                    this.atualizaNaPaginaUm();
                });
            }
            this.ativarSort();
        }
    };
    // Metodo que prepara a listagem e inicia a coleta.
    getList = async (importar = false) => {
        // Verifica e importa resumo da tabela se necessario.
        if (importar)
            await mk.importar(this.c.divTabela);
        this.configurarUI();
        // Caso o receba uma array na url, os dados já estão aqui.
        let temosDados = null;
        if (Array.isArray(this.c.urlOrigem)) {
            temosDados = mk.clonar(this.c.urlOrigem);
        }
        else {
            // Inicia o Coleta de dados
            let pac = await mk.get.json(this.c.urlOrigem);
            if (pac.retorno != null) {
                temosDados = pac.retorno;
            }
        }
        if (temosDados != null) {
            // Limpar Dados nulos
            mk.mkLimparOA(temosDados);
            // Executa funcao personalizada por página
            mk.mkExecutaNoObj(temosDados, this.aoReceberDados);
            // Armazena em 1 array que está em 2 locais na memória
            this.dadosFull = this.dadosFiltrado = temosDados;
            // Executa função antes de ordenar a tabela (Util para calcular coisas no conteudo recebido)
            await this.antesDeOrdenarAsync();
            // Ordena a lista geral com base na primeira propriedade.
            mk.ordenamento(this.dadosFull, this.c.sortBy, this.c.sortDir);
            //Adiciona eventos aos botões do filtro
            this.setFiltroListener();
            // Executa um filtro inicial e na sequencia processa a exibição.
            this.updateFiltro();
            this.efeitoSort();
            // Remove oculto, caso encontre a tag
            if (mk.Q(this.c.tableResultado))
                mk.Q(this.c.tableResultado).classList.remove("oculto");
        }
    };
    /**
     * ATUALIZA a listagem com os dados ja ordenados.
     * Executa a filtragem dos dados;
     */
    atualizarListagem = async () => {
        let pagBotoes = mk.Q(this.c.pagBotoes);
        // Processo de filtro que usa o objFiltro nos dadosFull e retorna dadosFiltrado já filtrado.
        this.dadosFiltrado = mk.processoFiltragem(this.dadosFull, this.c.objFiltro, this);
        // Processar calculos de paginacao
        this.atualizarStatusListagem();
        // Apenas executa a atualização do resumo, se a pagBotoes estiver presente na página.
        if (this.c.totalFiltrado > this.c.pagPorPagina)
            pagBotoes?.removeAttribute("hidden");
        else
            pagBotoes?.setAttribute("hidden", "");
        if (this.c.totalFiltrado == 0) {
            mk.Q(this.c.tableInicioFim)?.setAttribute("hidden", "");
            mk.Q(this.c.tableExibePorPagina)?.setAttribute("hidden", "");
            mk.Q(this.c.tbody)?.setAttribute("hidden", "");
            this.dadosExibidos = [];
        }
        else {
            if (pagBotoes) {
                mk.Q(this.c.tableInicioFim)?.removeAttribute("hidden");
                mk.Q(this.c.tableExibePorPagina)?.removeAttribute("hidden");
                this.processoPaginar();
            }
            else {
                // Caso não tenha onde paginar, exibe geral sem clonar.
                this.dadosExibidos = this.dadosFiltrado;
            }
            mk.Q(this.c.tbody)?.removeAttribute("hidden");
            this.antesDePopularTabela();
            await mk.mkMoldeOA(this.dadosExibidos, this.c.idModelo, this.c.tbody);
            this.aoCompletarExibicao();
        }
    };
    // Atualiza o objeto que contem os dados desta instancia.
    atualizarStatusListagem = () => {
        if (mk.Q(this.c.tablePorPagina) == null) {
            this.c.pagPorPagina = 5;
        }
        else {
            this.c.pagPorPagina = Number(mk.Q(this.c.tablePorPagina).value);
        }
        this.c.totalFull = this.dadosFull.length;
        this.c.totalFiltrado = this.dadosFiltrado.length;
        this.c.totalExibidos = this.dadosExibidos.length;
        this.c.pagItensIni = (this.c.pagAtual - 1) * this.c.pagPorPagina + 1; // Calculo Pagination
        this.c.pagItensFim = this.c.pagItensIni + (this.c.pagPorPagina - 1); // Calculo genérico do último
        if (this.c.pagItensFim > this.c.totalFiltrado)
            this.c.pagItensFim = this.c.totalFiltrado; // Na última página não pode exibir o valor genérico.
        // Arredondar pra cima, pois a última página pode exibir conteúdo sem preencher o PorPagina
        this.c.totPags = Math.ceil(this.dadosFiltrado.length / this.c.pagPorPagina);
        // Atualizar o Status processado no resumo da tabela
        mk.html(this.c.tableTotal, this.c.totalFull.toString());
        mk.html(this.c.tableFiltrado, this.c.totalFiltrado.toString());
        mk.html(this.c.tableIni, this.c.pagItensIni.toString());
        mk.html(this.c.tableFim, this.c.pagItensFim.toString());
    };
    // Retorna a pagina 1 e atualiza
    atualizaNaPaginaUm = async () => {
        this.c.pagAtual = 1;
        this.atualizarListagem();
    };
    // Gatilho para trocar a pagina
    mudaPag = (e) => {
        if (e.classList.contains("pag0")) {
            // Anterior
            if (this.c.pagAtual >= 2)
                this.c.pagAtual -= 1;
        }
        else if (e.classList.contains("pag8")) {
            // Proximo
            this.c.pagAtual += 1;
        }
        else {
            this.c.pagAtual = Number(e.innerHTML);
        }
        this.atualizarListagem();
    };
    // Monta os botoes de numero de pagina
    processoPaginar = () => {
        // Links
        mk.html(this.c.pag + "7", this.c.totPags.toString());
        this.c.pagAtual == 1 ? mk.Qoff(this.c.pag + "0") : mk.Qon(this.c.pag + "0");
        if (this.c.totPags > 1) {
            mk.QverOn(this.c.pag + "0");
            mk.QverOn(this.c.pag + "8");
            mk.QverOn(this.c.pag + "7");
        }
        else {
            mk.QverOff(this.c.pag + "0");
            mk.QverOff(this.c.pag + "8");
            mk.QverOff(this.c.pag + "7");
        }
        this.c.pagAtual >= this.c.totPags
            ? mk.Qoff(this.c.pag + "8")
            : mk.Qon(this.c.pag + "8");
        mk.QverOn(this.c.pag + "1");
        this.c.totPags > 2
            ? mk.QverOn(this.c.pag + "2")
            : mk.QverOff(this.c.pag + "2");
        this.c.totPags > 3
            ? mk.QverOn(this.c.pag + "3")
            : mk.QverOff(this.c.pag + "3");
        this.c.totPags > 4
            ? mk.QverOn(this.c.pag + "4")
            : mk.QverOff(this.c.pag + "4");
        this.c.totPags > 5
            ? mk.QverOn(this.c.pag + "5")
            : mk.QverOff(this.c.pag + "5");
        this.c.totPags > 6
            ? mk.QverOn(this.c.pag + "6")
            : mk.QverOff(this.c.pag + "6");
        if (this.c.pagAtual < 5 || this.c.totPags == 5 || this.c.totPags == 6) {
            // INI
            mk.Qon(this.c.pag + "2");
            mk.html(this.c.pag + "2", "2");
            mk.html(this.c.pag + "3", "3");
            mk.html(this.c.pag + "4", "4");
            mk.html(this.c.pag + "5", "5");
            mk.html(this.c.pag + "6", "...");
            mk.Qoff(this.c.pag + "6");
        }
        else {
            // END
            if (this.c.totPags - this.c.pagAtual < 4) {
                mk.Qoff(this.c.pag + "2");
                mk.html(this.c.pag + "2", "...");
                mk.html(this.c.pag + "3", (this.c.totPags - 4).toString());
                mk.html(this.c.pag + "4", (this.c.totPags - 3).toString());
                mk.html(this.c.pag + "5", (this.c.totPags - 2).toString());
                mk.html(this.c.pag + "6", (this.c.totPags - 1).toString());
                mk.Qon(this.c.pag + "6");
            }
            else {
                // MID
                mk.Qoff(this.c.pag + "2");
                mk.html(this.c.pag + "2", "...");
                mk.html(this.c.pag + "3", (this.c.pagAtual - 1).toString());
                mk.html(this.c.pag + "4", this.c.pagAtual.toString());
                mk.html(this.c.pag + "5", (this.c.pagAtual + 1).toString());
                mk.html(this.c.pag + "6", "...");
                mk.Qoff(this.c.pag + "6");
            }
        }
        // Ativar Pagina
        mk.QAll(this.c.pagBotao).forEach((li) => {
            li.classList.remove("ativo");
            if (this.c.pagAtual == Number(li.innerHTML)) {
                li.classList.add("ativo");
            }
        });
        // Limpar Exibidos
        this.dadosExibidos = [];
        // Clonar Exibidos de Filtrados
        this.dadosFiltrado.forEach((o, i) => {
            if (i + 1 >= this.c.pagItensIni && i + 1 <= this.c.pagItensFim) {
                this.dadosExibidos.push(mk.clonar(o));
            }
        });
    };
    // Limpa e Gera Filtro. Padrao class ".iConsultas".
    updateFiltro = () => {
        // Limpa filtro atual
        this.c.objFiltro = {};
        // Gera filtro os nos campos
        mk.QAll(this.c.filtro).forEach((e) => {
            this.gerarFiltro(e);
        });
        this.atualizaNaPaginaUm();
    };
    // Gerar Filtro baseado nos atributos do MKF gerados no campo.
    gerarFiltro = (e) => {
        // Para ignorar filtro: data-mkfignore="true" (Ou nao colocar o atributo mkfformato no elemento)
        if (e.value != null && e.getAttribute("data-mkfignore") != "true") {
            this.c.objFiltro[e.name] = {
                formato: e.getAttribute("data-mkfformato"),
                operador: e.getAttribute("data-mkfoperador"),
                conteudo: e.value,
            };
        }
        // Limpar filtro caso o usuario limpe o campo
        if (this.c.objFiltro[e.name]["conteudo"] == "" ||
            this.c.objFiltro[e.name]["conteudo"] == "0" ||
            this.c.objFiltro[e.name]["conteudo"] == 0 ||
            this.c.objFiltro[e.name]["conteudo"] === null) {
            delete this.c.objFiltro[e.name];
        }
    };
    // Gerar Gatilhos de FILTRO
    setFiltroListener = () => {
        mk.QAll(this.c.filtro).forEach((e) => {
            e.addEventListener("input", () => {
                this.gerarFiltro(e);
                this.atualizaNaPaginaUm();
            });
        });
    };
    // Gera Listeners na THEAD da tabela (Requer classe: "sort-campo")
    ativarSort = () => {
        let eTrHeadPai = mk.Q(this.c.divTabela + " thead tr");
        Array.from(eTrHeadPai.children).forEach((th) => {
            let ordenar = false;
            th.classList.forEach((classe) => {
                // Verifica se contém sort- no inicio da class
                if (classe.indexOf("sort-") == 0) {
                    ordenar = classe;
                }
            });
            if (ordenar != false) {
                let campo = ordenar.replace("sort-", "");
                if (campo != "") {
                    mk.Ao("click", this.c.divTabela + " thead .sort-" + campo, () => {
                        this.orderBy(campo);
                    });
                }
            }
        });
    };
    // Direção 0: Crescente
    // Direção 1: Decrescente
    // Direção 2: Toogle
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
        //mk.l("By: ", this.c.sortBy, " | Dir: ", this.c.sortDir);
    };
    // Ordena a lista e atualiza (Direcao: 0,1,2(toogle))
    orderBy = (propriedade, direcao = 2) => {
        // Atualiza atual Sort
        this.setDirSort(propriedade, Number(direcao));
        // Executa Ordenador da lista principal
        this.dadosFull = mk.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
        // Atualiza classes indicadoras de ordem
        this.efeitoSort();
        this.atualizarListagem();
    };
    efeitoSort = () => {
        // Limpa efeito
        let thsAll = mk.QAll(this.c.ths);
        if (thsAll.length != 0) {
            thsAll.forEach((th) => {
                th.classList.remove("mkEfeitoDesce");
                th.classList.remove("mkEfeitoSobe");
            });
        }
        // Busca elemento que está sendo ordenado
        let thsSort = mk.QAll(this.c.ths + ".sort-" + this.c.sortBy);
        if (thsSort.length != 0) {
            thsSort.forEach((thSort) => {
                if (this.c.sortDir == 1) {
                    thSort.classList.add("mkEfeitoDesce");
                }
                else {
                    thSort.classList.add("mkEfeitoSobe");
                }
            });
        }
    };
    // LIMPAR FILTRO  LimparFiltro("#consulta_form"); //Passar o form que contem os SELECT/INPUT de filtro (search).
    clearFiltro = () => {
        this.c.objFiltro = {};
        // RESET Form (Limpar seria "0" / "") (Set e.defaultValue)
        mk.QAll(this.c.filtro).forEach((e) => {
            e.value = "";
        });
        // Solicita Atualizacao de todos mkSel
        mk.QAll(this.c.filtro + ".mkSel").forEach((mkSel) => {
            mkSel.classList.add("atualizar");
        });
    };
    // LIMPAR FILTRO  LimparFiltro("#consulta_form"); //Passar o form que contem os SELECT/INPUT de filtro (search).
    clearFiltroUpdate = () => {
        this.clearFiltro();
        this.atualizarListagem();
    };
    // Retorna o último objeto da lista onde a chave primaria bateu.
    getObj = (valorKey) => {
        let temp = null;
        if (Array.isArray(this.dadosFull)) {
            this.dadosFull.forEach((o) => {
                if (o[this.c.pk] == valorKey) {
                    temp = o;
                }
            });
        }
        return temp;
    };
    // Retorna uma lista de todos objetos encontrados onde o KV bateu.
    getObjs = (k, v) => {
        let array = [];
        let errNotPresent = false;
        let errKeyInvalid = false;
        if (Array.isArray(this.dadosFull)) {
            if (typeof k === "string") {
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
            mk.w("Erro getObjs(): Key não está presente em um ou mais objetos.");
        if (errKeyInvalid)
            mk.w("Erro getObjs(): Key precisa ser no formato string.");
        return array;
    };
    setObj = (v, objeto) => {
        let temp = null;
        if (Array.isArray(this.dadosFull)) {
            let o = this.find(this.c.pk, v);
            if (o) {
                if (typeof objeto == "object") {
                    for (let p in objeto) {
                        o[p] = objeto[p];
                    }
                }
                temp = o;
            }
            else {
                this.dadosFull.push(mk.aoReceberDados(objeto));
                temp = objeto;
            }
        }
        return temp;
    };
    // Modelo de Chaves e Propriedades do Modelo, podendo conter todo o design e estrutura dos dados da lista
    // Formato K V L R (Chave, Valor, Label, Regex) V é vazio/nulo, pois não recebe objeto nessa função.
    getModel = () => {
        return this.c.m;
    };
    // KVLR (E mais...)
    // K (Chave)	- V (Valor) - L (Label) - R (REGEX)	- T (TAG Html) - A (Attributos Tag) - I (Value no Inner)
    // keys.push({ k: "mDat", v: "", l: "Data", r: mk.util.data[1], t: "input", a: "type='text'" });
    // keys.push({ k: "mDes", v: "", l: "Descrição", r: "", t: "textarea", a: "cols='50' rows='10'", i: true });
    // Recebendo o objeto da lista, traz o getUsedKeys juntamente aos Values deste objeto;
    getKVLR = (obj) => {
        let models = this.getModel();
        if (models.length == 0)
            models = this.getUsedKeys(true);
        let kvlr = [];
        models.forEach((p) => {
            // A cada Propriedade do Modelo
            let o = { ...p };
            if (obj?.[p.k]) {
                if (o.i == true) {
                    o.i = obj?.[p.k];
                    o.v = "";
                }
                else {
                    o.i = null;
                    o.v = obj?.[p.k];
                }
            }
            else {
                o.i = null;
                o.v = "";
            }
            kvlr.push(o);
        });
        return kvlr;
    };
    // Cria um Set retorna um array de Keys Usadas
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
        this.dadosFull.forEach((o) => {
            if (o[this.c.pk] > maior)
                maior = Number(o[this.c.pk]);
        });
        return Number(maior) + 1;
    };
    getAllTr = () => {
        return Array.from(mk.QAll(this.c.divTabela + " tbody tr"));
    };
    // USER INTERFACE - UI - INDIVIDUAL
    add = (objDados) => {
        this.dadosFull.push(this.aoReceberDados(objDados));
        mk.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
        this.atualizarListagem();
    };
    edit = (objDados, k, v) => {
        this.dadosFull = mk.delObjetoFromId(k, v, this.dadosFull);
        this.dadosFull.push(mk.aoReceberDados(objDados));
        mk.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
        this.atualizarListagem();
    };
    del = (k, v) => {
        this.dadosFull = mk.delObjetoFromId(k, v, this.dadosFull);
        mk.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
        this.atualizarListagem();
    };
    find = (k, v) => {
        return this.dadosFull.find((o) => o[k] == v);
    };
    toJSON = () => {
        return this.dadosFull;
    };
    toString = () => {
        return JSON.stringify(this.dadosFull, null, "\t");
    };
    valueOf = () => {
        return this.dadosFull;
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			ATRIBUTOS	ESTATICOS					\\
    //___________________________________\\
    static contaListas = 0;
    static contaOrdena = 0;
    static paginationAtual = 1;
    static objetoSelecionado = {};
    static sendObjFull = {};
    static mkFaseAtual = 1;
    static mkCountValidate = 0;
    static debug = 0; // 0 / 1
    static timers = []; // Array para guardar timers em andamento ou finalizados
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			TITULOS CONSTANTES					\\
    //___________________________________\\
    static t = {
        G: "GET",
        P: "POST",
        J: "application/json",
        B: "*/*",
        H: "text/html",
        F: "multipart/form-data", // ContentType FORM
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
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			MASCARAS E REGEX						\\
    //___________________________________\\
    // Ex Regex: mk.util.cpf[1];
    static util = {
        cpf: ["000.000.000-00", /^([0-9]{3}([\.]?[0-9]{3}){2}[-]?[0-9]{2})$/],
        cep: ["00000-000", /^([0-9]{5}[-]?[0-9]{3})$/],
        cnpj: [
            "00.000.000/0000-00",
            /^([0-9]{2}([\.]?[0-9]{3}){2}[\/]?[0-9]{4}[-]?[0-9]{2})$/,
        ],
        cpf_cnpj: [
            "00.000.000/0000-00",
            /^([0-9]{2}([\.]?[0-9]{3}){2}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}([\.]?[0-9]{3}){2}[-]?[0-9]{2})$/,
        ],
        cnh: ["00000000000", /^([0-9]{11})$/],
        placa: ["SSS-0A00", /^([A-Za-z]{3}[-]?[0-9]{1}[A-Za-z0-9]{1}[0-9]{2})$/],
        placaAntesMercosul: ["AAA-0000", /^([A-Za-z]{3}[-]?[0-9]{4})$/],
        placaMercosul: [
            "SSS-0S00",
            /^([A-Za-z]{3}[-]?[0-9]{1}[A-Za-z]{1}[0-9]{2})$/,
        ],
        pis: [
            "000.00000.00-0",
            /^([0-9]{3}[\.]?[0-9]{5}[\.]?[0-9]{2}[-]?[0-9]{1})$/,
        ],
        money: ["#0.000.000.000.000.000,00"],
        dia: ["00", /^([0-3]?[0-9])$/],
        mes: ["00", /^([0-1]?[0-9])$/],
        ano: ["0000", /^([0-2]?([0-9]){3})$/],
        ip: ["000.000.000.000", /^([0-9]?[0-9]?[0-9]([\.]?[0-9]?[0-9]?[0-9]){3})$/],
        data: ["0000-00-00", /^([0-9]{4}(-[0-9]{2}){2})$/],
        dataIso8601: [
            "0000-00-00T00:00:00.000Z",
            /^([0-9]{4}(-[0-9]{2}){2}T[0-9]{2}(:[0-9]{2})\.[0-9]{3}Z)$/,
        ],
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			MK FUNCOES UTIL							\\
    //___________________________________\\
    // Classes do Console.
    static w = (...s) => {
        console.warn(...s);
    };
    static l = (...s) => {
        console.log(...s);
    };
    static cls = () => {
        console.clear();
    };
    static gc = (...s) => {
        console.groupCollapsed(...s);
    };
    static ge = () => {
        console.groupEnd();
    };
    static ct = (s) => {
        let t = mk.timers.find((t) => t.name == s);
        if (!t) {
            mk.timers.push({
                name: s,
                ini: mk.getMs(),
                fim: 0,
                tempo: -1,
            });
            // console.time(s);
        }
    };
    static cte = (s, quietMode = false) => {
        let t = mk.timers.find((t) => t.name == s);
        if (t.fim == 0) {
            t.fim = mk.getMs();
            t.tempo = t.fim - t.ini;
        }
        if (!quietMode) {
            mk.l(s + " \t-> " + t.tempo + " ms");
        }
        // console.timeEnd(s);
    };
    // Atalho para QuerySelector que retorna apenas o primeiro elemento da query.
    static Q = (query) => {
        if (typeof query != "string")
            return query;
        return document.querySelector(query);
    };
    // Atalho para QuerySelectorAll. List []
    static QAll = (query = "body") => {
        return Array.from(document.querySelectorAll(query));
    };
    // Atalho para AddEventListener
    static Ao = (tipoEvento = "click", query, executar) => {
        // CONVERTER PARA QUERY SELECTALL pois, tem o Pesquisar que pega todos os .iConsultas
        mk.QAll(query).forEach((e) => {
            e.addEventListener(tipoEvento, () => {
                executar(e);
            });
        });
    };
    // Atalho para innerHTML que retorna apenas o primeiro elemento da query.
    static html = (query, conteudo) => {
        let e = mk.Q(query);
        if (e) {
            e.innerHTML = conteudo;
        }
        return e;
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
    static removeEspecias = (s) => {
        let r = "";
        let sS = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
        let sN = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
        for (let p = 0; p < s.length; p++) {
            if (sS.indexOf(s.charAt(p)) != -1) {
                r += sN.charAt(sS.indexOf(s.charAt(p)));
            }
            else {
                r += s.charAt(p);
            }
        }
        r = mk.apenasNumerosLetras(r);
        return r;
    };
    static range = (from, to) => {
        // Obtem-se o acesso a um range de numeros.
        // Ambos os parametros são necessários: FROM(DE) e TO(PARA)
        class Range {
            // Propriedades
            from; // <= Número Inicial
            to; // <= Número Final
            // Contrutor
            constructor(from, to) {
                this.from = from;
                this.to = to;
            }
            has(x) {
                return typeof x === "number" && this.from <= x && x <= this.to;
            }
            // Representação matemática do range.
            toString() {
                return `{ x | ${this.from} <= x <= ${this.to} }`;
            }
            // Iterator
            [Symbol.iterator]() {
                // Individual por Instancia
                let next = Math.ceil(this.from);
                let last = this.to;
                return {
                    next() {
                        // Só avança se não estiver no fim.
                        return next <= last ? { value: next++ } : { done: true };
                    },
                    // Range Iteravel
                    [Symbol.iterator]() {
                        return this;
                    },
                };
            }
        }
        return new Range(from, to);
    };
    // Comparardor de string LIKE
    static like = (strMenor, strMaior) => {
        let result = false;
        // Se utilizar match, não pode ter os reservados do regex.
        strMaior = mk.apenasNumerosLetras(strMaior).toLowerCase().trim();
        strMenor = mk.apenasNumerosLetras(strMenor).toLowerCase().trim();
        let rmMaior = strMaior.toLowerCase().trim();
        let rmMenor = strMenor.toLowerCase().trim();
        if (rmMaior.match(rmMenor)) {
            result = true;
        }
        // Internacionalizador de comparação... (Galês CH e DD e Latin ä))
        let likeMatcher = new Intl.Collator(undefined, {
            sensitivity: "base",
            ignorePunctuation: true,
        }).compare;
        if (likeMatcher(strMaior, strMenor) === 0) {
            result = true;
        }
        return result;
    };
    // Comparardor de string CONTEM
    static contem = (strMaior, strMenor) => {
        strMaior = mk.removeEspecias(strMaior).toLowerCase();
        strMenor = mk.removeEspecias(strMenor).toLowerCase();
        return (strMaior.includes(strMenor));
    };
    // Informando a Array ou o Objeto, itera sobre todas e executa a funcao, e retorna o total de propriedades iteradas.
    static allSubPropriedades = (OA, funcao = null, exceto = "object") => {
        let c = 0;
        for (let a in OA) {
            let target = OA[a];
            if (typeof target != exceto) {
                if (funcao) {
                    funcao(target);
                }
            }
            c++;
            // Se o atual é objeto, itera internamente
            if (typeof target == "object") {
                c += mk.allSubPropriedades(target, funcao, exceto);
            }
        }
        return c;
    };
    // Verifica se ARRAY ou OBJETO e executa a função FUNC a cada objeto dentro de OA.
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
    // Converter (OBJ / ARRAY) Limpar Nulos e Vazios
    static mkLimparOA = (oa) => {
        // Trocar para arrow
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
    // Gerar Objeto a partir de um Form Entries
    static mkGerarObjeto = (este) => {
        let form = este;
        if (typeof este != "object") {
            form = mk.Q(este);
        }
        let rObjeto = mk.mkLimparOA(Object.fromEntries(new FormData(form).entries()));
        mk.gc("Objeto Gerado: ");
        mk.l(rObjeto);
        mk.ge();
        return rObjeto;
    };
    static QSet = (query = "body", valor = null) => {
        let e = mk.Q(query);
        if (e) {
            if (valor != null) {
                if (e)
                    e.value = valor;
            }
            else {
                let e = mk.Q(query);
                if (e)
                    e.value = "";
            }
            return e;
        }
        else {
            return null;
        }
    };
    // Seta todos os query com os valores das propriedades informadas nos campos.
    // O nome da propriedade precisa ser compatível com o PROPNAME do query.
    static QSetAll = (query = "input[name='#PROP#']", o = null, comEvento = true) => {
        let eAfetados = [];
        if (o != null) {
            if (typeof o == "object" && !Array.isArray(o)) {
                for (let p in o) {
                    let eDynamicQuery = mk.Q(query.replace("#PROP#", p));
                    if (eDynamicQuery) {
                        if (o[p]) {
                            eDynamicQuery.value = o[p];
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
            else
                mk.w("QSetAll - Precisa receber um objeto: " + o);
        }
        else
            mk.w("QSetAll - Objeto não pode ser nulo: " + o);
        return eAfetados;
    };
    static Qon = (query = "body") => {
        return mk.aCadaElemento(query, (e) => {
            if (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) {
                e.disabled = false;
            }
            e.classList.remove("disabled");
            e.removeAttribute("tabindex");
        });
    };
    static Qoff = (query = "body") => {
        return mk.aCadaElemento(query, (e) => {
            if (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) {
                e.disabled = true;
            }
            e.classList.add("disabled");
            e.setAttribute("tabindex", "-1");
        });
    };
    static Qison = (query = "body") => {
        return mk.cadaExe(query, (e) => {
            let b = false;
            if (!e.classList.contains("disabled")) {
                b = true;
            }
            return b;
        });
    };
    static QverOn = (query = "body") => {
        return mk.aCadaElemento(query, (e) => {
            e?.classList.remove("oculto");
        });
    };
    static QverOff = (query = "body") => {
        return mk.aCadaElemento(query, (e) => {
            e?.classList.add("oculto");
        });
    };
    static QverToggle = (query = "body") => {
        return mk.aCadaElemento(query, (e) => {
            e?.classList.toggle("oculto");
        });
    };
    // Query: String, Element, [Element,Element]
    static aCadaElemento = (query, fn) => {
        if (typeof query == "string") {
            let retorno;
            let elementos = mk.QAll(query);
            if (elementos.length == 1)
                retorno = elementos[0];
            else
                retorno = elementos;
            elementos.forEach((e) => {
                fn(e);
            });
            return retorno;
        }
        else if (Array.isArray(query)) {
            query.forEach((e) => {
                fn(e);
            });
            return query;
        }
        else {
            let e = mk.Q(query);
            fn(e);
            return e;
        }
    };
    // Query: String, Element, [Element,Element]
    // Retorna uma array de resultados de cada execucao
    static cadaExe = (query, fn) => {
        let retorno = [];
        if (typeof query == "string") {
            let elementos = mk.QAll(query);
            elementos.forEach((e) => {
                retorno.push(fn(e));
            });
        }
        else if (Array.isArray(query)) {
            query.forEach((e) => {
                retorno.push(fn(e));
            });
        }
        else {
            let e = mk.Q(query);
            retorno.push(fn(e));
        }
        return retorno;
    };
    static QScrollTo = (query = "body") => {
        let temp = mk.Q(query);
        let distTopo = temp.offsetTop;
        window.scrollTo({
            top: distTopo,
            behavior: "smooth",
        });
        return temp;
    };
    static QdataGet = (query = "body", atributoNome) => {
        return mk.Q(query).getAttribute("data-" + atributoNome);
    };
    static QdataSet = (query = "body", atributoNome, atributoValor) => {
        return mk.Q(query).setAttribute("data-" + atributoNome, atributoValor);
    };
    static toggleSwitcher = (e) => {
        if (e.classList.contains("True")) {
            e.classList.remove("True");
            e.classList.add("False");
        }
        else {
            if (e.classList.contains("False")) {
                e.classList.remove("False");
                e.classList.add("True");
            }
        }
        return e;
    };
    // static QaSet = (query = "body", atributoNome, atributoValor) => {
    // 	return mk.Q(query).setAttribute(atributoNome, atributoValor);
    // };
    // static QaGet = (query = "body", atributoNome) => {
    // 	return mk.Q(query).getAttribute(atributoNome);
    // };
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
    // Ignora qualquer outro caracter além de Numeros e Letras formato ocidental
    static apenasNumerosLetras = (s = "") => {
        return s.replace(/(?![a-zA-Z0-9])./g, "");
    };
    // Ignora qualquer outro caracter além de Numeros
    static apenasNumeros = (s = "") => {
        return s.replace(/(?![0-9])./g, "");
    };
    // Ignora qualquer outro caracter além de Letras formato ocidental
    static apenasLetras = (s = "") => {
        return s.replace(/(?![a-zA-Z])./g, "");
    };
    static isFloat = (x) => {
        if (!isNaN(x)) {
            if (parseInt(x) != parseFloat(x)) {
                return true;
            }
        }
        return false;
    };
    // Remover parametros da URL
    static delUrlQuery = (url) => {
        let posIniQuery = url.indexOf("?");
        if (posIniQuery < 0)
            return url;
        return url.slice(0, posIniQuery);
    };
    // Funcção que recebe os dados de um arquivo e executa um Download deste dados.
    static gerarDownload = (blob, nomeArquivo = "Arquivo.zip") => {
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = nomeArquivo;
        link.click();
        URL.revokeObjectURL(fileUrl);
        return nomeArquivo;
    };
    // Get Server On
    static getServerOn = async (url = "/Login/GetServerOn") => {
        let pac = await mk.get.json({ url: url, quiet: true });
        // Vem nulo caso falhe
        if (pac?.retorno) {
            mk.detectedServerOn();
        }
        else {
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
            buttonOfflineBlock.setAttribute("onClick", "mk.detectedServerOn()");
            // let iOfflineBlock = document.createElement("i");
            // iOfflineBlock.className = "bi bi-x-lg";
            buttonOfflineBlock.innerHTML =
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z'/></svg>";
            divOfflineBlock.appendChild(divOfflineBlockInterna);
            divOfflineBlock.appendChild(buttonOfflineBlock);
            document.body.appendChild(divOfflineBlock);
        }
        mk.Q("body .offlineBlock").classList.remove("oculto");
    };
    static detectedServerOn = () => {
        mk.Q("body .offlineBlock")?.classList?.add("oculto");
    };
    // Eventos HTML5
    // Bloqueio de teclas especificas onKeyDown
    static mkOnlyFloatKeys = (ev) => {
        // Input: UMA tecla QUALQUER
        //=> Metodo filtrar: Bloquear apenas estes
        //let proibido = "0123456789";
        //let isNegado = false;
        //for (var item in proibido) {
        //    (item == ev.key) ? isNegado = true : null;
        //}
        //=> Metodo filtrar: Liberar apenas estes
        let permitido = "0123456789,-";
        let isNegado = true;
        for (var i = 0; i < permitido.length; i++) {
            if (permitido[i] == ev.key.toString()) {
                //mk.l(permitido[i] + " == " + ev.key.toString());
                isNegado = false;
            }
        }
        //=> Teclas especiais
        ev.key == "ArrowLeft" ? (isNegado = false) : null; // Liberar Setinha pra Esquerda
        ev.key == "ArrowRight" ? (isNegado = false) : null; // Liberar Setinha pra Direita
        ev.key == "Backspace" ? (isNegado = false) : null; // Liberar Backspace
        ev.key == "Delete" ? (isNegado = false) : null; // Liberar Deletar
        ev.key == "Tab" ? (isNegado = false) : null; // Liberar Deletar
        if (isNegado) {
            ev.preventDefault();
            mk.w("Negado");
        }
    };
    // Bloqueios de eventos especificos (varios, exemplo: onContextMenu)
    static mkEventBlock = (ev) => {
        mk.w("Negado");
        ev.preventDefault();
    };
    // Imprimir e Exportar de ListaPrecos
    static mkTrocaPontoPorVirgula = (query) => {
        mk.QAll(query).forEach((e) => {
            e.innerHTML = e.innerHTML.replaceAll(".", ",");
        });
    };
    // Seleciona texto do elemento
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
        // 123,45 (2 casas pos conversao float)
        e.value = mk.mkDuasCasas(mk.mkFloat(e.value));
    };
    static mkMedia = (menor, maior) => {
        return mk.mkDuasCasas((mk.mkFloat(menor) + mk.mkFloat(maior)) / 2);
    };
    static mkFloat = (num) => {
        let ret;
        if (typeof num != "number") {
            if (num)
                ret = parseFloat(num.toString().replaceAll(".", "").replaceAll(",", "."));
            else
                ret = 0;
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
        return mk.mkFloat(num).toFixed(2).replaceAll(".", ","); // 2000,00
        //        .toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // 2.000,00
    };
    // Funcao para formatar número para exibição
    static mkNCasas = (num, nCasas = 2) => {
        return mk.mkFloat(num).toFixed(nCasas).replaceAll(".", ","); // 2000,?
    };
    static mkEmReais = (num) => {
        return mk.mkFloat(num).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        }); // R$ 12.123,45
    };
    // String qualquer para B64
    static encod = (texto = "") => {
        return btoa(encodeURIComponent(texto));
    };
    // B64 para String
    static decod = (texto = "") => {
        return decodeURIComponent(atob(texto));
    };
    static mkBase64 = (arquivo, tagImg, tagHidden) => {
        // Verificar se esta nulo
        let leitor = new FileReader();
        leitor.onload = () => {
            mk.Q(tagImg).src = leitor.result;
            mk.Q(tagHidden).value = leitor.result;
        };
        leitor.readAsDataURL(arquivo);
    };
    static ler = async (arq, p) => {
        return new Promise((r) => {
            let leitor = new FileReader();
            leitor.onprogress = (ev) => {
                if (ev.lengthComputable) {
                    let carga = ev.loaded / ev.total;
                    if (carga <= 1) {
                        if (p)
                            p(carga);
                    }
                }
            };
            leitor.onload = (ev) => {
                arq.b64 = ev.target?.result;
                r(arq);
            };
            leitor.onerror = () => {
                console.error("Erro ao ler arquivo: " + arq);
            };
            if (arq) {
                if (arq.name != "") {
                    leitor.readAsDataURL(arq);
                }
                else {
                    mk.l("F: Sem nome de arquivo.", arq);
                    r(null);
                }
            }
            else {
                mk.l("F: Arquivo Nulo.", arq);
                r(null);
            }
        });
    };
    static clonar = (i) => {
        return JSON.parse(JSON.stringify(i));
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
    // Sobe os elementos até encontrar o form pertencente a este elemento. (Se limita ao BODY)
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
    static getTr = (e) => {
        let eTr = e;
        while (eTr.tagName != "TR") {
            eTr = eTr.parentElement;
            if (eTr.tagName == "BODY") {
                console.error("Não foi possível encontrar o elemento TR na busca getTr()");
                eTr = null;
                break;
            }
        }
        return eTr;
    };
    // Sobe elementos pais até encontrar este elemento
    static getETag = (e, tag) => {
        let eTr = e;
        while (eTr.tagName != tag) {
            eTr = eTr.parentElement;
            if (eTr.tagName == "BODY") {
                console.error("Não foi possível encontrar o elemento " + tag + " na busca getETag()");
                eTr = null;
                break;
            }
        }
        return eTr;
    };
    // E - ESTA DENTRO DE - CONTAINER?
    static isInside = (e, container) => {
        let resultado = false;
        let ePai = e;
        let c = 0;
        while (ePai != mk.Q("BODY") || c > 100) {
            ePai = ePai.parentElement;
            if (ePai == container) {
                resultado = true;
                break;
            }
            c++;
        }
        return resultado;
    };
    // Sobe elementos pais até encontrar esta classe
    static getEClass = (e, classe) => {
        let eClass = e;
        while (!eClass.classList.contains(classe)) {
            eClass = eClass.parentElement;
            if (eClass == null) {
                console.error("Não foi possível encontrar o elemento com esta classe. getEClass.", classe);
                eClass = null;
                break;
            }
        }
        return eClass;
    };
    // Retorna uma array utilizando um template do que deve ser preenchido.
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
    // Retorna uma array dos últimos
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
    // YYYY-MM-DD
    static isData = (i) => {
        return mk.util.data[1].test(i);
    };
    // Retorna Milisegundos da data no formato Javascript
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
    // Retorna Data do cliente de Hoje em:  DD/MM/YYYY
    static hojeMkData = () => {
        return new Date(mk.getMs()).toLocaleDateString();
    };
    static hojeMkHora = () => {
        return new Date(Number(mk.getMs())).toLocaleTimeString();
    };
    // Retorna a data de Hoje no formato: DD/MM/YYYY
    static hoje = () => {
        let mkFullData = mk.hojeMkData() + " " + mk.hojeMkHora();
        return mkFullData;
    };
    // Retorna Data do cliente de Hoje em:  YYYY-MM-DD
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
    static getTempoDiferenca = (msOld, msNew = null) => {
        let dias = mk.getDiasDiferenca(msOld, msNew);
        if (dias < 0) {
            dias = dias * -1;
        }
        let strTempo = "";
        if (dias > 30) {
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
                strTempo = "menos de 1 dia";
            }
            else {
                strTempo = dias + " dias";
            }
        }
        return strTempo;
    };
    static getDiasDiferenca = (msOld, msNew = null) => {
        if (msNew == null)
            msNew = mk.getMs();
        return mk.transMsEmDias(msNew - msOld);
    };
    // Para transformar uma diferenca de datas em Mes ou Ano,
    // precisa de auxilio de um calendário,
    // pois os dias não são sempre 24 horas.
    // Ao comparar meses de diferenca,
    // ocorrerá um erro na conta quando houver meses com 31 dias
    // E anos bissexto geram erros nos meses de fevereiro sem um calendario
    static transMsEmSegundos = (ms) => {
        return Math.trunc(ms / 1000); // 1000 ms == 1s
    };
    static transMsEmMinutos = (ms) => {
        return Math.trunc(ms / 60000); // 1000 * 60
    };
    static transMsEmHoras = (ms) => {
        return Math.trunc(ms / 3600000); // 1000 * 3600
    };
    static transMsEmDias = (ms) => {
        // 1000 * 3600 * 24 Considerando todo dia tiver 24 horas (~23h 56m 4.1s)
        // (360º translacao / 86400000) = ~4.1
        // Então o erro de 1 dia ocorre 1x ao ano (Dia represeta 1436min).
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
    // Injeção de elementos
    static mkGeraElemento(e, nomeElemento = "script") {
        // Cria Elemento
        let elemento = document.createElement(nomeElemento);
        // Popular Elemento
        elemento.text = e.innerHTML;
        // Set Atributos
        let i = -1, attrs = e.attributes, attr;
        while (++i < attrs.length) {
            elemento.setAttribute((attr = attrs[i]).name, attr.value);
        }
        // Retorna Elemento
        return elemento;
    }
    // Função Recursiva que substitui node de Script por elemento de Script
    static mkNodeToScript(node) {
        // Apenas Scripts
        if (node.tagName === "SCRIPT") {
            node.parentNode.replaceChild(mk.mkGeraElemento(node, "script"), node);
        }
        else {
            // Recursividade sobre filhos
            var i = -1, children = node.childNodes;
            while (++i < children.length) {
                mk.mkNodeToScript(children[i]);
            }
        }
        return node;
    }
    // Calculo de frequencia
    // Conta o total do que tem dentro da array e retorna a frequencia destes;
    static frequencia = (array) => {
        let f = {};
        for (let e of array) {
            f[e] ? f[e]++ : (f[e] = 1);
        }
        return f;
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			Conversores									\\
    //___________________________________\\
    // Converter de YYYY-MM-DD para DD/MM/YYYY
    static mkYYYYMMDDtoDDMMYYYY = (dataYYYYMMDD) => {
        let arrayData = dataYYYYMMDD.split("-");
        let stringRetorno = "";
        if (arrayData.length >= 3) {
            // Tenta evitar bug de conversao
            stringRetorno = arrayData[2] + "/" + arrayData[1] + "/" + arrayData[0];
        }
        else {
            stringRetorno = dataYYYYMMDD;
        }
        return stringRetorno;
    };
    // Converter (OBJ / ARRAY) Formato Booleano em Sim/Não
    static mkFormatarDataOA = (oa) => {
        function mkFormatarDataOA_Execute(o) {
            let busca = new RegExp("^[0-2][0-9]{3}[-][0-1][0-9][-][0-3][0-9]$"); // Entre 0000-00-00 a 2999-19-39
            for (var propName in o) {
                if (busca.test(o[propName])) {
                    o[propName] = mk.mkYYYYMMDDtoDDMMYYYY(o[propName]);
                }
            }
            return o;
        }
        return mk.mkExecutaNoObj(oa, mkFormatarDataOA_Execute);
    };
    // Converter (OBJ / ARRAY) Formato Booleano em Sim/Não
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
    // Converter (OBJ / ARRAY) Formatar para normalizar com a exibicao ao usuario.
    static mkFormatarOA = (oa) => {
        return mk.mkBoolToSimNaoOA(mk.mkFormatarDataOA(mk.mkLimparOA(oa)));
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			Carregador									\\
    //___________________________________\\
    static CarregarON = (nomeDoRequest = "") => {
        if (mk.Q("body .CarregadorMkBlock") == null) {
            let divCarregadorMkBlock = document.createElement("div");
            divCarregadorMkBlock.className = "CarregadorMkBlock";
            let divCarregadorMk = document.createElement("div");
            divCarregadorMk.className = "CarregadorMk";
            let buttonCarregadorMkTopoDireito = document.createElement("button");
            buttonCarregadorMkTopoDireito.className = "CarregadorMkTopoDireito";
            buttonCarregadorMkTopoDireito.setAttribute("type", "button");
            buttonCarregadorMkTopoDireito.setAttribute("onClick", "mk.CarregarOFF()");
            buttonCarregadorMkTopoDireito.innerHTML =
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z'/></svg>";
            divCarregadorMkBlock.appendChild(divCarregadorMk);
            divCarregadorMkBlock.appendChild(buttonCarregadorMkTopoDireito);
            document.body.appendChild(divCarregadorMkBlock);
        }
        mk.Q("body .CarregadorMkBlock").classList.remove("oculto");
        mk.Q("body").classList.add("CarregadorMkSemScrollY");
    };
    static CarregarOFF = (nomeDoRequest = "") => {
        if (mk.Q("body .CarregadorMkBlock") != null) {
            mk.Q("body .CarregadorMkBlock").classList.add("oculto");
        }
        mk.Q("body").classList.remove("CarregadorMkSemScrollY");
    };
    static CarregarHtml = (estilo = "", classe = "relative") => {
        return `<div class="CarregadorMk ${classe}" style="${estilo}"></div>`;
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			REQUEST											\\
    //___________________________________\\
    // Formas pre formatadas de chamar o Request de forma simples.
    // mk.get.json({ url:"/GetList", done: (c)=>{console.log("done:",c)}})
    static get = {
        json: async (config) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mk.t.G;
            config.tipo = mk.t.J;
            return await mk.request(config);
        },
        html: async (config) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mk.t.G;
            config.tipo = mk.t.H;
            let retorno = await mk.request(config);
            return retorno;
        },
        blob: async (config) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mk.t.G;
            config.tipo = mk.t.B;
            let retorno = await mk.request(config);
            return retorno;
        }
    };
    static post = {
        json: async (config, json) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mk.t.P;
            config.tipo = mk.t.J;
            config.dados = json;
            let retorno = await mk.request(config);
            return retorno;
        },
        html: async (config, text) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mk.t.P;
            config.tipo = mk.t.H;
            config.dados = text;
            let retorno = await mk.request(config);
            return retorno;
        },
        form: async (config, formdata) => {
            if (typeof config != "object")
                config = { url: config };
            config.metodo = mk.t.P;
            config.tipo = mk.t.F;
            config.dados = formdata;
            let retorno = await mk.request(config);
            return retorno;
        }
    };
    /** REQUEST
     * Se Utilizar o await, o config enviado retorna com o resultado e o pacote
     * Se definir o done e/ou o error no config, será executado como callback também.
     * @param config  Estes são as propriedades em uso do config:
     * {
     * 	url: "www.google.com",
     * 	metoto: "GET",
     * 	tipo: "application/json",
     * 	dados: ["a",1],
     * 	headers: new Headers(),
     * 	quiet: false,
     * 	dev: false,
     * 	carregador: false,
     * 	done: (c)=>{mk.l("Deu Boa? ",c.pacote.ok)},
     * 	error: (c)=>{mk.l("Deu Boa? ",c.pacote.ok)},
     *  //pacote: É populado com os dados do pacote.
     *  //retorno: É populado com os dados retornados.
     * }
     * @returns Sempre retorna o config preenchido (utilizar await para capturar o resultado)
     */
    static request = async (config) => {
        // CONFIG ! Necessário
        if (typeof config != "object") {
            this.w("É necessário informar o objeto de configuração com a URL.");
            return { url: null, retorno: null }; // Não há config, Mas pra retornar sempre o config
        }
        // URL ! Necessário
        if (!config?.url) {
            this.w("Necessário informar uma URL nos requests.");
            return { url: config?.url, retorno: null };
        }
        // GET ? POST, PUT, DELETE
        if (!config?.metodo) {
            this.w("Nenhum método informado. Avançando com GET");
            config.metodo = "GET";
        }
        else {
            if (config.metodo == "POST" && config.dados == null) { // Todo POST requer dados a serem enviados.
                this.w("Método POST, mas SEM DADOS informados. Enviando string vazia ''.");
                config.dados = "";
            }
        }
        // Name e Timer Start
        let nomeRequest = config.metodo + ": " + config.url;
        mk.ct("Request: " + nomeRequest);
        // JSON / FORM / *
        if (!config?.tipo) {
            this.w("Nenhum tipo de dado informado. Avançando com " + mk.t.J);
            config.tipo = mk.t.J;
        }
        if (!config?.headers) {
            config.headers = new Headers();
            // CONTENT TYPE
            if (config.tipo == mk.t.J) {
                config.headers.append("Content-Type", config.tipo);
            }
            // TOKEN
            let aft = document.getElementsByName("__RequestVerificationToken")[0]?.value;
            config.headers.append("MKANTI-FORGERY-TOKEN", aft || "");
        }
        if (!config.quiet)
            config.quiet = false;
        // TIPO DE ENVIO
        config.json = JSON.stringify(config.dados);
        if (config.metodo != mk.t.G) {
            if (config.tipo == mk.t.J) {
                config.body = config.json;
            }
            else if (config.tipo == mk.t.F) {
                config.body = config.dados;
            }
        }
        // config.dev = true;
        // INFO CONSOLE
        if (!config.quiet) {
            mk.gc(nomeRequest);
            if (config.dev) {
                mk.l("Header: ", Object.fromEntries(config.headers.entries()));
                mk.l("Config: ", config);
            }
            if (config.metodo == mk.t.P) {
                mk.l("DADOS: ", config.dados);
                mk.gc("JSON: ");
                mk.l(config.json);
                mk.ge();
                if (typeof config.dados == "object") {
                    if (config.dados.entries != null) {
                        mk.gc("FORM OBJECT");
                        mk.l(Object.fromEntries(config.dados.entries()));
                        mk.ge();
                    }
                }
            }
            mk.ge(); // Fim do metodo
        }
        // Inicia o carregador 
        if (config.carregador) {
            this.CarregarON(nomeRequest);
        }
        // O EXECUTOR		
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
                // FALHA (NÂO 200)
                mk.gc("HTTP RETURNO: " + config.pacote.status + " " + config.pacote.statusText);
                mk.l(await config.pacote.text()); // Exibir o erro no console;
                mk.ge();
            }
            else {
                config.conectou = true;
                config.statusCode = config.pacote.status;
                // 200 DONE (Retorna baseado no tipo de envio)
                if (config.tipo == mk.t.J) {
                    config.retorno = await config.pacote.json();
                }
                else if (config.tipo == mk.t.H) {
                    config.retorno = await config.pacote.text();
                }
                else if (config.tipo == mk.t.B) {
                    config.retorno = await config.pacote.blob();
                }
                else if (config.tipo == mk.t.F) {
                    config.retorno = await config.pacote.json();
                }
                if (!config.quiet) {
                    mk.gc("Retorno " + config.pacote.status +
                        " (" + config.metodo + "): " +
                        config.url + " (" + config.tipo + ")");
                }
                mk.cte("Request: " + nomeRequest, config.quiet);
                if (!config.quiet) {
                    mk.l(config.retorno);
                    mk.ge();
                }
                if (config.done) {
                    config.done(config);
                }
            }
        }
        catch (error) {
            // Caso Conection_Refused, Não tem código de erro. Então cai aqui.
            config.conectou = false;
            config.catch = error;
        }
        // Aqui tem Status code se o erro foi no servidor, Mas não tem se o servidor não estiver online.
        if (!config.conectou) {
            mk.gc("(" + config.statusCode + ") HTTP ERRO:");
            // Se bateu no catch, expoem trace error do JS
            if (config.catch && !config.quiet) {
                mk.l("Config: " + config);
                console.error("Erro: ", config.catch);
            }
            // Executa funcao de erro externa.
            if (config.error) {
                config.error(config);
            }
            mk.ge();
        }
        // Finaliza o carregador 
        if (config.carregador) {
            this.CarregarOFF(nomeRequest);
        }
        // Sempre retorna o config
        return config;
    };
    // Método principal de chamada Http. tanto GET quanto POST
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
        // INFO DEV
        mk.gc(pacote.method + ": " + url);
        mk.ct("Request: " + url);
        if (mk.debug == 1) {
            mk.gc(">> Cabecalho do pacote");
            mk.l(Object.fromEntries(headers.entries()));
            mk.gc(">> Pacote full");
            mk.l(pacote);
            mk.ge();
            mk.ge();
        }
        if (metodo == mk.t.P) {
            mk.gc(">> Objeto Enviado (Body)");
            console.group(">> Dados transmitidos");
            mk.l(dados);
            mk.ge();
            mk.gc(">> JSON String");
            mk.l(body?.toString());
            mk.ge();
            if (typeof dados == "object") {
                if (dados.entries != null) {
                    mk.gc(">>> Form Object");
                    mk.l(Object.fromEntries(dados.entries()));
                    mk.ge();
                }
            }
            mk.ge();
        }
        mk.ge();
        // EXECUCAO
        let corpo = null;
        try {
            const pacoteHttp = await fetch(url, pacote);
            if (!pacoteHttp.ok) {
                mk.gc("HTTP RETURNO: " + pacoteHttp.status + " " + pacoteHttp.statusText);
                console.error("HTTP RETURNO: Não retornou 200.");
                mk.l(await pacoteHttp.text()); // Exibir o erro no console;
                mk.ge();
                if (carregador) {
                    this.CarregarOFF();
                }
                return null;
            }
            if (tipo == mk.t.J) {
                corpo = await pacoteHttp.json();
            }
            else if (tipo == mk.t.H) {
                corpo = await pacoteHttp.text();
            }
            else if (tipo == mk.t.B) {
                corpo = await pacoteHttp.blob();
            }
            else if (tipo == mk.t.F) {
                corpo = await pacoteHttp.json();
            }
            if (carregador) {
                this.CarregarOFF();
            }
            mk.gc("Retorno (" + pacoteHttp.status +
                " " + pacote.method +
                " " +
                tipo.toUpperCase().split("/")[1] +
                "): " +
                url);
            mk.cte("Request: " + url);
            mk.l(corpo);
            mk.ge();
            //if (sucesso != null) sucesso(corpo);
        }
        catch (error) {
            if (carregador) {
                this.CarregarOFF();
            }
            if (error) {
                mk.gc("HTTP ERRO: ");
                console.error("Erro: ", error);
                mk.ge();
            }
            return null;
        }
        return corpo;
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			LISTAGEM										\\
    //___________________________________\\
    // GET OBJ - Retorna O objeto de uma Lista
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
    // GET OBJ - Retorna O objeto de uma Lista
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
    // DEL OBJ - Retorna a lista sem o objeto informado
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
    // Metodo que eh executado ao completar a exibicao (PODE SOBREESCREVER NA VIEW)
    static aoCompletarExibicao = () => { };
    // Metodo que eh executado antes de exibir (PODE SOBREESCREVER NA VIEW)
    static antesDePopularTabela = () => { };
    // Torna ativo o botao que se refere ao paginationAtual
    static ativaPaginaAtual = () => {
        mk.QAll(".paginate_button").forEach((item) => {
            item.classList.remove("active");
        });
        mk.QAll(".paginate_button .page-link").forEach((item) => {
            if (this.paginationAtual == Number(item.innerHTML)) {
                item.parentElement?.classList.add("active");
            }
        });
    }; // Desativa e ativa botao correto
    /**
     * FullFiltroFull - processoFiltragem
     * Executa a redução da listagem basedo no objFiltro.
     * Usando modificaFiltro(), pode-se filtrar o objeto da lista também.
     */
    static processoFiltragem = (aTotal, objFiltro, inst) => {
        let aFiltrada = [];
        if (Array.isArray(aTotal)) {
            let temp = [];
            aTotal.forEach((o) => {
                let podeExibir = inst.modicaFiltro(o); // true
                if (typeof podeExibir != "boolean") {
                    podeExibir = true;
                    mk.w("modicaFiltro() precisa retornar boolean");
                }
                for (let propFiltro in objFiltro) {
                    // Faz-se o cruzamento dos dados, quando encontrar a prorpiedade no outro objeto, seta pra executar o filtro.
                    let m = null;
                    if (o[propFiltro] != null) {
                        m = o[propFiltro]; // m representa o dado do item
                    }
                    if (propFiltro.includes(".")) {
                        m = mk.getV(propFiltro, o); // m representa o dado do item
                        //this.l("NoFIltro: ", objFiltro[propFiltro].conteudo.toString().toLowerCase(), " > DadoItem: ", m)
                    }
                    //this.l("objFiltro[propFiltro]: ", objFiltro[propFiltro])
                    // Cada Propriedade de Cada Item da Array
                    if (m != null) {
                        // Cruzar referencia com objFiltro e se so avancar se realmente for um objeto
                        let k = objFiltro[propFiltro]; // k representa a config do filtro para essa propriedade
                        if (k.formato === "string") {
                            k.conteudo = k.conteudo.toString().toLowerCase();
                            if (!mk.contem(m, k.conteudo)) {
                                podeExibir = false;
                            }
                        }
                        else if (k.formato === "stringNumerosVirgula") {
                            // Filtro por numero exado. Provavelmente sejam duas arrays (MultiSelect), O filtro precisa encontrar tudo no objeto.
                            let filtroInvertido = false;
                            if (this.isJson(k.conteudo)) {
                                let arrayM = m.toString().split(","); // String de Numeros em Array de Strings
                                let mayBeArrayK = JSON.parse(k.conteudo); // << No objFiltro
                                if (Array.isArray(mayBeArrayK)) {
                                    mayBeArrayK.forEach((numeroK) => {
                                        // A cada numero encontrado pos split na string do item verificado
                                        filtroInvertido = arrayM.some((numeroM) => {
                                            return Number(numeroM) == Number(numeroK);
                                        });
                                    });
                                }
                                else {
                                    filtroInvertido = arrayM.some((numeroM) => {
                                        return Number(numeroM) == Number(mayBeArrayK);
                                    });
                                }
                                if (!filtroInvertido) {
                                    podeExibir = false;
                                }
                            }
                            else
                                mk.w("Não é um JSON");
                        }
                        else if (k.formato === "number") {
                            // Filtro por numero exado. Apenas exibe este exato numero.
                            // Ignorar filtro com 0
                            if (Number(m) !== Number(k.conteudo) &&
                                Number(k.conteudo) !== 0) {
                                podeExibir = false;
                            }
                        }
                        else if (k.formato === "date") {
                            // Filtro por Data (Gera milissegundos e faz comparacao)
                            let dateM = new Date(m).getTime();
                            let dateK = new Date(k.conteudo).getTime();
                            if (k.operador === ">=") {
                                // MAIOR OU IGUAL
                                if (!(dateM >= dateK)) {
                                    podeExibir = false;
                                }
                            }
                            else if (k.operador === "<=") {
                                // MENOR OU IGUAL
                                if (!(dateM <= dateK)) {
                                    podeExibir = false;
                                }
                            }
                            else if (k.operador === ">") {
                                // MAIOR
                                if (!(dateM > dateK)) {
                                    podeExibir = false;
                                }
                            }
                            else if (k.operador === "<") {
                                // MENOR
                                if (!(dateM < dateK)) {
                                    podeExibir = false;
                                }
                            }
                            else {
                                // IGUAL ou nao informado
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
                    // Verificara todas prop, logica da adicao por caracteristica buscada
                    if (objFiltro["mkFullFiltro"]) {
                        // Se houver pesquisa generica no filtro
                        let k = objFiltro["mkFullFiltro"]["conteudo"]
                            .toString()
                            .toLowerCase(); // k = Dado que estamos procurando
                        podeExibir = false; // Inverter para verificar se alguma prop do item possui a caracteristica
                        mk.allSubPropriedades(o, (v) => {
                            if (v != null) {
                                // <= Nao pode tentar filtrar em itens nulos
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
    // Metodo que eh executado sempre que um dado for recebido. (PODE SOBREESCREVER NA VIEW)
    static aoReceberDados = (data) => {
        return data;
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			ORDER LIST									\\
    //___________________________________\\
    // Está sendo utilizado no GetList. Verificar como utilizar o ordenar no getlist para deletar este aqui.
    static ordenamento = (a, por, dir) => {
        a.sort((oA, oB) => {
            let a = oA[por];
            let b = oB[por];
            if (typeof a == "string")
                a = a.toLowerCase();
            if (typeof b == "string")
                b = b.toLowerCase();
            if (a !== b) {
                if (a > b)
                    return 1;
                if (a < b)
                    return -1;
            }
            return -1;
        });
        if (dir == 1) {
            // Direção Reversa (Ver setDirSort)
            a = a.reverse();
        }
        return a;
    };
    // Possibilidade de inverter a lista (Tentar deixar esse padrao)
    // Essa funcção deveria ser da instancia atual para recever os atributos da instancia por padrao
    static ordenar = (array, nomeProp, reverse) => {
        array.sort((oA, oB) => {
            let a = oA[nomeProp];
            let b = oB[nomeProp];
            if (typeof a == "string")
                a = a.toLowerCase();
            if (typeof b == "string")
                b = b.toLowerCase();
            if (a !== b) {
                if (a > b)
                    return 1;
                if (a < b)
                    return -1;
            }
            return -1;
        });
        this.contaOrdena++;
        if (reverse == true) {
            array = array.reverse();
        }
        else if (reverse == 2) {
            // toogle
            if (this.contaOrdena % 2 == 0) {
                array = array.reverse();
            }
        }
        return array;
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			VALIDADOR										\\
    //___________________________________\\
    // Efeito de terremoto em campos com erros no formulario informado
    static TerremotoErros = (form) => {
        mk.QAll(form + " input.input-validation-error").forEach((e) => {
            e.nextElementSibling?.classList.add("mkTerremoto");
            setTimeout(() => {
                e.nextElementSibling?.classList.remove("mkTerremoto");
            }, 500);
        });
    };
    // Funcao tipo isPendente para validacao para mkValida. Aqui valida Pendente apenas.
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
    // Limpar Validates adicionados anteriormente e fazer novamente com os atuais.
    static FixValidate = (form) => {
        // Parse + Remove
        $.validator.unobtrusive.parse($(form).removeData("validator").removeData("unobtrusiveValidation"));
        // Para modificar campos setados:
        // $(form).data('unobtrusiveValidation').options.rules
    };
    // $ Unobtrusive: id do form
    static verificarCampos = (form) => {
        // Fast Parse Call all forms
        $.validator.unobtrusive.parse(document);
        if (mk.Q(form) == null)
            mk.w("Formulário não encontrado:", form);
        // Buscando validador
        let validador = $.data($(form)[0], "validator");
        if (!validador) {
            mk.w("Validador inicialmente NULO. Provavelmente nenhum campo estava como requerido.", validador);
            if (!validador) {
                mk.w("Parse fail", validador);
                return true;
            }
        }
        // Ignorara os campos com classe ignore
        if (validador)
            validador.settings.ignore = ":hidden";
        // Conversor de validadores
        $.validator.unobtrusive.parse(document);
        // Buscando Unobtrusive Validador da microsoft
        let unobtrusiveValidation = $(form).data("unobtrusiveValidation");
        if (!unobtrusiveValidation)
            mk.w("Unobtrusive nulo", unobtrusiveValidation);
        // Executa validador se ele estiver presente
        var resultado = unobtrusiveValidation?.validate();
        mk.l("ModelState é Valido? " + resultado);
        resultado ? null : mk.TerremotoErros(form);
        return resultado;
    };
    // mk.mkValidaFull("#formNovo_model", CallbackFunction, { f: "#formNovo_model" });
    // Funcao Recursiva: Executa mkAindaPendente ate a resposta do HTTP retornar.
    // Parametro(formulario)        Formulario para validar
    // Parametro(fUIValidou)        Funcao a ser executada apos a validacao ser aprovada e recebida
    // Parametro(varRepassaA)       Variavel/Objeto que pode ser passada da solicitacao ate a resposta.
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
                //Auto reexecutar pois o parse do unobtrutive se perde de primeira
                setTimeout(() => {
                    // Validacaes assincronas exigem timer
                    mk.mkValidaFull(form, fUIValidou, varRepassaA);
                }, 10);
            }
            mk.CarregarOFF(); // Loop infinito
        }
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			REGRAR E VALIDAR						\\
    //___________________________________\\
    // A biblioteca precisa estar iniciada para a variavel regras estar presente.
    // Falta:
    // - Um verificador de regras em uma área, ou seja, todos elementos dependentes estão válidos?
    // - Ao validar, executa apenas nos visiveis.
    // REGRAR (Gera uma regra para o campo)
    static regras = [];
    //mk.regrar(eParametro1, { k: "charProibido", v: "" });
    static regrar = (e, ...obj) => {
        if (typeof e == "string") {
            e = mk.Q(e);
        }
        // Incrementar Evento
        let oninput = e.getAttribute("oninput");
        if (!oninput || !oninput.includes(";mk.exeregra(this)")) {
            e.setAttribute("oninput", oninput + ";mk.exeregra(this)");
        }
        // Buscar Elemento e regra
        let novaregra = { e: e, r: [...obj] };
        let posE = mk.regras.findIndex(o => o.e == e);
        if (posE >= 0) {
            // Elemento já encontrado, substituir a regra específica
            novaregra.r.forEach(i => {
                let posRe = mk.regras[posE].r.findIndex(o => o.k == i.k);
                if (posRe >= 0) {
                    for (let p in novaregra.r) {
                        mk.regras[posE].r[posRe] = novaregra.r[p];
                    }
                }
                else {
                    mk.regras[posE].r.push(i);
                }
            });
        }
        else {
            mk.regras.push(novaregra);
        }
        // Limpeza (Elementos fora do DOM) (Tecnica do Invisivel) (Se limpar assim, ao ocultar, elimina/nem cria a regra)
        // for (let r of mk.regras) {
        // 	if (!r.e.offsetParent) {
        // 		mk.regras.splice(mk.regras.indexOf(r), 1)
        // 	}
        // };
        // Auto Executa
        mk.exeregra(e);
    };
    // Retorna um true se todos os elementos internos estão atualmente válidos pelas regras.
    /**
     * e:		elemento do Query alvo da verificação onde irá iterar todos filhos.
     * @param config String do Query ou a Config
     */
    static estaValido = async (config) => {
        if (typeof config != "object") {
            config = { e: config };
        }
        config.e = mk.Q(config.e);
        let validou = false;
        // Cruzar referencias
        let resultado = [];
        mk.regras.forEach(regra => {
            if (mk.isInside(regra.e, config.e)) {
                resultado.push(mk.exeregra(regra.e));
            }
        });
        validou = resultado.flat().length <= 0;
        mkt = resultado;
        this.gc("Validou? ", validou);
        if (!validou) {
            resultado.flat().forEach(r => {
                this.gc("Regra >> " + r.k + " >> Campo:");
                this.l(r.e);
                this.ge();
            });
        }
        this.ge();
        return validou;
    };
    // Função que executa as regras deste campo com base nos objetos salvos
    static exeregra = (e) => {
        let erros = [];
        let regras = mk.regras.find(o => o.e == e)?.r;
        if (regras) {
            regras.forEach(re => {
                if (!re.target) {
                    re.target = "value";
                }
                // O elemento entra na regra quando encontrou erro;
                re.e = e;
                // CHAR PROIBIDO
                if (re.k == "charProibido") {
                    for (let c of re.v) {
                        if (e[re.target].includes(c)) {
                            erros.push(re);
                            e[re.target] = e[re.target].replaceAll(c, "");
                        }
                    }
                }
                // OBRIGATORIO
                if (re.k == "obrigatorio" && re.v == "true") {
                    if (e[re.target] == "") {
                        erros.push(re);
                    }
                }
            });
        }
        if (erros.length > 0) {
            mk.regraDisplay(e, true);
            mk.regraBlink(e);
        }
        else {
            mk.regraDisplay(e, false);
        }
        return erros;
    };
    static regraDisplay = (e, erro) => {
        if (erro) {
            e.classList.add("input-validation-error");
        }
        else {
            e.classList.remove("input-validation-error");
        }
    };
    static regraBlink = (e) => {
        if (typeof e == "string") {
            e = mk.Q(e);
        }
        e.classList.add("regraBlink");
        setTimeout(() => {
            e.classList.remove("regraBlink");
        }, 300);
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			AREA FASEADO								\\
    //___________________________________\\
    // FUNCAO PARA ATUALIZAR OS LINKS DE FASES
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
    // FUNCAO PARA ATUALIZAR A TELINHA
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
    // (OnClick BOTAO) FUNCAO VOLTAR A FASE
    static fUIFaseVoltar = (esteForm) => {
        let obj = {
            destinoFase: this.mkFaseAtual - 1,
            form: esteForm,
        };
        mk.fUIFaseUpdateView(obj);
    };
    // (OnClick BOTAO) FUNCAO AVANCAR A FASE
    static fUIFaseAvancar = (esteForm) => {
        let obj = {
            destinoFase: this.mkFaseAtual + 1,
            form: esteForm,
        };
        mk.mkValidaFull(obj.form, mk.fUIFaseLiberarView, obj);
    };
    // (OnClick BOTAO) FUNCAO LINK PARA FASE ESPECIFICA
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
    // Metodo de controle de grupos de abas.
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
                // Giro do 1 ao Total
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
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			MK Molde (Template/Modelo)	\\
    //___________________________________\\
    static removerAspasDuplas = (s) => {
        if (typeof s == "string") {
            s = s.replaceAll('"', "&quot;");
        }
        return s;
    };
    // Retorna o valor do chave informada, podendo ser obj.obj.chave
    // mk.getV("a.b.c",{a:{b:{c:"d"}}})
    static getV = (keys, objeto) => {
        if (typeof objeto == "object") {
            if (typeof keys == "string") {
                if (keys.includes(".")) {
                    // Multi
                    let ks = keys.split(".");
                    let lastObj = objeto;
                    let lastV = {};
                    // Iterar o Keys, Ver Obj atual e Setar Conteudo;
                    ks.forEach((k) => {
                        lastV = lastObj[k];
                        if (typeof lastV == "object") {
                            lastObj = lastV;
                        }
                    });
                    return lastV;
                }
                else {
                    // Simples
                    return objeto[keys];
                }
            }
            else {
                mk.w("As chaves precisam estar em formato string (" + typeof keys + ")");
            }
        }
        else {
            mk.w("Para ver a chave, o parametro objeto precisa receber um objeto. (" +
                typeof objeto +
                ")");
        }
        return null;
    };
    // Conversor de "${obj.key}" em valor.
    static mkToValue = (mk, o) => {
        let ret = "";
        if (mk.indexOf("${") >= 0) {
            let ini = mk.split("${");
            ret = ini[0];
            for (let i in ini) {
                if (i == "0")
                    continue;
                let end = ini[i].indexOf("}");
                let key = ini[i].slice(0, end);
                if (typeof o == "object" && o != null) {
                    let v = this.removerAspasDuplas(this.getV(key, o));
                    if (v != null) {
                        ret += v;
                    }
                }
                ret += ini[i].slice(end + 1);
            }
        }
        else {
            ret = mk;
        }
        return ret;
    };
    static mkMoldeOA = async (dadosOA, modelo = "#modelo", repositorio = ".tableListagem .listBody") => {
        return new Promise((r) => {
            let eModelo = mk.Q(modelo);
            if (eModelo == null) {
                console.error("Modelo (Template) informado (" + modelo + ") não encontrado.");
                return r(null);
            }
            let eRepositorio = mk.Q(repositorio);
            if (eRepositorio == null) {
                console.error("Repositório informado (" + repositorio + ") não encontrado.");
                return r(null);
            }
            let listaNode = "";
            let mkMoldeOAA_Execute = (o) => {
                let node = eModelo.innerHTML;
                node = mk.mkToValue(node, o);
                listaNode += node;
            };
            mk.mkExecutaNoObj(dadosOA, mkMoldeOAA_Execute);
            //Allow Tags
            listaNode = listaNode.replaceAll("&lt;", "<");
            listaNode = listaNode.replaceAll("&gt;", ">");
            eRepositorio.innerHTML = listaNode;
            r(this); // class mk
        });
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			MK Include									\\
    //___________________________________\\
    static mkInclude = async () => {
        return new Promise((r) => {
            mk.QAll("body *").forEach(async (e) => {
                let destino = e.getAttribute("mkInclude");
                if (destino != null) {
                    //mk.l("Incluindo: " + destino);
                    let p = await mk.get.html({ url: destino, quiet: true });
                    if (p.retorno != null) {
                        e.innerHTML = p.retorno;
                        //mk.mkNodeToScript(mk.Q(".conteudo"));
                    }
                    else {
                        mk.l("Falhou ao coletar dados");
                    }
                    r(p.retorno);
                }
            });
        });
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			MK UI Confirmar							\\
    //___________________________________\\
    // p { corSim: "bVerde", corNao: "bCinza"}
    static mkConfirma = async (texto = "Você tem certeza?", p = null) => {
        let possiveisBotoes = ["bCinza", "bVermelho", "bVerde"];
        let corSim = "bVerde";
        if (p?.corSim != undefined)
            corSim = p.corSim;
        let corNao = "bCinza";
        if (p?.corNao != undefined)
            corNao = p.corNao;
        let classContainer = "";
        if (p?.classContainer != undefined)
            classContainer = p.classContainer;
        return new Promise((r) => {
            function verficiarResposta() {
                let resposta = null;
                if (mk.Q(".mkConfirmadorBloco .mkConfirmadorArea .bBotao.icoSim.true"))
                    resposta = true;
                if (mk.Q(".mkConfirmadorBloco .mkConfirmadorArea .bBotao.icoNao.true"))
                    resposta = false;
                //mk.l("Resposta: " + resposta);
                if (resposta !== null) {
                    mk.Q(".mkConfirmadorBloco .icoSim").classList.remove("true");
                    mk.Q(".mkConfirmadorBloco .icoNao").classList.remove("true");
                    mk.Q(".mkConfirmadorBloco").classList.add("oculto");
                    retornar(resposta);
                }
            }
            let eConfirmar = Array.from(mk.Q("body").children).find((e) => e.classList.contains("mkConfirmadorBloco"));
            if (!eConfirmar) {
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
                divMkConfirmarSim.innerHTML = "Sim";
                divMkConfirmarNao.innerHTML = "Não";
                divMkConfirmarFora.setAttribute("onclick", "mk.w('Essa funcionalidade não está disponível no momento.')");
                divMkConfirmarSim.setAttribute("onclick", "this.classList.add(true);");
                divMkConfirmarNao.setAttribute("onclick", "this.classList.add(true);");
                mk.Q("body").appendChild(divMkConfirmarBloco);
                divMkConfirmarBloco.appendChild(divMkConfirmarFora);
                divMkConfirmarBloco.appendChild(divMkConfirmarArea);
                divMkConfirmarArea.appendChild(divMkConfirmarTitulo);
                divMkConfirmarArea.appendChild(divMkConfirmarTexto);
                divMkConfirmarArea.appendChild(divMkConfirmarBotoes);
                divMkConfirmarBotoes.appendChild(divMkConfirmarSim);
                divMkConfirmarBotoes.appendChild(divMkConfirmarNao);
            }
            else {
                // Limpeza de cores anteriores
                possiveisBotoes.forEach((s) => {
                    mk.QAll(".mkConfirmadorBloco .bBotao").forEach((botao) => {
                        botao.classList.remove(s);
                    });
                });
                // Set das cores novas
                mk.Q(".mkConfirmadorBloco .bBotao.icoSim").classList.add(corSim);
                mk.Q(".mkConfirmadorBloco .bBotao.icoNao").classList.add(corNao);
                mk.Q(".mkConfirmadorBloco").classList.remove("oculto");
                mk.Q(".mkConfirmadorTexto").innerHTML = texto;
            }
            const checkResposta = setInterval(verficiarResposta, 100);
            // Função de conclusão.
            function retornar(resultado = false) {
                clearInterval(checkResposta);
                return r(resultado);
            }
        });
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			MK Botao Imagem (mkBot)			\\
    //___________________________________\\
    // Botao incluido uma imagem/pdf visualizavel e clicavel.
    // Valor inicial no value, quando não presente, exibe data-value.	
    static elementoDuranteUpload;
    static mkBotCheck = async () => {
        mk.QAll("button.mkBot").forEach(async (e) => {
            // Apenas quando contem Atualizar
            let semEvento = e.classList.contains("atualizarSemEvento");
            if (e.classList.contains("atualizar") || semEvento) {
                e.classList.remove("atualizar");
                e.classList.remove("atualizarSemEvento");
                e.classList.add("atualizando");
                // - Remove conteudo
                e.innerHTML = "";
                // - Coleta value do campo (ex: botao tem value="/img/teste.jpg")
                let v = e.getAttribute("value");
                // - Caso Nulo, Tentar pelo dataset
                if (v == null || v == "") {
                    v = e.dataset.value;
                }
                let clicavel = e.dataset.clicavel;
                let exibirbarra = e.dataset.exibirbarra;
                if (v != null && v != "") {
                    let tipo = null;
                    let terminacao = v.slice(v.length - 3, v.length).toString().toLowerCase();
                    // Verificar aqui se trata-se de um link ou de uma base64 direto no elemento.					
                    // - Verifica se terminacao do arquivo é PDF ou OUTRO,
                    if ((v.includes("application/pdf")) || (terminacao == "pdf")) {
                        tipo = "pdf";
                    }
                    // << Inicio do conteúdo
                    let retornar = "<";
                    // FORMATOS DE ARQUIVO
                    if (tipo == "pdf") {
                        retornar += "embed type='application/pdf' class='mkCem mkBotEmbed' src='" + v;
                    }
                    else {
                        retornar +=
                            e.innerHTML = "img class='mkCem' src='" + v;
                    }
                    if (exibirbarra) {
                        retornar += "#toolbar=0";
                    }
                    // << Fim o conteúdo
                    retornar += "'>";
                    // Se é ou não clicavel
                    if (!clicavel) {
                        retornar += "<div class='mkBotSobre'></div>";
                    }
                    // Set
                    e.innerHTML = retornar;
                    // Ao concluir, tenta executar atributo onchange, se houver
                    if (!semEvento) {
                        if (e.onchange) {
                            e.onchange();
                        }
                    }
                }
                else {
                    mk.w("Elemento com 'value' nulo. Esperava-se conteudo: ", v);
                }
                e.classList.remove("atualizando");
            }
        });
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			MK Recomendador (mkRec)			\\
    //___________________________________\\
    static mkRecRenderizar = async () => {
        mk.QAll("input.mkRec").forEach(async (e) => {
            // Gerar Elemento de recomendações
            if (!e.nextElementSibling?.classList.contains("mkRecList")) {
                let ePai = e.parentElement;
                let ePos = Array.from(ePai?.children).indexOf(e);
                let divMkRecList = document.createElement("div");
                divMkRecList.className = "mkRecList emFoco";
                divMkRecList.setAttribute("tabindex", "-1");
                ePai?.insertBefore(divMkRecList, ePai?.children[ePos + 1]);
                // Incrementar Evento
                let oninput = e.getAttribute("oninput");
                if (!oninput || !oninput.includes(";mk.mkRecUpdate(this)")) {
                    e.setAttribute("oninput", oninput + ";mk.mkRecUpdate(this)");
                }
                let onfocus = e.getAttribute("onfocus");
                if (!oninput || !oninput.includes(";mk.mkRecFoco(this,true)")) {
                    e.setAttribute("onfocus", oninput + ";mk.mkRecFoco(this,true)");
                }
                let onblur = e.getAttribute("onblur");
                if (!oninput || !oninput.includes(";mk.mkRecFoco(this,false)")) {
                    e.setAttribute("onblur", oninput + ";mk.mkRecFoco(this,false)");
                }
                e.setAttribute("autocomplete", "off");
                const popperInstance = Popper.createPopper(e, divMkRecList, {
                    placement: "bottom-start",
                    strategy: "fixed",
                    modifiers: [],
                });
                mk.poppers.push(popperInstance);
                mk.mkRecUpdate(e);
            }
            else {
                if (!e.getAttribute("data-selarray") && e.getAttribute("data-refill")) {
                    //await mk.mkRecDelRefillProcesso(e as HTMLElement);
                }
                let geraEvento = false;
                if (e.classList.contains("atualizar"))
                    geraEvento = true;
                // Atualiza a lista com base na classe "atualizar" (Gera Evento input e change)
                if (e.classList.contains("atualizar") || e.classList.contains("atualizarSemEvento")) {
                    e.classList.remove("atualizar");
                    e.classList.remove("atualizarSemEvento");
                    e.classList.add("atualizando");
                    mk.mkRecUpdate(e);
                    e.classList.remove("atualizando");
                }
                if (geraEvento) {
                    // Executa evento, em todos atualizar.
                    // O evento serve para que ao trocar o 1, o 2 execute input para então o 3 tb ter como saber que é pra atualizar
                    e.dispatchEvent(new Event("input"));
                    e.dispatchEvent(new Event("change"));
                }
            }
        });
    };
    static mkRecUpdate = (e) => {
        // Recebe o elemento input principal.
        // GERA CADA ITEM DA LISTA COM BASE NO JSON
        if (e?.getAttribute("data-selarray") != "") {
            let eList = e.nextElementSibling;
            let array = e.dataset.selarray;
            eList.innerHTML = "";
            if (mk.isJson(array)) {
                let kvList = JSON.parse(array);
                let c = 0;
                /* ITENS */
                kvList.forEach((o) => {
                    if (o.v != null && o.v != "") {
                        if (mk.like(e.value, o.v) && e.value.trim() != o.v.trim()) {
                            c++;
                            let item = document.createElement("div");
                            let itemTexto = document.createElement("span");
                            item.className = "recItem";
                            item.setAttribute("data-k", o.k);
                            item.setAttribute("onmousedown", "mk.mkRecChange(this,'" + o.v + "')");
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
                mk.w("mkRecUpdate(e):  atributo selarray Não é um JSON válido: ", array);
            }
        }
        else {
            mk.w("mkRecUpdate(e): Elemento não encontrado ou selarray dele está vazia.", e);
        }
    };
    static mkRecChange = (recItem, texto) => {
        let e = recItem?.parentElement?.previousElementSibling;
        if (e) {
            e.value = texto;
            setTimeout(() => { mk.mkRecUpdate(e); e.focus(); }, 10);
        }
        else {
            mk.w("Não foi possível alterar o elemento: ", e);
        }
    };
    static mkRecFoco = (input, f) => {
        let e = input?.nextElementSibling;
        if (e) {
            if (!f) {
                e.classList.add("emFoco");
            }
            else {
                e.classList.remove("emFoco");
            }
        }
        else {
            mk.w("Não foi possível alterar o elemento: ", e);
        }
    };
    //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
    //			MK Seletor (mkSel)					\\
    //___________________________________\\
    static poppers = [];
    /* CRIA O DROPDOWN por FOCUS */
    static mkSelRenderizar = async () => {
        mk.QAll("input.mkSel").forEach(async (e) => {
            // Transforma elemento se ele ainda não foi transformado
            if (!e.parentElement?.classList.contains("mkSelBloco")) {
                // COLETA
                let ePai = e.parentElement;
                let ePos = Array.from(ePai?.children).indexOf(e);
                // ELEMENTO no BLOCO
                let divMkSeletorBloco = document.createElement("div");
                let divMkSeletorPesquisa = document.createElement("div");
                let divMkSeletorInputExibe = document.createElement("input");
                let divMkSeletorInputExibeArrow = document.createElement("div");
                let divMkSeletorList = document.createElement("div");
                // Nomeando Classes
                divMkSeletorBloco.className = "mkSelBloco";
                divMkSeletorPesquisa.className = "mkSelPesquisa";
                divMkSeletorInputExibe.className = "mkSelInputExibe";
                divMkSeletorInputExibeArrow.className = "mkSelInputExibeArrow";
                divMkSeletorList.className = "mkSelList";
                // ORDEM no DOM
                ePai?.insertBefore(divMkSeletorBloco, ePai?.children[ePos]);
                divMkSeletorBloco.appendChild(e);
                divMkSeletorBloco.appendChild(divMkSeletorPesquisa);
                divMkSeletorBloco.appendChild(divMkSeletorList);
                divMkSeletorPesquisa.appendChild(divMkSeletorInputExibe);
                divMkSeletorPesquisa.appendChild(divMkSeletorInputExibeArrow);
                // Transfere style
                divMkSeletorBloco.setAttribute("style", e.getAttribute("style") ?? "");
                // Flexas que movem o selecionado quando há apenas 1 possibilidade de selecao.
                if (e.getAttribute("data-selmovesel") == "true" &&
                    e.getAttribute("data-selapenas") == "1") {
                    let divMkSelArrowSelLeft = document.createElement("div");
                    let divMkSelArrowSelRight = document.createElement("div");
                    divMkSelArrowSelLeft.className = "mkSelArrowSelLeft microPos6";
                    divMkSelArrowSelRight.className = "mkSelArrowSelRight microPos4";
                    divMkSeletorPesquisa.appendChild(divMkSelArrowSelLeft);
                    divMkSeletorPesquisa.appendChild(divMkSelArrowSelRight);
                    divMkSelArrowSelLeft.setAttribute("onclick", "mk.mkSelLeftSel(this)");
                    divMkSelArrowSelRight.setAttribute("onclick", "mk.mkSelRightSel(this)");
                    divMkSeletorBloco.style.setProperty("--mkSelArrowSize", "24px");
                }
                // Seta atributos e Gatilhos
                e.removeAttribute("style");
                e.setAttribute("readonly", "true");
                e.setAttribute("tabindex", "-1");
                mk.mkSelTabIndex(e);
                divMkSeletorInputExibe.setAttribute("placeholder", "Filtro \u{1F50D}");
                divMkSeletorInputExibe.setAttribute("onfocus", "mk.mkSelPesquisaFocus(this)");
                divMkSeletorInputExibe.setAttribute("onblur", "mk.mkSelPesquisaBlur(this)");
                divMkSeletorInputExibe.setAttribute("oninput", "mk.mkSelPesquisaInput(this)");
                divMkSeletorInputExibe.setAttribute("onkeydown", "mk.mkSelPesquisaKeyDown(event)");
                divMkSeletorInputExibe.setAttribute("autocomplete", "off");
                divMkSeletorList.addEventListener("scroll", (ev) => {
                    mk.mkSelMoveu(ev.target);
                });
                // Popular Lista
                mk.mkSelPopularLista(e);
                // Seleciona baseado no value do input
                mk.mkSelUpdate(e);
                // Deixar Elemento de forma visivel, mas inacessivel.
                if (e.getAttribute("data-dev") != "true") {
                    e.classList.add("mkSecreto");
                }
                // v2
                const popperInstance = Popper.createPopper(divMkSeletorPesquisa, divMkSeletorList, {
                    placement: "bottom-start",
                    strategy: "fixed",
                    modifiers: [],
                });
                mk.poppers.push(popperInstance);
            }
            else {
                // Se não tem array, mas tem o refill e entrou para atualizar, faz o processo de refill genérico
                if (!e.getAttribute("data-selarray") && e.getAttribute("data-refill")) {
                    await mk.mkSelDelRefillProcesso(e);
                }
                // Atualiza a lista com base na classe "atualizar" (Gera Evento input e change)
                if (e.classList.contains("atualizar")) {
                    e.classList.remove("atualizar");
                    e.classList.add("atualizando");
                    mk.mkSelPopularLista(e);
                    mk.mkSelUpdate(e);
                    // Executa evento, em todos atualizar.
                    // O evento serve para que ao trocar o 1, o 2 execute input para então o 3 tb ter como saber que é pra atualizar
                    e.dispatchEvent(new Event("input"));
                    e.dispatchEvent(new Event("change"));
                    e.classList.remove("atualizando");
                }
                if (e.classList.contains("atualizarSemEvento")) {
                    e.classList.remove("atualizarSemEvento");
                    e.classList.add("atualizando");
                    mk.mkSelPopularLista(e);
                    mk.mkSelUpdate(e);
                    e.classList.remove("atualizando");
                }
                // Manter index em -1 para não chegar até esse campo
                e.setAttribute("tabindex", "-1");
                mk.mkSelTabIndex(e);
                //mk.mkSelReposicionar(e.parentElement.children[2]);
            }
        });
        // Atualiza posição com a mesma frequencia que pesquisa os elementos.
        mk.poppers.forEach((o) => {
            o.update();
        });
    };
    static mkSelDelRefillProcesso = async (eName, cod = null) => {
        return new Promise(async (r) => {
            let e = mk.Q(eName);
            if (e) {
                let url = appPath + e.getAttribute("data-refill");
                cod != null ? (url += cod) : null;
                let p = await mk.get.json(url);
                if (p.retorno != null) {
                    let kv = p.retorno;
                    if (typeof p.retorno == "object") {
                        kv = JSON.stringify(p.retorno);
                    }
                    if (mk.isJson(kv)) {
                        e.setAttribute("data-selarray", kv);
                        r(e);
                    }
                    else {
                        console.error("Resultado não é um JSON. (mkSelDlRefill)");
                    }
                }
            }
            else {
                mk.w("Função (mkSelDlRefill) solicitou Refill em um campo inexistente (JS)");
            }
        });
    };
    static mkSelDlRefill = async (eName, cod, clear = true) => {
        mk.mkSelDelRefillProcesso(eName, cod).then((e) => {
            if (clear)
                e.value = "";
            e.classList.add("atualizar");
        });
    };
    // Quando desativado, precisa desativar o TAB também
    static mkSelTabIndex = (e) => {
        if (e.classList.contains("disabled")) {
            let pes = e.nextElementSibling;
            if (pes) {
                if (pes.classList.contains("mkSelPesquisa")) {
                    pes.firstElementChild?.setAttribute("tabindex", "-1");
                }
            }
        }
        else {
            let pes = e.nextElementSibling;
            if (pes) {
                if (pes.classList.contains("mkSelPesquisa")) {
                    pes.firstElementChild?.removeAttribute("tabindex");
                }
            }
        }
    };
    /* Ao Tentar Selecionar um novo item */
    static mkSelSelecionar = (eItem) => {
        let ePrincipal = eItem.parentElement?.parentElement?.firstElementChild;
        let KV = mk.mkSelGetKV(ePrincipal);
        // Obtem limite de seleções
        let selapenas = ePrincipal?.getAttribute("data-selapenas") || 1;
        let selLimit = Number(selapenas);
        // QUANDO O LIMITE é 1
        if (selLimit == 1) {
            // Muda valor do input pelo clicado e Gera o evento
            ePrincipal.value = eItem.getAttribute("data-k");
            ePrincipal?.dispatchEvent(new Event("input"));
            // Transfere valor para o Display (Exibe)
            (eItem?.parentElement?.previousElementSibling?.firstElementChild).value =
                eItem.innerHTML;
        }
        else if (selLimit > 1 || selLimit < 0) {
            let itemK = eItem.getAttribute("data-k");
            let jaSelecionado = 0;
            // Forma um array caso ainda não seja, pois pode seleconar mais de um.
            let arraySelecionado = [];
            // Verifica se algum KV.k é o K clicado. (Para saber se vai adicionar ou remover)
            KV.forEach((ObjKV) => {
                arraySelecionado.push(ObjKV.k.toString());
                if (ObjKV.k == itemK)
                    jaSelecionado++;
            });
            if (jaSelecionado > 0) {
                // Remove valor da lista selecionada
                arraySelecionado.splice(arraySelecionado.indexOf(itemK), 1);
            }
            else {
                // Verifica se é possivel selecionar mais (Se estiver negativo, pode selecionar infinito)
                if (arraySelecionado.length < selLimit || selLimit < 0) {
                    // Acrescenta valor
                    arraySelecionado.push(itemK);
                }
            }
            // Limpar seleções vazias
            arraySelecionado.forEach((item) => {
                if (item == "") {
                    arraySelecionado.splice(arraySelecionado.indexOf(item), 1);
                }
            });
            // Quando estiver vazio, reseta o campo.
            // Seta o valor no campo de input
            if (arraySelecionado.length == 0) {
                ePrincipal.value = ePrincipal.defaultValue;
            }
            else {
                let string = JSON.stringify(arraySelecionado);
                if (ePrincipal.type == "text")
                    ePrincipal.value = string;
                else
                    console.error("Erro durante o Set/Conversão do campo. É necessário que este campo seja tipo string.");
            }
            // Gera o Evento
            ePrincipal.dispatchEvent(new Event("input"));
            // Mantem foco no Display, pois pode selecionar mais de um
            setTimeout(() => {
                eItem.parentElement.previousElementSibling.firstElementChild.focus();
            }, 1);
        }
        mk.mkSelUpdate(ePrincipal);
        // Evento change apos terminar a atualizacao
        ePrincipal.dispatchEvent(new Event("change"));
    };
    // Selecionar o anterior ao atual
    static mkSelLeftSel = (e) => {
        let eAlvo = null;
        Array.from(e.parentElement?.nextElementSibling?.children).forEach((el) => {
            if (el.getAttribute("data-s") == "1") {
                eAlvo = el.previousElementSibling;
                return;
            }
        });
        if (eAlvo == null) {
            mk.mkSelSelecionar(e.parentElement?.nextElementSibling?.lastElementChild);
        }
        else {
            if (eAlvo.classList.contains("mkSelItemDeCima")) {
                eAlvo = eAlvo.parentElement?.lastElementChild
                    ?.previousElementSibling;
            }
            mk.mkSelSelecionar(eAlvo);
        }
    };
    // Selecionar o próximo ao atual
    static mkSelRightSel = (e) => {
        let eAlvo = null;
        Array.from(e.parentElement.nextElementSibling.children).forEach((el) => {
            if (el.getAttribute("data-s") == "1") {
                eAlvo = el.nextElementSibling;
                return;
            }
        });
        if (eAlvo == null) {
            mk.mkSelSelecionar(e.parentElement.nextElementSibling.firstElementChild);
        }
        else {
            if (eAlvo.classList.contains("mkSelItemDeBaixo")) {
                eAlvo = eAlvo.parentElement?.firstElementChild
                    ?.nextElementSibling;
            }
            mk.mkSelSelecionar(eAlvo);
        }
    };
    static mkSelPopularLista = (e) => {
        // GERA CADA ITEM DA LISTA COM BASE NO JSON
        if (e.getAttribute("data-selarray") != "") {
            let eList = e.nextElementSibling.nextElementSibling;
            eList.innerHTML = "";
            try {
                let seletorArray = JSON.parse(e.getAttribute("data-selarray"));
                if (seletorArray != null) {
                    let c = 0;
                    /* ITENS */
                    seletorArray.forEach((o) => {
                        if (o.k != null) {
                            c++;
                            let divMkSeletorItem = document.createElement("div");
                            let divMkSeletorItemTexto = document.createElement("span");
                            let divMkSeletorItemArrow = document.createElement("div");
                            divMkSeletorItem.className = "mkSelItem";
                            divMkSeletorItemArrow.className = "mkSelItemArrow";
                            divMkSeletorItem.setAttribute("data-k", o.k);
                            divMkSeletorItem.setAttribute("onmousedown", "mk.mkSelSelecionar(this)");
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
                            divMkSelCima.setAttribute("onmousemove", "mk.mkSelMoveCima(this);");
                            divMkSelCima.innerHTML = "↑ ↑ ↑";
                            eList.insertBefore(divMkSelCima, eList.firstElementChild);
                            let divMkSelBaixo = document.createElement("div");
                            divMkSelBaixo.className = "mkSelItemDeBaixo microPos8";
                            divMkSelBaixo.setAttribute("onmousemove", "mk.mkSelMoveBaixo(this);");
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
    /* EVENTO de Pesquisa (FOCUS) */
    static mkSelPesquisaFocus = (e) => {
        // Atualiza Itens Selecionados, caso houve mudança sem atualizar.
        mk.mkSelUpdate(e.parentElement.previousElementSibling);
        // Limpa o Display
        e.value = "";
        // Limpa o resultado do filtro anterior
        let eList = e.parentElement.nextElementSibling;
        let ePrimeiroSel = null;
        Array.from(eList.children).forEach((el) => {
            el.style.display = "";
            el.removeAttribute("data-m");
            if (el.getAttribute("data-s") == 1 && ePrimeiroSel == null)
                ePrimeiroSel = el;
        });
        // Faz movimento no scroll até o primeiro item selecionado
        let primeiroOffSet = ePrimeiroSel?.offsetTop || 0;
        eList.scrollTop =
            primeiroOffSet - 120 - (eList.offsetHeight - eList.clientHeight) / 2;
        // Atualizar posição da Lista.
        mk.mkSelReposicionar(e.parentElement.nextElementSibling);
    };
    static getParentScrollTop = (e) => {
        let eHtml = e;
        let soma = 0;
        while (eHtml.tagName != "HTML") {
            soma += eHtml.scrollTop;
            eHtml = eHtml.parentElement;
        }
        return soma;
    };
    static mkSelReposicionar = (eList) => {
        // Redimenciona a lista do tamanho do campo pesquisar
        let ew = eList.previousElementSibling.offsetWidth;
        eList.style.minWidth = ew + "px";
        eList.style.maxWidth = ew + "px";
        /* Substituido pelo Poper
        // Posiciona a lista.
        // Lado esquerdo baseado na posicao, mas em mobile fica full.
        let wLargura = window.innerWidth;
        if (wLargura < 768) {
            eList.style.top = 35 + "px";
            eList.style.left = 35 + "px";
        } else {
            // Primeiramente seta a posição ref ao input fixo.
            eList.style.top =
                eRef.offsetTop -
                mk.getParentScrollTop(eRef) +
                eRef.offsetHeight +
                2 +
                "px";
    
            eList.style.left = eRef.offsetLeft + "px";
            // Depois, verifica se saiu da tela
            let posXCantoOpostoRef = eRef.offsetLeft + eRef.offsetWidth;
            let posXCantoOpostoList = eList.offsetLeft + eList.offsetWidth;
            if (posXCantoOpostoList > (mk.Q("body") as HTMLElement).offsetWidth) {
                eList.style.left = posXCantoOpostoRef - eList.offsetWidth - 1 + "px";
            }
        }
    */
    };
    /* EVENTO de Pesquisa (BLUR) */
    static mkSelPesquisaBlur = (e) => {
        mk.mkSelUpdate(e.parentElement.previousElementSibling);
    };
    /* EVENTO de Pesquisa (KEYDOWN) */
    static mkSelPesquisaKeyDown = (ev) => {
        let isNegado = false;
        //mk.l(ev);
        if (ev.key == "Escape") {
            ev.srcElement.blur();
        }
        if (ev.key == "ArrowUp" || ev.key == "ArrowDown" || ev.key == "Enter") {
            isNegado = true;
            let eList = ev.srcElement.parentElement.nextElementSibling;
            let eListItem;
            let array = Array.from(eList.children).filter((e) => {
                return e.style.display != "none";
            });
            let eM = array.find((e) => e.getAttribute("data-m") == "1");
            Array.from(eList.children).forEach((e) => e.removeAttribute("data-m"));
            if (ev.key == "Enter") {
                if (eM)
                    mk.mkSelSelecionar(eM);
                ev.srcElement.blur();
            }
            if (ev.key == "ArrowUp") {
                isNegado = true;
                let ultimo = array[array.length - 1];
                let peNultimo = array[array.length - 2];
                if (eM) {
                    let indexProximo = array.indexOf(eM) - 1;
                    if (array[indexProximo] &&
                        !array[indexProximo].classList.contains("mkSelItemDeCima")) {
                        eListItem = array[indexProximo];
                    }
                    else {
                        if (ultimo?.classList.contains("mkSelItemDeBaixo")) {
                            eListItem = peNultimo;
                        }
                        else {
                            eListItem = ultimo;
                        }
                    }
                }
                else {
                    if (ultimo?.classList.contains("mkSelItemDeBaixo")) {
                        eListItem = peNultimo;
                    }
                    else {
                        eListItem = ultimo;
                    }
                }
                eListItem?.setAttribute("data-m", "1");
                let alvoOffsetTop = eListItem?.offsetTop || 0;
                eList.scrollTop =
                    alvoOffsetTop - 120 - (eList.offsetHeight - eList.clientHeight) / 2;
            }
            if (ev.key == "ArrowDown") {
                isNegado = true;
                if (eM) {
                    let indexProximo = array.indexOf(eM) + 1;
                    if (array[indexProximo] &&
                        !array[indexProximo].classList.contains("mkSelItemDeBaixo")) {
                        eListItem = array[indexProximo];
                    }
                    else {
                        if (array[0]?.classList.contains("mkSelItemDeCima")) {
                            eListItem = array[1];
                        }
                        else {
                            eListItem = array[0];
                        }
                    }
                }
                else {
                    if (array[0]?.classList.contains("mkSelItemDeCima")) {
                        eListItem = array[1];
                    }
                    else {
                        eListItem = array[0];
                    }
                }
                eListItem?.setAttribute("data-m", "1");
                let alvoOffsetTop = eListItem?.offsetTop || 0;
                eList.scrollTop =
                    alvoOffsetTop - 120 - (eList.clientHeight - eList.offsetHeight) / 2;
                // console.table({
                // 	Resultado: eList.scrollTop,
                // 	eListItem: eListItem.offsetTop,
                // 	eListOffsetTop (120): eList.offsetTop,
                // 	eListOffSetHeight: eList.offsetHeight,
                // 	eListClientHeight: eList.clientHeight,
                // });
            }
        }
        if (isNegado) {
            ev.preventDefault();
        }
    };
    /* EVENTO de Pesquisa (INPUT) */
    static mkSelPesquisaInput = (e) => {
        let cVisivel = 0;
        let eList = e.parentElement.nextElementSibling;
        Array.from(eList.children).forEach((el) => {
            let exibe = false;
            if (el.classList.contains("mkSelItem")) {
                let strInputado = e.value.toLowerCase();
                let strFromKv = el.firstElementChild.innerHTML.toLowerCase();
                if (mk.like(strInputado, strFromKv)) {
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
    // Receber e = div .mkSelList
    static mkSelMoveu = (e) => {
        if (e.firstElementChild.classList.contains("mkSelItemDeCima")) {
            // if (e.scrollTop == 0) {
            // 	e.firstElementChild.style.display = "none";
            // 	e.lastElementChild.style.display = "";
            // } else if (e.scrollTop + e.clientHeight >= e.scrollHeight) {
            // 	e.firstElementChild.style.display = "";
            // 	e.lastElementChild.style.display = "none";
            // } else {
            e.firstElementChild.style.display = "";
            e.lastElementChild.style.display = "";
            // }
        }
    };
    // Receber e = div .mkSelItemDeCima
    static mkSelMoveCima = (e) => {
        let eList = e.parentElement;
        eList.scrollTop = eList.scrollTop - 5;
        mk.mkSelMoveu(eList);
    };
    // Receber e = div .mkSelItemDeBaixo
    static mkSelMoveBaixo = (e) => {
        let eList = e.parentElement;
        eList.scrollTop = eList.scrollTop + 5;
        mk.mkSelMoveu(eList);
    };
    /* ATUALIZA Display e Selecionados*/
    static mkSelUpdate = (e, KV = null) => {
        if (KV == null) {
            KV = mk.mkSelGetKV(e);
        }
        // Desmarcar todos mkSelItem pra 0
        Array.from(e.nextElementSibling.nextElementSibling.children).forEach((el) => {
            el.setAttribute("data-s", "0");
        });
        KV.forEach((o) => {
            /* Marcar mkSelItem pra 1 onde tem K selecionado */
            Array.from(e.nextElementSibling.nextElementSibling.children).forEach((item) => {
                if (item.getAttribute("data-k") == o.k) {
                    item.setAttribute("data-s", "1");
                }
            });
        });
        // Seta Valor do display
        mk.mkSelSetDisplay(e, KV);
    };
    // SET a ARRAY do SELETOR, formato MAP (Recebe array de arrays)
    static mkSelArraySetMap = (e, map) => {
        if (e) {
            if (map instanceof Map) {
                let kv = [];
                for (let [k, v] of map) {
                    kv.push({
                        k: k,
                        v: v,
                    });
                }
                mk.mkSelArraySetKV(e, kv);
            }
            else {
                mk.w("Função mkSelArraySetMap() precisa receber um objeto formato Map no segundo parametro");
            }
            return e;
        }
        else {
            mk.w("Função mkSelArraySetMap() precisa receber o elemento no primeiro parametro");
            return null;
        }
    };
    // SET a ARRAY do SELETOR, formato KV (Recebe uma array de objetos)
    static mkSelArraySetKV = (e, kv) => {
        let kvj = JSON.stringify(kv);
        e.dataset.selarray = kvj;
        e.classList.add("atualizarSemEvento");
        return e;
    };
    // GET do ARRAY do SELETOR, formato MAP
    static mkSelArrayGetMap = (e) => {
        let kvs = e.dataset.selarray;
        let map = [];
        if (mk.isJson(kvs)) {
            let kv = JSON.parse(kvs);
            kv.forEach((o) => {
                map.push([o.k, o.v]);
            });
        }
        return new Map(map);
    };
    // GET do ARRAY do SELETOR, formato KV
    static mkSelArrayGetKV = (e) => {
        let kv = e.dataset.selarray;
        if (mk.isJson(kv)) {
            kv = JSON.parse(kv);
        }
        return kv;
    };
    // GET do ATUAL SELECIONADO do SELETOR, formato MAP
    static mkSelGetMap = (e) => {
        let kv = mk.mkSelGetKV(e);
        let map = [];
        kv.forEach((o) => {
            map.push([o.k, o.v]);
        });
        return new Map(map);
    };
    // GET do ATUAL SELECIONADO do SELETOR, formato KV
    // Retorna o Objeto em formato KV dos itens selecionados do elemento E
    static mkSelGetKV = (e) => {
        let kSels;
        let kOpcoes;
        // Lista de Selecoes vira K do KV
        if (mk.isJson(e.value)) {
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
        // Prepara lista de Opções para iterar
        if (mk.isJson(e.dataset.selarray)) {
            kOpcoes = JSON.parse(e.dataset.selarray);
            if (!Array.isArray(kOpcoes)) {
                kOpcoes = [{ k: kOpcoes, v: "\u{2209} Opções" }];
            }
        }
        else
            kOpcoes = null;
        if (kOpcoes != null) {
            // Acrescentar V ao KV
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
    static mkSelSetDisplay = (e, KV) => {
        if (KV.length <= 0) {
            mk.w("Não foi possível encontrar os itens selecionados.");
            e.nextElementSibling.firstElementChild.value = "Opções \u{2209}";
        }
        else {
            if (KV.length == 1) {
                let display = "-- Selecione --";
                if (KV[0].v != null) {
                    display = KV[0].v;
                }
                if (display == "-- Selecione --") {
                    // Criado um argumento indicando que o VALOR do campo está dessincronizado com as POSSIBILIDADDES em kv.
                    e.dataset.selerror = "true";
                    e.dataset.selerrorMsg =
                        "O item selecionado não está na lista de possibilidades";
                }
                else {
                    e.dataset.selerror = "false";
                    e.dataset.selerrorMsg = "";
                }
                e.nextElementSibling.firstElementChild.value = display;
            }
            else if (KV.length > 1) {
                e.nextElementSibling.firstElementChild.value =
                    "[" + KV.length + "] Selecionados";
            }
        }
    };
    // IMPORTAR - Classe - Coleta o html externo
    static importar = async (tagBuscar = ".divListagemContainer") => {
        return new Promise((r) => {
            mk.QAll(tagBuscar + " *").forEach(async (e) => {
                let destino = e.getAttribute("mkImportar");
                if (destino != null) {
                    let p = await mk.get.html({ url: destino, quiet: true });
                    if (p.retorno != null) {
                        e.removeAttribute("mkImportar");
                        e.innerHTML = p.retorno;
                        try {
                            mk.mkNodeToScript(e);
                        }
                        catch (error) {
                            console.group("Auto Import por TAG lancou erros:");
                            console.error("ERRO: ", error);
                            mk.ge();
                        }
                    }
                    else {
                        mk.l("Falhou ao coletar dados");
                    }
                    r(p.retorno);
                }
            });
        });
    };
    // Variavel de recarga que permite modificar a frequencia de atualizacao
    // em casos de telas sobrecarregadas.
    static mkRecargaTimer = 500;
    static mkRecargaTimerPause = false;
    // Reloader (RECURSIVA TIMEROUT)
    //Constroi, Reconstroi novos, Reposiciona e Corrige elementos
    static mkRecargaExe = () => {
        if (!mk.mkRecargaTimerPause) {
            mk.mkSelRenderizar();
            mk.mkRecRenderizar();
            mk.mkBotCheck();
            // Itera sobre todos os Poppers para atualizar na mesma frequencia deste intervalo.
            mk.poppers.forEach((o) => {
                // AQUI seria bom só dar update em quem não ta oculto.
                o.update();
            });
        }
        // Recursiva
        setTimeout(mk.mkRecargaExe, mk.mkRecargaTimer);
    };
} // <<< FIM MK Class.
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//		AO INICIAR										\\
//___________________________________\\
mk.mkClicarNaAba(mk.Q(".mkAbas a.active")); // Inicia no ativo
mk.mkRecargaExe();
