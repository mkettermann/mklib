"use strict";
//
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   Master Key Tools               \\
//___________________________________\\
// Recriando a partir da mk para:
// - Tornar um construtor unico. (Estava ficando difícel de manter organizado no outro formato)
// - Separar as tarefas de contrução e ordenamento em um worker.
// - Implementação de banco de dados indexavel.
// - Implementação de Design de colunas.
// - Tentar tornar as funções de sobreescrever em Event Based.
// CLASSE DE CONFIG (Construtor único)
class mkt_config {
    url = new URL("GetList", window.location.href.split("?")[0]).href; // Requer a URL para o fetch dos dados. Se não tiver, passar os dados no parametros dados e tornar esse null.
    dados = null; // Caso a tela já tenha os dados, podem ser passador por aqui, se não deixar 
    container = ".divListagemContainer"; // Classe / Id de onde será buscada uma tabela para ser populada.
    idmodelo = "#modelo"; // Classe / Id do template/script contendo o formato de exibição de cada registro da lista.
    design = null; // Lista de Configuração de coluna, como Label, Formato do conteudo, Classes padrões...
    filtros = ".iConsultas"; // Busca por esta classe para filtrar campos por nome do input.
    container_importar = false; // No container, executa importar dados baseados no atributo.
    filtroExtra = null; // modificaFiltro Retorna um booleano que permite um filtro configurado externamente do processoFiltragem.
}
// Event Based:
// - aoConcluirDownload
// - aoConcluirFiltragem
// - aoConcluirExibicao
// CLASSE Do Design das colunas para formar o mkt.
class mkt_design {
}
// CLASSE INSTANCIAVEL
class mkt {
    c;
    db = null;
    dadosFull = []; // Todos os dados sem filtro, mas ordenaveis.
    dadosFiltrado = []; // Mesmos dadosFull, mas após filtro.
    dadosExibidos = []; // Clonado de dadosFiltrado, mas apenas os desta pagina.
    alvo = {}; // Guarda o objeto selecionado permitindo manupular outro dado com este de referencia.
    thisListNum = 0;
    idContainer = 0;
    vars = {
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
        versaoDb: 1,
        pk: null, // Possivel setar o nome do campo que é primary key já na construcao
    };
    constructor(mktconfig) {
        if (mktconfig == null) {
            this.c = new mkt_config();
        }
        else {
            this.c = mktconfig;
        }
    }
    static vars;
    static moldeWorker;
    static classof;
    static Inicializar;
    static mkClicarNaAba;
    static exeTimer;
    static infolog = true; // Desliga / Liga Log do console
}
Object.defineProperty(mkt, "vars", {
    value: {
        exeTimer: 500,
        poppers: [],
        worker: null,
    }, enumerable: false, writable: false, configurable: false,
});
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   WORKERS                        \\
//___________________________________\\
Object.defineProperty(mkt, "mkWorker", {
    value: () => {
        // Se estiver nulo, constroi o worker;
        if (mkt.vars.worker == null) {
            let eSctWorker = mkt.Q("#mkWorker");
            var urlBlob = window.URL.createObjectURL(new Blob([eSctWorker?.textContent], { type: "text/javascript" }));
            mkt.vars.worker = new Worker(urlBlob);
        }
        return mkt.vars.worker;
    }, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "moldeWorker", {
    value: () => {
        let mkWorkerElement = document.createElement("script");
        mkWorkerElement.setAttribute("type", "javascript/worker");
        mkWorkerElement.setAttribute("id", "mkWorker");
        mkWorkerElement.innerHTML = `
		const l = (...args) => {
			console.log("W> ", ...args);
		}
		onmessage = (ev) => {
			l("Evento: ", ev);
			if (ev?.data?.c) {
				switch (ev.data.c) {
					case "MSG":
						l("C: ", ev.data.c, " D: ", ev.data.d);
						break;
					case "PUT_MKDATA":
						
						break;
					default:
				}
			}
			// Ao receber um comando, executar um Job.
			//postMessage({ c: "MSG", d: ["Show"] });
		}`;
        document.body.append(mkWorkerElement);
    }, enumerable: false, writable: false, configurable: false,
});
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   ABA                            \\
//___________________________________\\
Object.defineProperty(mkt, "mkClicarNaAba", {
    value: (este) => {
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
    }, enumerable: false, writable: false, configurable: false,
});
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   UTEIS                          \\
//___________________________________\\
Object.defineProperty(mkt, "classof", {
    value: (o) => {
        return Object.prototype.toString.call(o).slice(8, -1);
    }, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "Inicializar", {
    value: () => {
        mkt.moldeWorker();
        mkt.mkClicarNaAba(mk.Q(".mkAbas a.active")); // Inicia no ativo
        mkt.exeTimer();
    }, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "exeTimer", {
    value: () => {
        mk.mkSelRenderizar();
        mk.mkRecRenderizar();
        mk.mkBotCheck();
        // Itera sobre todos os Poppers para atualizar na mesma frequencia deste intervalo.
        mkt.vars.poppers.forEach((o) => {
            if (!o.state.elements.popper.classList.contains("oculto")) {
                o.update();
            }
        });
        // Recursiva
        setTimeout(mkt.exeTimer, mkt.vars.exeTimer);
    }, enumerable: false, writable: false, configurable: false,
});
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   Auto Inicializar               \\
//___________________________________\\
mkt.Inicializar();
