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
	url: string | null = new URL("GetList", window.location.href.split("?")[0]).href; // Requer a URL para o fetch dos dados. Se não tiver, passar os dados no parametros dados e tornar esse null.
	dados: any[] | null = null; // Caso a tela já tenha os dados, podem ser passador por aqui, se não deixar 
	container: string = ".divListagemContainer"; // Classe / Id de onde será buscada uma tabela para ser populada.
	idmodelo: string = "#modelo"; // Classe / Id do template/script contendo o formato de exibição de cada registro da lista.
	design: mkt_design | null = null; // Lista de Configuração de coluna, como Label, Formato do conteudo, Classes padrões...
	filtros: string | null = ".iConsultas"; // Busca por esta classe para filtrar campos por nome do input.
	container_importar: boolean = false; // No container, executa importar dados baseados no atributo.
	filtroExtra: Function | null = null; // modificaFiltro Retorna um booleano que permite um filtro configurado externamente do processoFiltragem.
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
	c: mkt_config;
	db: IDBDatabase | null = null;
	dadosFull: any = []; // Todos os dados sem filtro, mas ordenaveis.
	dadosFiltrado: any = []; // Mesmos dadosFull, mas após filtro.
	dadosExibidos: any = []; // Clonado de dadosFiltrado, mas apenas os desta pagina.
	alvo: any = {}; // Guarda o objeto selecionado permitindo manupular outro dado com este de referencia.
	thisListNum = 0;
	idContainer: any = 0;

	vars = {
		objFiltro: {}, // Itens Filtrados
		divTabela: ".divListagemContainer", // Class do container da tabela
		urlOrigem: "", // URL de origem dos dados a serem populados
		pagAtual: 1, // Representa a pagina
		tablePorPagina: null, // TAG: Total de linhas exibidas por página.
		tableTotal: null, // TAG: Total de registros.
		sortBy: "", // Propriedade a ser ordenada. (Apenas 1)
		sortDir: false, // Direcao dos itens ordenados? true / false
		totalFull: this.dadosFull.length,
		totalFiltrado: this.dadosFiltrado.length,
		totalExibidos: this.dadosExibidos.length,
		pagPorPagina: 5, // VAR: Total de linhas exibidas por página.
		pagItensIni: 0,
		pagItensFim: 0,
		totPags: 0,
		versaoDb: 1,
		pk: null, // Possivel setar o nome do campo que é primary key já na construcao
	}

	constructor(mktconfig: mkt_config) {
		if (mktconfig == null) {
			this.c = new mkt_config();
		} else {
			this.c = mktconfig;
		}
	}



	static vars: any;
	static moldeWorker: Function;
	static classof: Function;
	static Inicializar: Function;
	static mkClicarNaAba: Function;
	static exeTimer: Function;
	static infolog = true; // Desliga / Liga Log do console
}

Object.defineProperty(mkt, "vars", {
	value: {
		exeTimer: 500,
		poppers: [],
		worker: null as Worker | null,
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
		let mkWorkerElement = document.createElement("script")
		mkWorkerElement.setAttribute("type", "javascript/worker")
		mkWorkerElement.setAttribute("id", "mkWorker")
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
		}`
		document.body.append(mkWorkerElement);
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   ABA                            \\
//___________________________________\\

Object.defineProperty(mkt, "mkClicarNaAba", {
	value: (este: HTMLElement | Element) => {
		if (este != null) {
			let estaAba = Number(este.getAttribute("data-pag"));
			let listaAbas = este.parentElement?.parentElement;
			listaAbas?.querySelectorAll("a").forEach((e) => {
				e.classList.remove("active");
			});
			este.classList.add("active");
			let totalAbas: number = Number(listaAbas?.getAttribute("data-mkabas"));
			for (let i = 1; i <= totalAbas; i++) {
				// Giro do 1 ao Total
				mk.QAll(".mkAba" + i).forEach((e) => {
					if (i == estaAba) {
						e.classList.remove("oculto");
					} else {
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
	value: (o: any) => {
		return Object.prototype.toString.call(o).slice(8, -1);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "Inicializar", {
	value: () => {
		mkt.moldeWorker()
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
		mkt.vars.poppers.forEach((o: any) => {
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

