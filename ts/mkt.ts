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

// CLASSE Do Design das colunas para formar o mkt.
class mktm {
	get [Symbol.toStringTag]() { return "mktm"; }
	pk: boolean = false; // Este campo é Primary Key?
	k: string | null = null; // Key / Chave (Propriedade do objeto)
	v: any = null;	// Valor (Inicialmente nulo, mas ao recuperar o objeto da lista ele vem preenchido)
	l: string | null = null; // Label (Texto que descreve o campo)
	r: RegExp | null = null; // Regex para validar o campo
	tag: string | null = "input"; // Qual é a tag do campo caso ele precise preencher?
	atr: string | null = "type='text'" // Todos os atributos padrões deste campo.
	classes: string = "mkCampo" // Classes padrões / iniciais deste campo
	target: string = "value" // Propriedade para edição (value, innerHTML).
}


// CLASSE DE CONFIG (Construtor único)
class mkt_config {
	url: string | null = new URL("GetList", window.location.href.split("?")[0]).href; // Requer a URL para o fetch dos dados. Se não tiver, passar os dados no parametros dados e tornar esse null.
	dados: any[] | null = null; // Caso a tela já tenha os dados, podem ser passador por aqui, se não deixar 
	nomeTabela: string | null = null; // Nome da tabela (Usado pra contruir o banco de dados)
	container: string = ".divListagemContainer"; // Classe / Id de onde será buscada uma tabela para ser populada.
	idmodelo: string = "#modelo"; // Classe / Id do template/script contendo o formato de exibição de cada registro da lista.
	model: Array<mktm> = []; // Lista de Configuração de coluna, como Label, Formato do conteudo, Classes padrões...
	container_importar: boolean = false; // No container, executa importar dados baseados no atributo.
	filtroExtra: Function | null = null; // modificaFiltro Retorna um booleano que permite um filtro configurado externamente do processoFiltragem.
	filtros: string | null = ".iConsultas"; // Busca por esta classe para filtrar campos por nome do input.
	hearSort: boolean = true; // Indicador se ativará o ordenamento ao clicar no cabeçalho
	hearMenu: boolean = true; // Indicador se ativará o botãozinho que abre o filtro completo do campo.
	sortBy: string | null = null; // Campo a ser ordenado inicialmente;
	sortDir: Number | null = 0; // 0,1,2 = Crescente, Decrescente, Toogle;
}

// Event Based:
// - aoConcluirDownload
// - aoConcluirFiltragem
// - aoConcluirExibicao


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
		urlOrigem: "" as string | null, // URL de origem dos dados a serem populados
		pagAtual: 1, // Representa a pagina
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
		pk: null as string | null, // Possivel setar o nome do campo que é primary key já na construcao
		filtro: null as string | null,
		tbody: null as string | null,
		ths: null as string | null,
		pagBotoes: null as string | null,
		tableResultado: null as string | null,
		tablePorPagina: null as string | null, // TAG: Total de linhas exibidas por página.
		tableExibePorPagina: null as string | null,
		tableTotal: null as string | null, // TAG: Total de registros.
		tableFiltrado: null as string | null,
		tableIni: null as string | null,
		tableFim: null as string | null,
		tableInicioFim: null as string | null,
		pag: null as string | null,
		pagBotao: null as string | null,
		nomeTabela: null as string | null,
	}

	constructor(mktconfig: mkt_config) {
		if (mktconfig == null) {
			this.c = new mkt_config();
		} else {
			this.c = mktconfig;
		}
		// Mapeamento dos elementos baseado no container informado.
		this.vars.tbody = this.c.container + " tbody";
		this.vars.ths = this.c.container + " th";
		this.vars.pagBotoes = this.c.container + " .pagBotoes";
		this.vars.tableResultado = this.c.container + " .tableResultado";
		this.vars.tablePorPagina = this.c.container + " input[name='tablePorPagina']";
		this.vars.tableExibePorPagina = this.c.container + " .tableExibePorPagina";
		this.vars.tableTotal = this.c.container + " .tableTotal";
		this.vars.tableFiltrado = this.c.container + " .tableFiltrado";
		this.vars.tableIni = this.c.container + " .tableIni";
		this.vars.tableFim = this.c.container + " .tableFim";
		this.vars.tableInicioFim = this.c.container + " .tableInicioFim";
		this.vars.pag = this.vars.pagBotoes + " .pag";
		this.vars.pagBotao = this.vars.pagBotoes + " .pagBotao";
		// Mesmo sem Design no contrutor, vai formando um mínimo necessário.
		// Gerando Design de Modelo Aceitável
		if (mk.classof(this.c.model) != "Array") this.c.model = [];
		// Impede a inserção de modelos que não são objetos da classe mktm
		if (this.c.model?.length > 0) {
			this.c.model?.forEach(o => {
				if (mk.classof(o) != "mktm") {
					o = new mktm();
				}
				if (o.pk) {
					this.vars.pk = o.k;
				}
			})
		}
		if (this.vars.pk == null) {
			mk.w("Nenhuma Primary Key encontrada no Model.");
		}
		if (this.c.url != null) {
			let w = mkt.mkWorker();
			w.postMessage({ c: "FETCH", u: this.c.url });
			w.onmessage = (ev) => {
				console.log("A Recebido> C: ", ev.data.c, " D: ", ev.data.d);
			}
			w.onerror = (ev) => {
				console.log("A> Erro: ", ev);
				ev.preventDefault();
			}
		}
	}



	static vars: any;
	static mkWorker: Function;
	static moldeWorker: Function;
	static classof: Function;
	static Inicializar: Function;
	static mkClicarNaAba: Function;
	static exeTimer: Function;
	static infolog = true; // Desliga / Liga Log do console
}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   Variaveis Estáticas            \\
//___________________________________\\
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
