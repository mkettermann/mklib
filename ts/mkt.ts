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
var mkz = null;

declare const Popper: any;
declare const appPath: any;

// CLASSE Do Design das colunas para formar o mkt.
class mktm {
	pk: boolean = false; // Este campo é Primary Key?
	k: string | null = null; // Key / Chave (Propriedade do objeto)
	v: any = null;	// Valor (Inicialmente nulo, mas ao recuperar o objeto da lista ele vem preenchido)
	l: string | null = null; // Label (Texto que descreve o campo)
	r: RegExp | null = null; // Regex para validar o campo
	tag: string | null = "input"; // Qual é a tag do campo caso ele precise preencher?
	atr: string | null = "type='text'" // Todos os atributos padrões deste campo.
	classes: string = "mkCampo" // Classes padrões / iniciais deste campo
	target: string = "value" // Propriedade para edição (value, innerHTML).
	f: boolean = true; // Indicador se é iteravel no filtro HeadMenu.
	constructor(o: any) {
		if (o.k) this.k = o.k;
		if (o.pk) this.pk = o.pk;
		if (o.l) this.l = o.l;
		if (o.r) this.r = o.r;
		if (o.v) this.v = o.v;
		if (o.tag) this.tag = o.tag;
		if (o.atr) this.atr = o.atr;
		if (o.classes) this.classes = o.classes;
		if (o.target) this.target = o.target;
		if (o.f == false) this.f = false;
	}
	get [Symbol.toStringTag]() { return "mktm"; }
}


// CLASSE DE CONFIG (Construtor único)
class mktc {
	url: string | null = window.location.href.split("?")[0] + "/GetList"; // Requer a URL para o fetch dos dados. Se não tiver, passar os dados no parametros dados e tornar esse null.
	dados: any[] | null = null; // Caso a tela já tenha os dados, podem ser passador por aqui, se não deixar 
	nomeTabela: string | null = null; // Nome da tabela (Usado pra contruir o banco de dados)
	container: string = ".divListagemContainer"; // Classe / Id de onde será buscada uma tabela para ser populada.
	idmodelo: string = "#modelo"; // Classe / Id do template/script contendo o formato de exibição de cada registro da lista.
	model: Array<mktm> = []; // Lista de Configuração de coluna, como Label, Formato do conteudo, Classes padrões...
	qntInicial: number = 1000; // Quantidade de coleta inicial de dados.
	qntSolicitada: number = 5000; // Quantidade de coleta de dados ao solicitar mais.
	container_importar: boolean = false; // No container, executa importar dados baseados no atributo.
	filtroExtra: Function | null = null; // modificaFiltro Retorna um booleano que permite um filtro configurado externamente do processo Filtragem.
	filtro: string | null = ".iConsultas"; // Busca por esta classe para filtrar campos por nome do input.
	filtroDinamico: boolean | null = null;; // Nessa listagem o filtro por tecla não é dinâmico por padrão.
	headSort: boolean = true; // Indicador se ativará o ordenamento ao clicar no cabeçalho
	headMenu: boolean = true; // Indicador se ativará o botãozinho que abre o filtro completo do campo.
	exibeBotaoMais: boolean = true; // Indicador se ativará o botãozinho que abre o filtro completo do campo.
	// Os demais podem se alterar durante as operações da listagem.
	sortBy: string | null = null; // Campo a ser ordenado inicialmente;
	sortDir: Number | null = 1; // 0,1,2 = Crescente, Decrescente, Toogle;
	objFiltro: any = {}; // Itens Filtrados
	urlOrigem = "" as string | null; // URL de origem dos dados a serem populados
	pagAtual: number = 1; // Representa a pagina
	totalFull = 0;
	totalFiltrado = 0;
	totalExibidos = 0;
	pagPorPagina = 5; // VAR = Total de linhas exibidas por página.
	pagItensIni = 0;
	pagItensFim = 0;
	totPags = 0;
	ativarDbCliente = false; // Quando ativo, salva o dado consultado por um worker em um indexedDb formando um cache rápido de dados no cliente.
	versaoDb = 1;
	pk = null as string | null; // Possivel setar o nome do campo que é primary key já na construcao
	tbody = "tbody";
	ths = "th";
	pagBotoes = ".pagBotoes";
	tableResultado = ".tableResultado";
	tablePorPagina = "*[name='tablePorPagina']"; // TAG = Total de linhas exibidas por página.
	tableExibePorPagina = ".tableExibePorPagina";
	tableTotal = ".tableTotal"; // TAG = Total de registros.
	tableFiltrado = ".tableFiltrado";
	tableIni = ".tableIni";
	tableFim = ".tableFim";
	tableInicioFim = ".tableInicioFim";
	pag = ".pag"; // Indica o paginador atual de 0 a 8: ex: .pag7
	pagBotao = ".pagBotao";
	botaoAdicionarMaisClasse = "divListagemMaisItens";
	botaoNovaConsulta: HTMLButtonElement | string | null = "#btnConsultar"; // Informando o botao. Ao modificar a variavel de fim de lista, trava o botao / destrava.
	dbInit = (store: IDBObjectStore) => { } // Funcao de contrução do design do banco de dados
	// Alterar essas funções para modificar dados durante etapas.
	aoIniciarListagem = async (este: mkt) => { }; // Recebe a própria instancia no parametro.
	aoPossuirDados = async (dadosFull: any, este: mkt) => { }; // Recebe os dados de dadosFull
	aoConcluirFiltragem = async (dadosFiltrado: any, este: mkt) => { }; // Recebe os dados filtrados
	aoAntesDePopularTabela = async (dadosExibidos: any, este: mkt) => { }; // Recebe os dados a serem exibidos desta página
	aoConcluirExibicao = async (este: mkt) => { };
	aoReceberDados = (o: any, este: mkt) => { return o; }; // Função que se executa nos Cruds de objetos e quando se constroi a listagem.
	constructor(array: Array<mktm>) {
		if (mkt.classof(array) == "Array") {
			this.model = array;
		}
		if (this.url) { this.url = this.url?.replace("//GetList", "/GetList"); }
		// Verifica existencia do valor padrão do botaoNovaConsulta.
		if (!mkt.Q(this.botaoNovaConsulta)) {
			this.botaoNovaConsulta = null;
		}
		// Se tem botão para consultar, então o padrão é filtroDinamico iniciar true.
		if (this.botaoNovaConsulta == null) {
			this.filtroDinamico = true; // Quando não tem botão, o filtro fica a cada tecla.
		} else {
			this.filtroDinamico = false;
		}
	};
	// SET Exemplo: new mktc().set("dados",[]).set("url",null)
	// new mkt(new mktc().set("dados", []).set("url", null).set("idmodelo", "#modeloRefPes").set("container", "#tabRefPessoais"));
	set: Function = (propriedade: string, valor: any) => {
		if (propriedade in this) {
			this[propriedade as keyof typeof this] = valor;
		} else {
			mkt.w("A classe mktc (.set(Propriedade)) não possui a propriedade: ", propriedade);
		}
		return this;
	};
	get [Symbol.toStringTag]() { return "mktc"; }
}


// CLASSE INSTANCIAVEL
class mkt {
	static vars: any;
	static stringify: Function;
	static Workers: Function;
	static addTask: Function;
	static classof: Function;
	static Inicializar: Function;
	static mkClicarNaAba: Function;
	static exeTimer: Function;
	static log = true; // Desliga / Liga Log do console
	static headMenuHide: Function;
	static headMenuPrevious: Function;
	static headMenuNext: Function;
	static headMenuCrescente: Function;
	static headMenuDecrescente: Function;
	static headMenuLimpar: Function;
	static headMenuLimparTodos: Function;
	static headMenuContemInput: Function;
	static headMenuFiltraExclusivo: Function;
	static headMenuMarcarExclusivos: Function;
	static headMenuHideX: Function;
	static toString: Function;
	static regras: any = [];
	static t: any;
	static MESES: any;
	static CORES: any;
	static util: any;
	static mascarar: Function;
	static elementoDuranteUpload: any;
	static contaImportados = 0;
	static Q: Function;
	static QAll: Function;
	static l: Function;
	static w: Function;
	static erro: Function;
	static gc: Function;
	static ge: Function;
	static ct: Function;
	static cte: Function;
	static importar: Function;
	static Ao: Function;
	static mkLimparOA: Function;
	static mkExecutaNoObj: Function;
	static mkMoldeOA: Function;
	static get: any;
	static post: any;
	static sortDir: Function;
	static QverOff: Function;
	static QverOn: Function;
	static Qoff: Function;
	static Qon: Function;
	static html: Function;
	static wait: Function;
	static ordenar: Function;
	static processoFiltragem: Function;
	static getV: Function;
	static clonar: Function;
	static allSubPropriedades: Function;
	static removeEspecias: Function;
	static toLocale: Function;
	static removerAspas: Function;
	static AoConfig: Function;
	static request: Function;
	static getMs: Function;
	static getDia: Function;
	static getMes: Function;
	static getAno: Function;
	static getFullData: Function;
	static atribuir: Function;
	static mkDuasCasas: Function;
	static regraDisplay: Function;
	static isInside: Function;
	static TerremotoErros: Function;
	static contem: Function;
	static isJson: Function;
	static apenasNumeros: Function;
	static apenasLetras: Function;
	static apenasNumerosLetras: Function;
	static toMoeda: Function;
	static fromMoeda: Function;
	static toNumber: Function;
	static fromNumber: Function;
	static CarregarON: Function;
	static CarregarOFF: Function;
	static errosLog: Function;
	static delObjetoFromId: Function;
	static setObjetoFromId: Function;
	static aCadaElemento: Function;
	static cadaExe: Function;
	static detectedServerOn: Function;
	static detectedServerOff: Function;
	static mkFloat: Function;
	static parseJSON: Function;
	static hojeMkData: Function;
	static hojeMkHora: Function;
	static hoje: Function;
	static getDiasDiferenca: Function;
	static transMsEmDias: Function;
	static mkNodeToScript: Function;
	static frequencia: Function;
	static mkYYYYMMDDtoDDMMYYYY: Function;
	static mkBoolToSimNaoOA: Function;
	static mkFormatarDataOA: Function;
	static exeregra: Function;
	static m: any;
	static vibrar: Function;
	static estaValido: Function;
	static mkToValue: Function;
	static mkRecUpdate: Function;
	static like: Function;
	static mkSelTabIndex: Function;
	static mkSelMoveu: Function;
	static mkSelPopularLista: Function;
	static mkSelUpdate: Function;
	static mkSelDelRefillProcesso: Function;
	static mkSelGetKV: Function;
	static mkSelSelecionar: Function;
	static mkSelReposicionar: Function;
	static mkSelSetDisplay: Function;
	static mkSelArraySetKV: Function;
	static mkSelRenderizar: Function;
	static mkRecRenderizar: Function;
	static mkBotCheck: Function;

	c: mktc;
	db: IDBDatabase | null = null;
	dadosFull: any = []; // Todos os dados sem filtro, mas ordenaveis.
	dadosFiltrado: any = []; // Mesmos dadosFull, mas após filtro.
	dadosExibidos: any = []; // Clonado de dadosFiltrado, mas apenas os desta pagina.
	alvo: any = {}; // Guarda o objeto selecionado permitindo manupular outro dado com este de referencia.
	thisListNum = 0;
	idContainer: any = 0;
	exclusivos: any = [];
	hmunsel: any = [];
	ultimoGet = -1;
	ultimoParametro = ""; // Aqui precisa ser vazio, pois esse dado indica a primeira consulta.
	cTotUltimoParametro = 0;
	solicitadoUltimoParametro = 0;
	aindaTemMais = true;
	totalappends = 0;

	constructor(_mktc: mktc | null) {
		if (_mktc == null) {
			this.c = new mktc([]);
		} else {
			this.c = _mktc;
		}
		let cs = this.c.container + " ";
		// Incrementa o container para garantir a seleção do elemento
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
		// Mesmo sem Design no contrutor, vai formando um mínimo necessário.
		// Gerando Design de Modelo Aceitável
		if (mkt.classof(this.c.model) != "Array") this.c.model = [];
		// Impede a inserção de modelos que não são objetos da classe mktm
		if (this.c.model?.length > 0) {
			this.c.model?.forEach(o => {
				if (mkt.classof(o) != "mktm") {
					o = new mktm({});
				}
				if (o.pk) {
					this.c.pk = o.k;
				}
			})
		}
		// PRIMARY KEY ALERTA (Necessária para CRUDs)
		if (this.c.pk == null) {
			// No modelo não estava setado uma pk, tentar buscar no template.
			let modelo = mkt.Q(this.c.idmodelo)?.getAttribute("pk");
			if (modelo) {
				this.c.pk = modelo;
			} else {
				mkt.w("Nenhuma Primary Key encontrada no Config ou no Template)");
			}
		}
		if (mkt.Q(this.c.container)) {
			this.autoStartConfig();
		}
	}

	autoStartConfig = async (arg: any = {}) => {
		// SE for importar: Espera o container para então continuar.
		if (this.c.container_importar) { await mkt.importar(this.c.container); }
		// SE GATILHO EXTERNO inicialmente bloqueado
		if (mkt.Q(this.c.botaoNovaConsulta)) {
			if (this.c.qntInicial > 0) { // Se há consulta inicial, então o consultar já vem travado até modificar.
				mkt.Qoff(this.c.botaoNovaConsulta);
			}
		}
		// GATILHOS do Container da tabela (Paginação e Limite por Página)
		// Seta Gatilho dos botoes de paginacao.
		if (mkt.Q(this.c.pagBotao)) {
			mkt.QAll(this.c.pagBotao).forEach((li: HTMLLIElement) => {
				li.addEventListener("click", (ev) => {
					this.mudaPag(ev.target);
				});
			});
		}
		// Seta Gatilho do indicador de quantidade por pagina.
		if (mkt.Q(this.c.tablePorPagina)) {
			mkt.Ao("input", this.c.tablePorPagina, async (e: HTMLInputElement) => {
				mkt.l("TablePorPagina: ", this.c.tablePorPagina);
				this.atualizaNaPaginaUm();
			});
		}

		// Ativar THEAD funcionalidades
		this.headAtivar();

		//Adiciona eventos aos botões do filtro
		this.setFiltroListener();

		// Inicial SortBy
		if (!this.c.sortBy)
			this.c.sortBy = this.c.pk; // Padrão PK
		// Inicial SortDir
		if (!this.c.sortDir)
			this.c.sortDir = 1; // Padrão 0 Decrescente por ID Deixando a Ultima ID no topo

		// Inicial Sort
		this.setDirSort(this.c.sortBy, Number(this.c.sortDir));

		let started = false;
		if (this.c.dados != null) {
			if (mkt.classof(this.c.dados) == "Array") {
				if (await this.appendList(this.c.dados) != null) {
					started = true;
					this.startListagem();
				}
			} else {
				mkt.w("Os dados informados precisa ser uma Lista. (Array). Recebido:", mkt.classof(this.c.dados));
			}
		}
		if (this.c.url != null) {
			// URL de coleta informada.
			if (mkt.classof(this.c.url) == "String") {
				this.c.urlOrigem = this.c.url;
				if (await this.appendList(this.c.url) != null) {
					if (!started) {
						started = true;
						this.startListagem();
					} else {
						this.atualizarListagem();
					}
				}
			}
		} else {
			// Quando não tiver url, ocultar botão de puxar mais
			this.aindaTemMais = false;
		}

		// Check e config da quantidade de download
		if (mkt.classof(this.c.qntSolicitada) != "Number") {
			this.c.qntSolicitada = 10000;
		} else if (this.c.qntSolicitada < 0) {
			this.c.qntSolicitada = 10000;
		}
		if (mkt.classof(this.c.qntInicial) != "Number") {
			this.c.qntInicial = this.c.qntSolicitada;
		} else if (this.c.qntInicial <= 0) {
			this.c.qntInicial = this.c.qntSolicitada;
		}

		if (this.c.dados == null && this.c.url == null) {
			mkt.w("Nenhuma fonte de dados encontrada. Não será possível popular a listagem sem dados.")
		}
		if (!started) {
			// Se chegar aqui sem iniciar, avança zerado.
			mkt.erro("A lista foi iniciada sem confirmação dos dados. Provavelmente ocorreu erro na coleta de dados.")
			this.startListagem();
		}
	}

	mais = async (parametros: string | null = null, novaurl: string | null = null) => {
		return new Promise((r) => {
			if (novaurl == null) {
				this.c.url = this.c.urlOrigem;
			} else {
				this.c.url = novaurl;
			}
			if (parametros == null) {
				// Se não informar parametro ou informar o mesmo parametro da ultima consulta, indica que está carregando a continuação: lista.mais();
				parametros = this.ultimoParametro;
			}
			if (mkt.classof(this.c.url) == "String") {
				this.appendList(this.c.url as string, parametros, true).then(re => {
					this.atualizarListagem();
					r(true);
				});
			} else {
				mkt.w("mais() - Url informada não é uma string: ", mkt.classof(this.c.url));
				r(false);
			}

		});
	}

	appendList = async (data_url: string | Array<any>, parametros: string = "", fromMais: boolean = false) => {
		return new Promise((r) => {
			if (mkt.classof(data_url) == "Array") {
				for (let i = 0; i < data_url.length; i++) {
					if (i < this.c.qntInicial) { // APENAS LISTA SOLICITA INICIAL
						this.dadosFull.push(this.c.aoReceberDados(data_url[i], this));
					}
				}
				this.dadosCheck();
				r(true);
			} else if (mkt.classof(data_url) == "String") {
				// Aqui é a primeira coleta.
				// qntSolicitada
				// qntInicial representa o valor inicial a ser solicitado

				this.totalappends++;
				let carregador = false;
				let solicitar = this.c.qntInicial;
				if (parametros != this.ultimoParametro) {
					this.ultimoParametro = parametros;
					this.cTotUltimoParametro = 0;
					this.dadosFull = []; // Se muda dadosFull pra valor inferior ao que tinha, pagAtual precisa voltar a 1;
					this.c.pagAtual = 1;
					this.totalappends = 1;
					carregador = true;
					solicitar = this.c.qntSolicitada;
					if (this.c.botaoNovaConsulta != null) {
						mkt.Qoff(this.c.botaoNovaConsulta);
					}
				}
				if (fromMais) {
					// Quando a função Mais() que chamar esta, a quantidade solicitada tem prioridade sobre a inicial;
					solicitar = this.c.qntSolicitada;
				}
				this.solicitadoUltimoParametro = solicitar;
				// Passa LIST REQUEST e LIST HAVE.
				let urlTemp = (data_url as string)?.split("?")[0] + "?lr=" + solicitar + "&lh=" + this.cTotUltimoParametro;
				if (!urlTemp.includes("://")) urlTemp = window.location.origin + urlTemp;
				urlTemp += parametros;
				//this.ultimaUrlComParametro = urlTemp; // Se for impedir chamadas iguais.
				mkt.get.json({ url: urlTemp, carregador: carregador }).then((p: any) => {
					if (p.retorno != null) {
						this.ultimoGet = p.retorno.length;
						this.cTotUltimoParametro += this.ultimoGet; // Soma do Ultimo mais o atual
						for (let i = 0; i < p.retorno.length; i++) {
							this.dadosFull.push(this.c.aoReceberDados(p.retorno[i], this));
						}
						if (this.ultimoGet < this.solicitadoUltimoParametro) {
							// Quando o Recebido for inferior ao solicitado:
							this.aindaTemMais = false;
							mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoBaixarTodosDados"));
							let eAddMais = mkt.Q(this.c.container)?.querySelector("." + this.c.botaoAdicionarMaisClasse);
							if (eAddMais) {
								eAddMais.remove();
							}
						} else if (this.ultimoGet > this.solicitadoUltimoParametro) {
							// Caso o BackEnd enviar a mais do que o solicitado,
							//  então é possível que esteja configurado pra trazer tudo
							// e nesse caso o botão não deve surgir
							this.aindaTemMais = false;
						} else {
							// Quando o recebido é igual ou veio até mais do que o solicitado:
							this.aindaTemMais = true;
						}
						this.dadosCheck();
						r(p.retorno.length);
					} else {
						r(null);
					}
				});
			} else {
				r(null);
			}

			// MECANICA CACHE CLIENT SIDE.
			// A cada APPENDLIST um PUT no indexed;
			if (this.c.ativarDbCliente) {
				// DB CON
				// if (this.c.nomeTabela != null) {
				// 	this.db = await this.dbCon();
				// }
				// if (this.c.nomeTabela) {
				// 	// DB FILL
				// 	let tx = this.db?.transaction(this.c.nomeTabela, "readwrite");
				// 	let store = tx?.objectStore(this.c.nomeTabela);
				// 	this.dadosFull.forEach((o: any) => {
				// 		store?.put(o);
				// 	});
				// 	if (tx) tx.oncomplete = () => {
				// 		// All requests have succeeded and the transaction has committed.
				// 	};
				// }
			}
		});
	}

	// Inicia a listagem com os dados atuais.
	startListagem = async (arg: any = {}) => {
		//EVENT: aoIniciarListagem
		mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoIniciarListagem"));
		this.c.aoIniciarListagem(this);

		// Limpar Dados nulos
		mkt.mkLimparOA(this.dadosFull);

		//EVENT: aoPossuirDados
		mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoPossuirDados"));
		await this.c.aoPossuirDados(this.dadosFull, this);

		// Ordena a lista geral com base na primeira propriedade.
		mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);

		// Executa um filtro inicial e na sequencia processa a exibição.
		this.updateFiltro();
		this.efeitoSort();
		// Remove oculto, caso encontre a tag
		if (mkt.Q(this.c.tableResultado))
			mkt.Q(this.c.tableResultado).classList.remove("oculto");

		// Inicia download do resto da lista
		//this.startDownloadContinuo();


	};

	dadosCheck = () => {
		// Verificação de ChavesRepetidas
		mkt.addTask({ k: "ChavesRepetidas", v: this.dadosFull, target: this.c.pk }).then((r: any) => {
			if (r.v.length > 0) {
				mkt.l("ALERTA!", this.c.nomeTabela, "possui CHAVES PRIMARIAS DUPLICADAS:", r.v);
			}
		});
		// Verificação de Duplices
		mkt.addTask({ k: "Duplices", v: this.dadosFull, target: this.c.pk }).then((r: any) => {
			if (r.v.length > 0) {
				mkt.l("ALERTA!", this.c.nomeTabela, "possui CONTEÚDO REPETIDO:", r.v);
			}
		});
	}

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			MK DB Client-Side						\\
	//___________________________________\\
	dbCon = async (): Promise<IDBDatabase | null> => {
		return new Promise((r) => {
			if (mkt.classof(this.c.nomeTabela) == "String") {
				let dbConOpen = indexedDB.open(this.c.nomeTabela as string, this.c.versaoDb);
				dbConOpen.onerror = (...args) => { mkt.erro(args); r(null); }
				dbConOpen.onsuccess = () => {
					r(dbConOpen.result);
				}
				dbConOpen.onupgradeneeded = () => {
					// Aqui da pra melhorar com o getModel() 
					// Pré criar a tabela com os K do getModel();
					let conParametros: IDBObjectStoreParameters = {};
					if (this.c.pk != null && this.c.pk != "" && this.c.pk != "pk") {
						conParametros.keyPath = this.c.pk;
					}

					// CREATE TABLE
					let store = dbConOpen.result.createObjectStore(this.c.nomeTabela as string, conParametros);
					if (mkt.classof(this.c.dbInit) == "Function") {
						this.c.dbInit(store);
					}
					// INDEX
					// store.createIndex("porNome", "mNome", { unique: true });
					// DADOS INICIAIS
					// store.put({
					//  	"mId": 2,
					//		"mNome": "Fulano Sem Dados",
					//		"mStatus": null
					// });

					r(dbConOpen.result);
				}
			} else {
				mkt.w("dbCon() - nomeTabela não informado: ", this.c.nomeTabela);
				r(null);
			}
		});
	}

	/**
	 * ATUALIZA a listagem com os dados ja ordenados.
	 * Executa a filtragem dos dados;
	 */
	atualizarListagem = async () => {
		let pagBotoes = mkt.Q(this.c.pagBotoes);
		// Processo de filtro que usa o objFiltro nos dadosFull e retorna dadosFiltrado já filtrado.
		this.dadosFiltrado = mkt.processoFiltragem(
			this.dadosFull,
			this.c.objFiltro,
			this
		);
		// Processar calculos de paginacao
		this.atualizarStatusListagem();

		//EVENT: aoConcluirFiltragem
		mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoConcluirFiltragem"));
		await this.c.aoConcluirFiltragem(this.dadosFiltrado, this);

		// Apenas executa a atualização do resumo, se a pagBotoes estiver presente na página.
		if (this.c.totalFiltrado > this.c.pagPorPagina)
			pagBotoes?.removeAttribute("hidden");
		else pagBotoes?.setAttribute("hidden", "");
		if (this.c.totalFiltrado == 0) {
			mkt.Q(this.c.tableInicioFim)?.setAttribute("hidden", "");
			mkt.Q(this.c.tableExibePorPagina)?.setAttribute("hidden", "");
			mkt.Q(this.c.tbody)?.setAttribute("hidden", "");
			this.dadosExibidos = [];
		} else {
			if (pagBotoes) {
				mkt.Q(this.c.tableInicioFim)?.removeAttribute("hidden");
				mkt.Q(this.c.tableExibePorPagina)?.removeAttribute("hidden");
				this.processoPaginar();
			} else {
				// Caso não tenha onde paginar, exibe geral sem clonar.
				this.dadosExibidos = this.dadosFiltrado;
			}
			mkt.Q(this.c.tbody)?.removeAttribute("hidden");

			//EVENT: aoAntesDePopularTabela
			mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoAntesDePopularTabela"));
			await this.c.aoAntesDePopularTabela(this.dadosExibidos, this);

			// Apenas se estiver configurado para exibir o botão de continuidade.
			if (this.c.exibeBotaoMais) {
				// Apenas quando há mais dados a serem puxados:
				if (this.aindaTemMais) {
					// Apenas se estiver na última págiana:
					if (this.c.totPags == this.c.pagAtual) {
						let container = mkt.Q(this.c.container);
						if (!container.querySelector("." + this.c.botaoAdicionarMaisClasse)) {
							let mklEFim = document.createElement("div");
							mklEFim.className = this.c.botaoAdicionarMaisClasse;
							mklEFim.innerHTML = mkt.m.carregarmais;
							mkt.Ao("click", mklEFim, (e: HTMLDivElement) => {
								this.mais();
								e.classList.add("disabled");
							})
							container.querySelector("table")?.parentElement?.appendChild(mklEFim);
						}
					} else {
						mkt.Q(this.c.container + " ." + this.c.botaoAdicionarMaisClasse)?.remove();
					}
				}
			}
			await mkt.mkMoldeOA(this.dadosExibidos, this.c.idmodelo, this.c.tbody);

			//EVENT: aoConcluirExibicao
			mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoConcluirExibicao"));
			await this.c.aoConcluirExibicao(this);
		}
	};

	// Atualiza o objeto que contem os dados desta instancia.
	atualizarStatusListagem = () => {
		if (mkt.Q(this.c.tablePorPagina) != null) {
			this.c.pagPorPagina = Number(
				(mkt.Q(this.c.tablePorPagina) as HTMLInputElement).value
			);
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
		mkt.html(this.c.tableTotal, this.c.totalFull.toString());
		mkt.html(this.c.tableFiltrado, this.c.totalFiltrado.toString());
		mkt.html(this.c.tableIni, this.c.pagItensIni.toString());
		mkt.html(this.c.tableFim, this.c.pagItensFim.toString());
	};

	// Retorna a pagina 1 e atualiza
	atualizaNaPaginaUm = async () => {
		this.c.pagAtual = 1;
		this.atualizarListagem();
	};

	// Gatilho para trocar a pagina
	mudaPag = (e: any) => {
		if (e.classList.contains("pag0")) {
			// Anterior
			if (this.c.pagAtual >= 2) this.c.pagAtual -= 1;
		} else if (e.classList.contains("pag8")) {
			// Proximo
			this.c.pagAtual += 1;
		} else {
			this.c.pagAtual = Number(e.innerHTML);
		}
		this.atualizarListagem();
	};

	// Monta os botoes de numero de pagina
	processoPaginar = () => {
		// Links
		mkt.html(this.c.pag + "7", this.c.totPags.toString());
		this.c.pagAtual == 1 ? mkt.Qoff(this.c.pag + "0") : mkt.Qon(this.c.pag + "0");

		if (this.c.totPags > 1) {
			mkt.QverOn(this.c.pag + "0");
			mkt.QverOn(this.c.pag + "8");
			mkt.QverOn(this.c.pag + "7");
		} else {
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
			// INI
			mkt.Qon(this.c.pag + "2");
			mkt.html(this.c.pag + "2", "2");
			mkt.html(this.c.pag + "3", "3");
			mkt.html(this.c.pag + "4", "4");
			mkt.html(this.c.pag + "5", "5");
			mkt.html(this.c.pag + "6", "...");
			mkt.Qoff(this.c.pag + "6");
		} else {
			// END
			if (this.c.totPags - this.c.pagAtual < 4) {
				mkt.Qoff(this.c.pag + "2");
				mkt.html(this.c.pag + "2", "...");
				mkt.html(this.c.pag + "3", (this.c.totPags - 4).toString());
				mkt.html(this.c.pag + "4", (this.c.totPags - 3).toString());
				mkt.html(this.c.pag + "5", (this.c.totPags - 2).toString());
				mkt.html(this.c.pag + "6", (this.c.totPags - 1).toString());
				mkt.Qon(this.c.pag + "6");
			} else {
				// MID
				mkt.Qoff(this.c.pag + "2");
				mkt.html(this.c.pag + "2", "...");
				mkt.html(this.c.pag + "3", (this.c.pagAtual - 1).toString());
				mkt.html(this.c.pag + "4", this.c.pagAtual.toString());
				mkt.html(this.c.pag + "5", (this.c.pagAtual + 1).toString());
				mkt.html(this.c.pag + "6", "...");
				mkt.Qoff(this.c.pag + "6");
			}
		}
		// Ativar Pagina
		mkt.QAll(this.c.pagBotao).forEach((li: HTMLLIElement) => {
			li.classList.remove("ativo");
			if (this.c.pagAtual == Number(li.innerHTML)) {
				li.classList.add("ativo");
			}
		});
		// Limpar Exibidos
		this.dadosExibidos = [];
		// Clonar Exibidos de Filtrados
		this.dadosFiltrado.forEach((o: any, i: any) => {
			if (i + 1 >= this.c.pagItensIni && i + 1 <= this.c.pagItensFim) {
				this.dadosExibidos.push(mkt.clonar(o));
			}
		});
	};

	// Limpa e Gera Filtro. Padrao class ".iConsultas".
	updateFiltro = () => {
		// Limpa filtro atual
		this.c.objFiltro = {};
		// Gera filtro os nos campos
		mkt.QAll(this.c.filtro).forEach((e: HTMLElement) => {
			this.gerarFiltro(e);
		});
		this.atualizaNaPaginaUm();
	};

	// Gerar Filtro baseado nos atributos do MKF gerados no campo.
	gerarFiltro = (e: any) => {
		// Para ignorar filtro: data-mkfignore="true" (Ou nao colocar o atributo mkfformato no elemento)
		if (e.value != null && e.getAttribute("data-mkfignore") != "true") {
			this.c.objFiltro[e.name] = {
				formato: e.getAttribute("data-mkfformato"),
				operador: e.getAttribute("data-mkfoperador"),
				conteudo: e.value,
			};
		}
		// Limpar filtro caso o usuario limpe o campo
		if (
			this.c.objFiltro[e.name]["conteudo"] == "" ||
			this.c.objFiltro[e.name]["conteudo"] == "0" ||
			this.c.objFiltro[e.name]["conteudo"] == 0 ||
			this.c.objFiltro[e.name]["conteudo"] === null
		) {
			delete this.c.objFiltro[e.name];
		}
	};

	gerarParametros = () => {
		return mkt.QAll(this.c.filtro)
			.map((i: HTMLInputElement) => { return "&" + i.name + "=" + encodeURIComponent(i.value); })
			.join("");
	}

	// Gerar Gatilhos de FILTRO
	setFiltroListener = () => {
		// Onclick do botao
		if (this.c.botaoNovaConsulta != null) {
			mkt.Ao("click", this.c.botaoNovaConsulta, (e: HTMLElement) => {
				this.mais(this.gerarParametros());
			});
		}
		// Key dos campos
		mkt.Ao("input", this.c.filtro, (e: HTMLElement) => {
			// Reativa o botao
			if (this.c.botaoNovaConsulta != null) {
				// Ao mecher no filtro E botão vinculado E Mudou parametro = liberar botao
				let parametroAtual = this.gerarParametros();
				if (parametroAtual != this.ultimoParametro) {
					mkt.Qon(this.c.botaoNovaConsulta);
				} else {
					// Mas se mecher no filtro, botão vinculado e nâo houve mudança. Retorna botão pro off, pois pode ocorrer do usuário trocar o filtro e voltar no mesmo em seguida.
					mkt.Qoff(this.c.botaoNovaConsulta);
				}
			}
			// Reativa o botao
			if (this.c.filtroDinamico) {
				this.gerarFiltro(e);
				this.atualizaNaPaginaUm();
			}
		});
	};

	headSeeMenuAbrir = (colName: string, e: HTMLTableCellElement) => {
		e.classList.add("relative");
		if (!e.querySelector(".mkhmHeadIco")) {
			let mkhmIco = document.createElement("div");
			mkhmIco.className = "mkhmHeadIco";
			mkhmIco.innerHTML = mkt.vars.svgF;
			mkt.Ao("click", mkhmIco, () => {
				this.headMenuAbrir(colName);
			})
			e.appendChild(mkhmIco);
		}
	}

	// HM (MK HEAD MENU)
	headMenuAbrir = async (colName: any) => {
		let eHead = mkt.Q(this.c.container + " .sort-" + colName);
		if (mkt.Q("body .mkHeadMenu") == null) {
			let ehm = document.createElement("div");
			ehm.className = "mkHeadMenu oculto";
			ehm.innerHTML = `
			<div class='hmin fimsecao'>
				<div class='i htit'>
					<div class='col10 microPos5' onclick='mkt.headMenuPrevious()'>${mkt.vars.svgL}</div>
					<div class='col70 hmTitulo'>
						Filtro
					</div>
					<div class='col10 microPos5' onclick='mkt.headMenuNext()'>${mkt.vars.svgR}</div>
					<div class='col10 fechar botao nosel' onclick='mkt.headMenuHideX()'>
						${mkt.vars.svgX}
					</div>
				</div>
				<ul>
					<li onclick='mkt.headMenuCrescente()' class='claico botao nosel'>${mkt.vars.svgAB}${mkt.vars.espaco}${mkt.vars.clacre}</li>
					<li onclick='mkt.headMenuDecrescente()' class='claico botao nosel fimsecao'>${mkt.vars.svgBA}${mkt.vars.espaco}${mkt.vars.cladec}</li>
					<li><input class='nosel' type='text' name='filtrarCampo' oninput='mkt.headMenuContemInput(this.value)' placeholder='${mkt.vars.contem}'></li>
					<li onclick='mkt.headMenuLimpar()' class='limpar botao nosel'>${mkt.vars.svgF}${mkt.vars.espaco}${mkt.vars.limparIndivisual}${mkt.vars.espaco}<span class='hmTitulo'></span></li>
					<li onclick='mkt.headMenuLimparTodos()' class='limpar botao nosel fimsecao'>${mkt.vars.svgF}${mkt.vars.espaco}${mkt.vars.limparTodos}</li>
					<li><input type='search' oninput='mkt.headMenuFiltraExclusivo(this.value)' name='filtrarPossibilidades' placeholder='Pesquisar'></li>
					<li><div class='possibilidades'></div></li>
				</ul>
			</div>`;
			document.body.appendChild(ehm);
		}
		if (this.c.objFiltro[colName]?.formato == "string") {
			mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = this.c.objFiltro[colName]?.conteudo;
		} else {
			mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
		}
		mkt.Q(".mkHeadMenu input[name='filtrarPossibilidades']").value = "";
		if (this.c.objFiltro[colName]?.formato == "mkHeadMenuSel") {
			this.hmunsel = this.c.objFiltro[colName].conteudo;
		} else {
			this.hmunsel = [];
		}
		this.exclusivos = await mkt.addTask({ k: "Exclusivos", v: this.dadosFull })
		this.exclusivos = this.exclusivos.v[colName.split(".")[0]];
		let exclusivosProcessado: any = []
		if (colName.includes(".")) {
			this.exclusivos?.forEach((ex: any) => {
				let colv = mkt.getV(colName, ex).toString();
				exclusivosProcessado.push(colv);
			})
			this.exclusivos = exclusivosProcessado;
		}
		if (!this.exclusivos) { this.exclusivos = [] };
		// this.exclusivos = this.exclusivos.map(i => {
		// 	return mkt.removeEspecias(i).toLowerCase().trim();
		// });
		mkt.headMenuFiltraExclusivo = (v: any) => {
			let vProcessado = mkt.removeEspecias(v).toLowerCase().trim();
			let exFiltrado = this.exclusivos?.filter((f: string) => {
				return mkt.removeEspecias(f).toLowerCase().trim().includes(vProcessado);
			});
			let muitosExclusivos = false;
			if (exFiltrado) {
				if (exFiltrado.length > 100) {
					muitosExclusivos = true;
				}
			} else {
				exFiltrado = [];
			};
			if (this.hmunsel.length <= 0) {
				mkt.Q("body .mkHeadMenu .possibilidades").classList.remove("st");
			}
			let htmlPossiveis = "<ul class='filtravel'>";

			if (exFiltrado.length > 0) {
				let fullsel = "sel";
				if (mkt.Q("body .mkHeadMenu .possibilidades").classList.contains("st")) {
					fullsel = "";
				}
				htmlPossiveis += "<li class='nosel botao " + fullsel + "' id='headMenuTodos' onclick='mkt.headMenuMarcarExclusivos()'>" + mkt.vars.svgSquare + mkt.vars.espaco + mkt.vars.selectAll + " (" + exFiltrado.length + ")";
				if (v != "") {
					htmlPossiveis += " Pesquisados";
				}
				htmlPossiveis += "</li>";
				exFiltrado.forEach((v: any) => {
					let sel = "sel";
					let v2 = mkt.removeEspecias(v).toLowerCase().trim();
					this.hmunsel.forEach((hm: any) => {
						if (mkt.removeEspecias(hm).toLowerCase().trim() == v2) {
							sel = "";
						}
					});
					// Tratamento das possíveis saída de dados diferentes.
					let vOut: any = v;
					if (mkt.util.data[1].test(vOut)) {
						vOut = mkt.toLocale(vOut);
					} else if (mkt.util.dataIso8601[1].test(vOut)) {
						vOut = mkt.toLocale(vOut);
					}
					vOut = vOut.toString();
					if (vOut.length > 40) {
						vOut = vOut.slice(0, 37) + "...";
					}
					htmlPossiveis += "<li name='" + mkt.removerAspas(v2) + "' class='nosel botao " + sel + "' onclick='mkt.headMenuMarcarExclusivos(this)'>" + mkt.vars.svgSquare + mkt.vars.espaco + vOut + "</li>";
				})
			}
			htmlPossiveis += "</ul>"
			mkt.Q("body .mkHeadMenu .possibilidades").innerHTML = htmlPossiveis;
		};
		mkt.headMenuFiltraExclusivo("");
		// Marca de Desmarca
		mkt.headMenuMarcarExclusivos = (e: HTMLElement) => {
			if (e) {
				let name = e.getAttribute("name");
				if (name) {
					if (this.hmunsel.includes(name)) {
						e.classList.add("sel");
						if (name != null) {
							this.hmunsel.splice(this.hmunsel.indexOf(name), 1);
							if (this.hmunsel.length == 0) {
								mkt.Q("#headMenuTodos").classList.add("sel");
								mkt.Q("body .mkHeadMenu .possibilidades").classList.toggle("st");
							}
						}
					} else {
						e.classList.remove("sel");
						if (name != null) {
							this.hmunsel.push(name);
							if (this.hmunsel.length == this.exclusivos.length) {
								mkt.Q("#headMenuTodos").classList.remove("sel");
								mkt.Q("body .mkHeadMenu .possibilidades").classList.toggle("st");
							}
						}
					}
				} else {
					mkt.w("headMenuMarcarExclusivos() - Atributo NAME não encontrado em: ", e);
				}
			} else {
				mkt.Q("body .mkHeadMenu .possibilidades").classList.toggle("st");
				if (mkt.Q("body .mkHeadMenu .possibilidades").classList.contains("st")) {
					mkt.QAll(".mkHeadMenu .possibilidades li").forEach((el: HTMLLIElement) => {
						let name = el.getAttribute("name");
						el.classList.remove("sel");
						if (name != null) {
							if (!this.hmunsel.includes(name)) {
								this.hmunsel.push(name);
							}
						}
					})
				} else {
					mkt.QAll(".mkHeadMenu .possibilidades li").forEach((el: HTMLLIElement) => {
						let name = el.getAttribute("name");
						el.classList.add("sel");
						if (name != null) {
							this.hmunsel.splice(this.hmunsel.indexOf(name), 1);
						}
					})
				}
			}
			this.c.objFiltro[colName] = {
				formato: "mkHeadMenuSel",
				operador: "",
				conteudo: this.hmunsel,
			};
			this.atualizaNaPaginaUm();
			// Limpar outros filtros
			mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
		};
		mkt.headMenuPrevious = () => {
			let opcoes = this.getModel().map(o => { if (o.f) return o.k; }).filter(r => { return r != null });
			let posAtual = opcoes.indexOf(colName);
			let posAnterior = 0;
			if (posAtual >= 0) { // Se o atual existe
				posAnterior = posAtual - 1;
			}
			if (posAnterior < 0) {// Era o primeiro
				posAnterior = opcoes.length - 1;//Vira Última Posição
			}
			//mkt.l("Atual: ", colName, "| Anterior: ", opcoes[posAnterior], "| Opções: ", opcoes);
			if (opcoes[posAnterior]) this.headMenuAbrir(opcoes[posAnterior]);
		};
		mkt.headMenuNext = () => {
			let opcoes = this.getModel().map(o => { if (o.f) return o.k; }).filter(r => { return r != null });
			let posAtual = opcoes.indexOf(colName);
			let posSeguinte = 0;
			if (posAtual >= 0) { // Se o atual existe
				posSeguinte = posAtual + 1;
			}
			if (posSeguinte >= opcoes.length) {// Era o último
				posSeguinte = 0;//Vira Primeira Posição
			}
			//mkt.l("Atual: ", colName, "| Seguinte: ", opcoes[posSeguinte], "| Opções: ", opcoes);
			if (opcoes[posSeguinte]) this.headMenuAbrir(opcoes[posSeguinte]);
		};
		mkt.headMenuCrescente = () => { this.orderBy(colName, 0); };
		mkt.headMenuDecrescente = () => { this.orderBy(colName, 1); };
		mkt.headMenuLimpar = () => {
			mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
			this.hmunsel = [];
			mkt.headMenuFiltraExclusivo("");
			this.clearFiltro(colName);
			this.atualizarListagem();
		};
		mkt.headMenuLimparTodos = () => {
			mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
			this.hmunsel = [];
			mkt.headMenuFiltraExclusivo("");
			this.clearFiltro();
			this.atualizarListagem();
		};
		mkt.headMenuContemInput = (v: any) => {
			this.c.objFiltro[colName] = {
				formato: "string",
				operador: "",
				conteudo: v,
			};
			this.atualizaNaPaginaUm();
			// Limpar outros filtros
			this.hmunsel = [];
			mkt.headMenuFiltraExclusivo("");
		};

		mkt.atribuir(mkt.Q("body"), () => { mkt.headMenuHide(event) }, "onclick");
		let colNameLabel = colName;
		let esteLabel = this.getModel()?.filter((f) => { return f.k == colName })?.[0]?.l;
		if (esteLabel) {
			colNameLabel = esteLabel;
		}
		if (colNameLabel == colName) {
			colNameLabel = eHead.innerHTML;
		}
		mkt.QAll("body .mkHeadMenu .hmTitulo").forEach((e: HTMLElement) => {
			e.innerHTML = colNameLabel;
		});
		mkt.Q("body .mkHeadMenu").classList.remove("oculto");
		mkt.Q("body .mkHeadMenu").classList.add("lock");
		mkt.Q(".mkHeadMenu input[name='filtrarCampo']").focus();
	}

	// Gera Listeners na THEAD da tabela (Requer classe: "sort-campo")
	headAtivar = () => {
		let eTrHeadPai = mkt.Q(this.c.container + " thead tr");
		let opcoes = this.getModel().map(o => { if (o.f) return o.k; }).filter(r => { return r != null });
		if (eTrHeadPai) {
			Array.from(eTrHeadPai.children).forEach((th: any) => {
				let possui: any = false;
				[...th.classList].forEach((classe) => {
					// Verifica se contém sort- no inicio da class
					if (classe.indexOf("sort-") == 0) {
						possui = classe;
					}
				});
				if (possui != false) {
					let colName = possui.replace("sort-", "");
					if (colName != "") {
						if (this.c.headSort == true) {
							mkt.Ao("click", th, (e: HTMLTableCellElement) => {
								this.orderBy(colName);
							});
						}
						if (this.c.headMenu == true) { // Se Ativo
							// Se coluna atual permite filtrar.
							if (opcoes?.includes(colName)) {
								mkt.Ao("mousemove", th, (e: HTMLTableCellElement) => {
									this.headSeeMenuAbrir(colName, e);
								});
							}
						}
					}
				}
			});
		}
	}

	// Direção 0: Crescente
	// Direção 1: Decrescente
	// Direção 2: Toogle
	setDirSort = (propriedade: string | null, direcao: number = 2) => {
		if (propriedade != null) {
			if (direcao == 2) {
				if (propriedade != this.c.sortBy) {
					this.c.sortDir = 0;
				} else {
					this.c.sortDir == 0 ? (this.c.sortDir = 1) : (this.c.sortDir = 0);
				}
			} else if (direcao == 1) {
				this.c.sortDir = 1;
			} else {
				this.c.sortDir = 0;
			}
			this.c.sortBy = propriedade;
		}
		//mkt.l("By: ", this.c.sortBy, " | Dir: ", this.c.sortDir);
	};

	// Ordena a lista e atualiza (Direcao: 0(Cre),1(Dec),2(toogle))
	orderBy = (propriedade: string | null, direcao: number = 2) => {
		// Atualiza atual Sort
		this.setDirSort(propriedade, Number(direcao));
		// Executa Ordenador da lista principal
		this.dadosFull = mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
		// Atualiza classes indicadoras de ordem
		this.efeitoSort();
		this.atualizarListagem();
	};

	efeitoSort = () => {
		// Limpa efeito
		let thsAll = mkt.QAll(this.c.ths);
		if (thsAll.length != 0) {
			thsAll.forEach((th: HTMLTableCellElement) => {
				th.classList.remove("mkEfeitoDesce");
				th.classList.remove("mkEfeitoSobe");
			});
		}
		// Busca elemento que está sendo ordenado
		let thsSort = mkt.QAll(this.c.ths + ".sort-" + this.c.sortBy);
		if (thsSort.length != 0) {
			thsSort.forEach((thSort: HTMLTableCellElement) => {
				if (this.c.sortDir == 1) {
					thSort.classList.add("mkEfeitoDesce");
				} else {
					thSort.classList.add("mkEfeitoSobe");
				}
			});
		}
	};

	// LIMPAR FILTRO
	clearFiltro = (campoEspecifico: string | null = null) => {
		if (campoEspecifico) {
			// LIMPAR APENAS ESTE
			if (this.c.objFiltro[campoEspecifico]) {
				delete this.c.objFiltro[campoEspecifico];
			}
			mkt.QAll(this.c.filtro + "[name='" + campoEspecifico + "']").forEach((e: HTMLInputElement) => {
				e.value = "";
			});
			mkt.QAll(this.c.filtro + ".mkSel[name='" + campoEspecifico + "']").forEach((mkSel: HTMLInputElement) => {
				mkSel.classList.add("atualizar");
			});
		} else {
			// LIMPAR TUDO
			this.c.objFiltro = {};
			// RESET Form (Limpar seria "0" / "") (Set e.defaultValue)
			mkt.QAll(this.c.filtro).forEach((e: HTMLInputElement) => {
				e.value = "";
			});

			// Solicita Atualizacao de todos mkSel
			mkt.QAll(this.c.filtro + ".mkSel").forEach((mkSel: HTMLInputElement) => {
				mkSel.classList.add("atualizar");
			});
		}
	};

	// LIMPAR FILTRO  LimparFiltro("#consulta_form"); //Passar o form que contem os SELECT/INPUT de filtro (search).
	clearFiltroUpdate = () => {
		this.clearFiltro();
		this.atualizarListagem();
	};

	// Retorna o último objeto da lista onde a chave primaria bateu.
	getObj = (valorKey: any): object | null => {
		let temp: object | null = null;
		if (Array.isArray(this.dadosFull) && mkt.classof(this.c.pk) == "String") {
			this.dadosFull.forEach((o) => {
				if (o[this.c.pk as string] == valorKey) {
					temp = o;
				}
			});
		}
		return temp;
	};

	// Retorna uma lista de todos objetos encontrados onde o KV bateu.
	getObjs = (k: string, v: any): object[] => {
		let array: object[] = [];
		let errNotPresent = false;
		let errKeyInvalid = false;
		if (Array.isArray(this.dadosFull)) {
			if (mkt.classof(k) == "String") {
				this.dadosFull.forEach((o) => {
					if (k in o) {
						if (o[k] == v) {
							array.push(o);
						}
					} else {
						errNotPresent = true;
					}
				});
			} else {
				errKeyInvalid = true;
			}
		}
		if (errNotPresent)
			mkt.w("Erro getObjs(): Key não está presente em um ou mais objetos.");
		if (errKeyInvalid)
			mkt.w("Erro getObjs(): Key precisa ser no formato string.");
		return array;
	};

	setObj = (v: any, objeto: any): any => {
		let temp: any = null;
		if (Array.isArray(this.dadosFull) && (mkt.classof(this.c.pk) == "String")) {
			let o = this.find(this.c.pk as string, v);
			if (o) {
				if (mkt.classof(objeto) == "Object") {
					for (let p in objeto) {
						o[p] = objeto[p];
					}
				}
				temp = o;
			} else {
				this.dadosFull.push(objeto);
				temp = objeto;
			}
		}
		return temp;
	};

	// Modelo de Chaves e Propriedades do Modelo, podendo conter todo o design e estrutura dos dados da lista
	// Formato M K V L R (Chave, Valor, Label, Regex) V é vazio/nulo, pois não recebe objeto nessa função.
	// m		Mascara do valor da coluna
	// k		Key (Nome chave da Coluna)
	// v		Valor (Conteudo da coluna)
	// l		Label (Descrição Curta do campo)
	// r		Regex (Para validar os valores)
	// tag	Tag (Nome do campo)
	// atr	Attributos (Atributos associados a essa tag)
	// tar	Target JS (Método para modificar o campo value/innerHTML)
	// cla	Classes
	// pk		Primary Key
	// ****** ESTE FORMATO FOI APERFEICOADO NA CLASSE mktm

	// Retornar o con
	getModel = () => {
		return this.c.model; // <= Classe mktm
	};

	// KVLR (E mais...)
	// K (Chave)	- V (Valor) - L (Label) - R (REGEX)	- TAG (TAG Html) - ATR (Attributos Tag) - target (Value no Inner)
	// keys.push({ k: "mDat", v: "", l: "Data", r: mkt.util.data[1], tag: "input", atr: "type='text'" });
	// keys.push({ k: "mDes", v: "", l: "Descrição", r: "", tag: "textarea", atr: "cols='50' rows='10'", i: true });
	// Recebendo o objeto da lista, traz o getUsedKeys juntamente aos Values deste objeto;
	// ****** ESTE FORMATO FOI APERFEICOADO NA CLASSE mktm
	getKVLR = (obj: any) => {
		let models = this.getModel();
		if (models.length == 0) models = this.getUsedKeys(true);
		let kvlr: any = [];
		models.forEach((p: any) => {
			// A cada Propriedade do Modelo
			let o = { ...p };
			if (obj?.[p.k]) {
				if (o.i == true) {
					o.i = obj?.[p.k]
					o.v = "";
				} else {
					o.i = null;
					o.v = obj?.[p.k];
				}
			} else {
				o.i = null;
				o.v = "";
			}
			kvlr.push(o);
		});
		return kvlr;
	};

	// Cria um Set retorna um array de Keys Usadas
	getUsedKeys = (formatoKV = false) => {
		let kv: any = [];
		let chaves = new Set();
		this.dadosFull.forEach((o: any) => {
			Object.keys(o).forEach((p) => {
				chaves.add(p);
			});
		});
		if (formatoKV) {
			[...chaves].forEach((k: any) => {
				let obj: any = {};
				obj.k = k;
				kv.push(obj);
			});
			return kv;
		} else {
			return [...chaves];
		}
	};

	getNewPK = () => {
		let maior = 0;
		if (mkt.classof(this.c.pk) == "String") {
			this.dadosFull.forEach((o: any) => {
				if (o[this.c.pk as string] > maior) {
					maior = Number(o[this.c.pk as string]);
				}
			});
		}
		return Number(maior) + 1;
	};

	getAllTr = () => {
		return Array.from(mkt.QAll(this.c.container + " tbody tr"));
	};

	// USER INTERFACE - UI - INDIVIDUAL
	add = (objDados: object) => {
		objDados = this.c.aoReceberDados(objDados, this);
		this.dadosFull.push(objDados);
		mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
		this.atualizarListagem();
	};

	edit = (objDados: object, k: string, v: any) => {
		objDados = this.c.aoReceberDados(objDados, this);
		this.dadosFull = mkt.setObjetoFromId(k, v, objDados, this.dadosFull);
		mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
		this.atualizarListagem();
	};

	del = (k: any, v: any) => {
		this.dadosFull = mkt.delObjetoFromId(k, v, this.dadosFull);
		mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
		this.atualizarListagem();
	};

	// mkt.aoReceberDados e mkt.ordenar Não se executam pra acelerar a inserção assincrona da listagem
	addMany = (arrayDados: object[]) => {
		this.dadosFull.push(...arrayDados);
		this.atualizarListagem();
	};

	find = (k: string, v: any) => {
		return this.dadosFull.find((o: any) => o[k] == v);
	};

	toJSON = () => {
		return this.dadosFull;
	};

	toString = () => {
		return mkt.stringify(this.dadosFull);
	};

	valueOf = () => {
		return this.dadosFull;
	};

	get [Symbol.toStringTag]() { return "mkt"; }
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
} // FIM CLASSE MKT

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//	 FUNCOES BASICAS / ATALHOS   		\\
//___________________________________\\
Object.defineProperty(mkt, "toNumber", {
	value: (valor: any, c: any = {}): number => {
		// Valor em Texto / Número, convertido para Float de no máximo 2 casas.
		if (!c.casas) c.casas = 2; // Limite de casas apenas para o valor retornado.
		if (valor != null) {
			if (typeof valor == "string") {
				// Possiveis separadores
				let us = [".", ","].reduce((x, y) => (valor.lastIndexOf(x) > valor.lastIndexOf(y)) ? x : y);
				let posPonto = valor.lastIndexOf(us)
				if (posPonto >= 0) {
					let i = valor.slice(0, posPonto);
					let d = valor.slice(posPonto + 1).slice(0, 2).padEnd(2, "0");
					i = [...i.toString()].filter(a => { return mkt.util.numeros[1].test(a) }).join("");
					d = [...d.toString()].filter(a => { return mkt.util.numeros[1].test(a) }).join("");
					valor = i + "." + d;
				} else {
					valor = [...valor.toString()].filter(a => { return mkt.util.numeros[1].test(a) }).join("").padStart(3, "0")
					valor = valor.slice(0, -(c.casas)) + "." + valor.slice(-(c.casas));
				}
			} else if (typeof valor == "number") {
				valor = valor.toFixed(c.casas);
			} else {
				mkt.w("toFloat() - Formato não implementado: ", typeof valor);
			}
			return Number(valor);
		}
		return 0;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "fromNumber", {
	value: (valor: any, c: any = {}): string => {
		// Retorna um string de duas casas "0,00" a partir de um valor numerico
		//if (!c.s) c.s = ","; // OUTPUT SEPARADOR de decimal numérico do país atual para dados.
		if (!c.locale) c.locale = "pt-BR";
		if (valor != null) {
			let d = [...valor.toString()].filter(a => { return mkt.util.numeros[1].test(a) }).join("").padStart(3, "0");
			valor = Number(d.slice(0, -2) + "." + d.slice(-2));
		} else {
			valor = 0;
		}
		return new Intl.NumberFormat(c.locale, { minimumFractionDigits: 2 }).format(valor);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "toMoeda", {
	value: (valor: any): string => {
		// Texto / Número convertido em Reais
		if (valor != null) {
			if (typeof valor == "number") {
				valor = valor.toFixed(2);
			}
			let d = [...valor.toString()].filter(a => { return mkt.util.numeros[1].test(a) }).join("").padStart(3, "0");
			return new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(Number(d.slice(0, -2) + "." + d.slice(-2)));
		}
		return "";
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "fromMoeda", {
	value: (texto: string): Number => {
		// Retorna um float de duas casas / 0 a partir de um valor monetario 
		if (texto) {
			let d = [...texto.toString()].filter(a => { return mkt.util.numeros[1].test(a) }).join("").padStart(3, "0");
			return Number(d.slice(0, -2) + "." + d.slice(-2));
		}
		return 0;
	}, enumerable: false, writable: false, configurable: false,
});

// Classes do Console.
Object.defineProperty(mkt, "w", {
	value: (...s: any) => {
		if (mkt.log) {
			console.warn(...s);
		}
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "erro", {
	value: (...s: any) => {
		if (mkt.log) {
			console.error(...s);
		}
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "l", {
	value: (...s: any) => {
		if (mkt.log) {
			console.log(...s);
		}
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "cls", {
	value: () => {
		console.clear();
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "gc", {
	value: (...s: any) => {
		if (mkt.log) {
			console.groupCollapsed(...s);
		}
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "ge", {
	value: () => {
		if (mkt.log) {
			console.groupEnd();
		}
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "ct", {
	value: (s: any) => {
		let t = mkt.vars.timers.find((t: any) => t.name == s);
		if (!t) {
			mkt.vars.timers.push({
				name: s,
				ini: mkt.getMs(),
				fim: 0,
				tempo: -1,
			});
		}
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "cte", {
	value: (s: any, quietMode: any = false) => {
		let t = mkt.vars.timers.find((t: any) => t.name == s);
		if (t.fim == 0) {
			t.fim = mkt.getMs();
			t.tempo = t.fim - t.ini;
		}
		if (!quietMode) {
			mkt.l(s + " \t-> " + t.tempo + " ms");
		}
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "Q", {
	value: (query: any) => {
		// Atalho para QuerySelector que retorna apenas o primeiro elemento da query.
		if (typeof query != "string") return query;
		return document.querySelector(query)!;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "QAll", {
	value: (query: any = "body"): Element[] => {
		// Atalho para QuerySelectorAll. List []
		//mkz = query;
		if (mkt.classof(query) == "String") {
			return Array.from(document.querySelectorAll(query));
		} else if (mkt.classof(query).endsWith("Element")) {
			return [query];
		} else {
			mkt.w("QAll() - Formato: ", mkt.classof(query), " TOF: ", typeof query, " Query: ", query);
			return [];
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "AoConfig", {
	value: {
		capture: false,
		once: false,
		passive: true,
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "Ao", {
	value: (tipoEvento: string = "click", query: any, executar: any) => {
		// Adiciona evento em todos elementos encontrados
		// Em QAll, pois o Filtro pega todos os .iConsultas
		mkt.QAll(query).forEach((e: any) => {
			e.addEventListener(tipoEvento, (ev: Event) => {
				if (ev) ev.stopPropagation(); // Quando o botão está dentro do outro.
				executar(e, ev);
			}, mkt.AoConfig);
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "atribuir", {
	value: (e: any, gatilho: any, atributo: string = "oninput") => {
		// Incrementa no ATRIBUTO do elemento E o texto do GATILHO.
		if (e) {
			if (atributo) {
				let classof = mkt.classof(gatilho);
				if (classof == "Function") {
					e[atributo] = gatilho;
				} else if (classof == "String") {
					let attr = e?.getAttribute(atributo);
					if (attr) {
						if (!attr.includes(gatilho)) {
							e?.setAttribute(atributo, attr + ";" + gatilho);
						}
					} else {
						e?.setAttribute(atributo, gatilho);
					}
				} else {
					mkt.w("mkt.atribuir() - Formato não implementado: ", classof);
				}
			} else { mkt.w("mkt.atribuir() - Precisa de um gatilho: ", gatilho) }
		} else { mkt.w("mkt.atribuir() - Precisa de um elemento: ", e) }
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "html", {
	value: (query: any, conteudo: string) => {
		// Atalho para innerHTML que retorna apenas o primeiro elemento da query.
		let e = mkt.Q(query);
		if (e) {
			e.innerHTML = conteudo;
		}
		return e;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "wait", {
	value: (ms: number) => {
		return new Promise(r => setTimeout(r, ms))
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "isJson", {
	value: (s: any): boolean => {
		try {
			JSON.parse(s);
		} catch (e) {
			return false;
		}
		return true;
	}, enumerable: false, writable: false, configurable: false,
});

(String.prototype as any).removeRaw = function () {
	return this.replaceAll("\n", "")
		.replaceAll("\r", "")
		.replaceAll("\t", "")
		.replaceAll("\b", "")
		.replaceAll("\f", "")
		.replaceAll("\\", "/");
	// \u00E3 == ã, vira /u00E3
};

Object.defineProperty(mkt, "stringify", {
	value: (t: any) => {
		// Impedindo erros ao uma scring json dentro de outra propriedade Json.
		// Técnica de camadas de &amp;amp; no primeiro Replace.
		let s = JSON.stringify(t);
		return s.replaceAll("&", "&amp;")
			.replaceAll("\n", "")
			.replaceAll("\r", "")
			.replaceAll("\t", "")
			.replaceAll("\b", "")
			.replaceAll("\f", "")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "parseJSON", {
	value: (t: any, removeRaw: boolean | null = false) => {
		if (mkt.classof(t) == "String") {
			if (removeRaw) {
				t = t.removeRaw();
			}
		}
		if (t === "") return ""; // Vazio
		if (mkt.isJson(t)) {
			return JSON.parse(t);
		} else {
			mkt.w("JSON Inválido: Não foi possível converter o JSON.");
			return null;
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "removeEspecias", {
	value: (s: string) => {
		s = s.toString();
		let r = "";
		let sS = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
		let sN = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
		for (let p = 0; p < s.length; p++) {
			if (sS.indexOf(s.charAt(p)) != -1) {
				r += sN.charAt(sS.indexOf(s.charAt(p)));
			} else {
				r += s.charAt(p);
			}
		}
		r = mkt.apenasNumerosLetras(r);
		return r;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "cursorFim", {
	value: (e: any) => {
		// Move o cursor para o fim assim que executar a funcao
		let len = e.value.length;
		setTimeout(() => {
			e.setSelectionRange(len, len);
		}, 1)
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "like", {
	value: (
		strMenor: string,
		strMaior: string,
	): boolean => {
		// Comparardor de string LIKE
		let result = false;
		// Se utilizar match, não pode ter os reservados do reg-ex.
		strMaior = mkt.apenasNumerosLetras(strMaior).toLowerCase().trim();
		strMenor = mkt.apenasNumerosLetras(strMenor).toLowerCase().trim();

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
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "contem", {
	value: (
		strMaior: string,
		strMenor: string,
	): boolean => {
		// Comparardor de string CONTEM
		strMaior = mkt.removeEspecias(strMaior).toLowerCase();
		strMenor = mkt.removeEspecias(strMenor).toLowerCase();
		return (strMaior.includes(strMenor));
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "allSubPropriedades", {
	value: (OA: any, funcao: Function | null = null, exceto: string = "object") => {
		// Executa a FUNCAO em todas as propriedades deste OA
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
				c += mkt.allSubPropriedades(target, funcao, exceto);
			}
		}
		return c;
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "mkExecutaNoObj", {
	value: (
		oa: object | object[],
		func: any
	): object | object[] => {
		// Verifica se ARRAY ou OBJETO e executa a função FUNC a cada objeto dentro de OA.
		if (Array.isArray(oa)) {
			for (let i = 0; i < oa.length; i++) {
				func(oa[i]);
			}
		} else {
			func(oa);
		}
		return oa;
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "mkLimparOA", {
	value: (oa: object | object[]) => {
		// Converter (OBJ / ARRAY) Limpar Nulos e Vazios
		// Trocar para arrow
		function mkLimparOA_Execute(o: any) {
			for (var propName in o) {
				if (
					o[propName as keyof typeof o] === null ||
					o[propName as keyof typeof o] === ""
				) {
					delete o[propName as keyof typeof o];
				}
			}
			return o;
		}
		return mkt.mkExecutaNoObj(oa, mkLimparOA_Execute);
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "mkGerarObjeto", {
	value: (este: any) => {
		// Gerar Objeto a partir de um Form Entries
		let form = este;
		if (typeof este != "object") {
			form = mkt.Q(este);
		}
		let rObjeto = mkt.mkLimparOA(
			Object.fromEntries(new FormData(form).entries())
		);
		mkt.gc("Objeto Gerado: ");
		mkt.l(rObjeto);
		mkt.ge();
		return rObjeto;
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "QSet", {
	value: (
		query: HTMLElement | string = "body",
		valor: any = null
	): null | HTMLElement => {
		let e = mkt.Q(query);
		if (e) {
			if (valor != null) {
				if (e) e.value = valor;
			} else {
				let e = mkt.Q(query);
				if (e) e.value = "";
			}
			return e;
		} else {
			return null;
		}
	}, enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(mkt, "QSetAll", {
	value: (
		query: string = "input[name='#PROP#']",
		o: object | null = null,
		comEvento: boolean | null = true
	) => {
		// Seta todos os query com os valores das propriedades informadas nos campos.
		// O nome da propriedade precisa ser compatível com o PROPNAME do query.
		let eAfetados = [];
		if (o != null) {
			if (typeof o == "object" && !Array.isArray(o)) {
				for (let p in o) {
					let eDynamicQuery = mkt.Q(
						query.replace("#PROP#", p)
					) as HTMLInputElement;
					if (eDynamicQuery) {
						if (o[p as keyof typeof o]) {
							eDynamicQuery.value = o[p as keyof typeof o];
							if (comEvento) {
								eDynamicQuery.classList.add("atualizar");
							} else {
								eDynamicQuery.classList.add("atualizarSemEvento");
							}
							eAfetados.push(eDynamicQuery);
						}
					}
				}
			} else mkt.w("QSetAll - Precisa receber um objeto: " + o);
		} else mkt.w("QSetAll - Objeto não pode ser nulo: " + o);
		return eAfetados;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "Qon", {
	value: (query: any = "body") => {
		return mkt.aCadaElemento(query, (e: any) => {
			if (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) {
				e.disabled = false;
			}
			e.classList.remove("disabled");
			e.removeAttribute("tabindex");
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "Qoff", {
	value: (query: any = "body") => {
		return mkt.aCadaElemento(query, (e: any) => {
			if (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) {
				e.disabled = true;
			}
			e.classList.add("disabled");
			e.setAttribute("tabindex", "-1");
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "Qison", {
	value: (query: any = "body") => {
		return mkt.cadaExe(query, (e: any) => {
			let b = false;
			if (!e.classList.contains("disabled")) {
				b = true;
			}
			return b;
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "QverOn", {
	value: (query: HTMLElement | string | null = "body") => {
		return mkt.aCadaElemento(query, (e: any) => {
			e?.classList.remove("oculto");
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "QverOff", {
	value: (query: HTMLElement | string | null = "body") => {
		return mkt.aCadaElemento(query, (e: any) => {
			e?.classList.add("oculto");
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "QverToggle", {
	value: (query: HTMLElement | string | null = "body") => {
		return mkt.aCadaElemento(query, (e: any) => {
			e?.classList.toggle("oculto");
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "aCadaElemento", {
	value: (query: any, fn: Function) => {
		// Query: String, Element, [Element,Element]
		if (typeof query == "string") {
			let retorno;
			let elementos = mkt.QAll(query);
			if (elementos.length == 1) retorno = elementos[0];
			else retorno = elementos;
			elementos.forEach((e: any) => {
				fn(e);
			});
			return retorno;
		} else if (Array.isArray(query)) {
			query.forEach((e) => {
				fn(e);
			});
			return query;
		} else {
			let e = mkt.Q(query);
			fn(e);
			return e;
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "cadaExe", {
	value: (query: any, fn: Function) => {
		// Retorna uma array de resultados de cada execucao
		let retorno: any = [];
		if (typeof query == "string") {
			let elementos = mkt.QAll(query);
			elementos.forEach((e: any) => {
				retorno.push(fn(e));
			});
		} else if (Array.isArray(query)) {
			query.forEach((e) => {
				retorno.push(fn(e));
			});
		} else {
			let e = mkt.Q(query);
			retorno.push(fn(e));
		}
		return retorno;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "QScrollTo", {
	value: (query: HTMLElement | string = "body") => {
		let temp = mkt.Q(query) as HTMLElement;
		let distTopo = temp.offsetTop;
		window.scrollTo({
			top: distTopo,
			behavior: "smooth",
		});
		return temp;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "QdataGet", {
	value: (
		query: HTMLElement | string = "body",
		atributoNome: string
	) => {
		return mkt.Q(query).getAttribute("data-" + atributoNome);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "QdataSet", {
	value: (
		query: HTMLElement | string = "body",
		atributoNome: string,
		atributoValor: string
	) => {
		return mkt.Q(query).setAttribute("data-" + atributoNome, atributoValor);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "toggleSwitcher", {
	value: (e: HTMLElement) => {
		if (e.classList.contains("True")) {
			e.classList.remove("True");
			e.classList.add("False");
		} else {
			if (e.classList.contains("False")) {
				e.classList.remove("False");
				e.classList.add("True");
			}
		}
		return e;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "GetParam", {
	value: (name = null) => {
		if (name != null) {
			return new URL(document.location.toString()).searchParams.get(name);
		} else {
			return new URL(document.location.toString()).searchParams;
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "isVisible", {
	value: (e: HTMLElement) => {
		return (
			e.offsetWidth > 0 || e.offsetHeight > 0 || e.getClientRects().length > 0
		);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "apenasNumerosLetras", {
	value: (s: string = ""): string => {
		// Ignora qualquer outro caracter além de Numeros e Letras formato ocidental
		return s.replace(/(?![a-zA-Z0-9])./g, "");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "apenasNumeros", {
	value: (s: string = ""): string => {
		// Ignora qualquer outro caracter além de Numeros
		return s.replace(/(?![0-9])./g, "");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "apenasLetras", {
	value: (s: string = ""): string => {
		// Ignora qualquer outro caracter além de Letras formato ocidental
		return s.replace(/(?![a-zA-Z])./g, "");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "isFloat", {
	value: (x: any): boolean => {
		if (!isNaN(x)) {
			if (parseInt(x) != parseFloat(x)) {
				return true;
			}
		}
		return false;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "gerarDownload", {
	value: (
		blob: any,
		nomeArquivo: string = "Arquivo.zip"
	) => {
		// Funcção que recebe os dados de um arquivo e executa um Download deste dados.
		const fileUrl = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = fileUrl;
		link.download = nomeArquivo;
		link.click();
		URL.revokeObjectURL(fileUrl);
		return nomeArquivo;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "downloadData", {
	value: (
		base64: any,
		nomeArquivo: string = "Arquivo"
	) => {
		// Função que recebe um Base64 e solicita pra download.
		const link = document.createElement("a");
		link.href = base64;
		link.download = nomeArquivo;
		link.click();
		return nomeArquivo;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getServerOn", {
	value: async (url: string = "/Login/GetServerOn") => {
		// Get Server On
		let pac = await mkt.get.json({ url: url, quiet: true });
		// Vem nulo caso falhe
		if (pac?.retorno) {
			mkt.detectedServerOn();
		} else {
			mkt.detectedServerOff();
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "detectedServerOff", {
	value: () => {
		if (mkt.Q("body .offlineBlock") == null) {
			let divOfflineBlock = document.createElement("div");
			divOfflineBlock.className = "offlineBlock";
			let divOfflineBlockInterna = document.createElement("div");
			divOfflineBlockInterna.className = "text-center";
			divOfflineBlockInterna.innerHTML = "Servidor OFF-LINE";
			let buttonOfflineBlock = document.createElement("button");
			buttonOfflineBlock.setAttribute("type", "button");
			buttonOfflineBlock.setAttribute("onClick", "mkt.detectedServerOn()");
			// let iOfflineBlock = document.createElement("i");
			// iOfflineBlock.className = "bi bi-x-lg";
			buttonOfflineBlock.innerHTML =
				"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z'/></svg>";
			divOfflineBlock.appendChild(divOfflineBlockInterna);
			divOfflineBlock.appendChild(buttonOfflineBlock);
			document.body.appendChild(divOfflineBlock);
		}
		mkt.Q("body .offlineBlock").classList.remove("oculto");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "detectedServerOn", {
	value: () => {
		mkt.Q("body .offlineBlock")?.classList?.add("oculto");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkOnlyFloatKeys", {
	value: (ev: KeyboardEvent) => {
		// Eventos HTML5
		// Bloqueio de teclas especificas onKeyDown
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
			if (permitido[i] == ev.key?.toString()) {
				//mkt.l(permitido[i] + " == " + ev.key.toString());
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
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkEventBlock", {
	value: (ev: Event) => {
		// Bloqueios de eventos especificos (varios, exemplo: onContextMenu)
		mkt.w("Negado");
		ev.preventDefault();
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelecionarInner", {
	value: (e: HTMLElement) => {
		// Seleciona texto do elemento
		if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(e);
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkInputFormatarValor", {
	value: (e: HTMLInputElement): void => {
		// 123,45 (2 casas pos conversao float)
		e.value = mkt.mkDuasCasas(mkt.mkFloat(e.value));
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkMedia", {
	value: (menor: string | number, maior: string | number): string => {
		return mkt.mkDuasCasas((mkt.mkFloat(menor) + mkt.mkFloat(maior)) / 2);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkFloat", {
	value: (num: any): number => {
		let ret: number;
		if (typeof num != "number") {
			if (num)
				ret = parseFloat(
					num.toString().replaceAll(".", "").replaceAll(",", ".")
				);
			else ret = 0;
		} else {
			ret = num;
		}
		if (isNaN(ret)) {
			ret = 0;
		}
		return ret;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkDuasCasas", {
	value: (num: number): string => {
		return mkt.mkFloat(num).toFixed(2).replaceAll(".", ","); // 2000,00
		//        .toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // 2.000,00
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkNCasas", {
	value: (num: number, nCasas: number = 2): string => {
		return mkt.mkFloat(num).toFixed(nCasas).replaceAll(".", ","); // 2000,?
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkEmReais", {
	value: (num: number): string => {
		return mkt.mkFloat(num).toLocaleString("pt-br", {
			style: "currency",
			currency: "BRL",
		}); // R$ 12.123,45
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "encod", {
	value: (texto = "") => {
		// String qualquer para B64
		return btoa(encodeURIComponent(texto));
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "decod", {
	value: (texto = "") => {
		// B64 para String
		return decodeURIComponent(atob(texto));
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkBase64", {
	value: (arquivo: any, tagImg: string, tagHidden: string): void => {
		// Verificar se esta nulo
		let leitor = new FileReader();
		leitor.onload = () => {
			(mkt.Q(tagImg) as HTMLImageElement).src = leitor.result as string;
			(mkt.Q(tagHidden) as HTMLInputElement).value = leitor.result as string;
		};
		leitor.readAsDataURL(arquivo);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "ler", {
	value: async (arq: any, p: Function) => {
		return new Promise((r) => {
			let leitor = new FileReader();
			leitor.onprogress = (ev) => {
				if (ev.lengthComputable) {
					let carga = ev.loaded / ev.total;
					if (carga <= 1) {
						if (p) p(carga);
					}
				}
			};
			leitor.onload = (ev) => {
				arq.b64 = ev.target?.result;
				r(arq);
			};
			leitor.onerror = () => {
				mkt.erro("Erro ao ler arquivo: " + arq);
			};
			if (arq) {
				if (arq.name != "") {
					leitor.readAsDataURL(arq);
				} else {
					mkt.l("F: Sem nome de arquivo.", arq);
					r(null);
				}
			} else {
				mkt.l("F: Arquivo Nulo.", arq);
				r(null);
			}
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "clonar", {
	value: (i: any) => {
		return mkt.parseJSON(mkt.stringify(i));
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getModelo", {
	value: (array: any) => {
		let chaves = new Set();
		array.forEach((o: any) => {
			Object.keys(o).forEach((p) => {
				chaves.add(p);
			});
		});
		let modelo: any = {};
		chaves.forEach((k: any) => {
			modelo[k] = [];
			array.forEach((o: any) => {
				let tipo = typeof o[k];
				if (modelo[k].indexOf(tipo) < 0) modelo[k].push(tipo);
			});
		});
		return modelo;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getExclusivos", {
	value: async (array: any) => {
		let res = await mkt.addTask({ k: "Exclusivos", v: array });
		return res.v;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkMerge", {
	value: (o: any, ...fontes: any): object => {
		for (let fonte of fontes) {
			for (let k of Object.keys(fonte)) {
				if (!(k in o)) {
					o[k] = fonte[k];
				}
			}
		}
		return o;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "isInside", {
	value: (e: any, container: any) => {
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
				} else {
					return false;
				}
				c++;
			}
		} else {
			mkt.w("isInside: E: ", e, " Container: ", container);
		}
		return resultado;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "encheArray", {
	value: (
		arrTemplate: any[],
		inicio = 1,
		total: number | null
	): any[] => {
		// Retorna uma array utilizando um template do que deve ser preenchido.
		let novaArray: any[] = [];
		if (Array.isArray(arrTemplate)) {
			if (arrTemplate.length > 0) {
				if (arrTemplate.length < inicio) {
					mkt.erro(
						"O arrTemplate tem menos itens do que o informado para o inicio"
					);
					return novaArray;
				}
			} else {
				mkt.erro(
					"Função encheArray precisa receber ao menos 1 item em arrTemplate."
				);
				return novaArray;
			}
		} else {
			mkt.erro(
				"Função encheArray precisa receber uma array com dados em arrTemplate."
			);
			return novaArray;
		}
		if (inicio <= 0) {
			mkt.erro("O inicio precisa ser maior que zero.");
			return novaArray;
		}
		if (total == null) total = arrTemplate.length;
		let proximo = inicio;
		for (let c = 0; c < total; c++) {
			novaArray.push(arrTemplate[proximo - 1]);
			proximo++;
			if (proximo > arrTemplate.length) {
				proximo = 1;
			}
		}
		return novaArray;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "encheArrayUltimos", {
	value: (
		arrTemplate: any[],
		fim = 1,
		total: number | null
	): any[] => {
		// Retorna uma array dos últimos
		let novaArray: any[] = [];
		if (Array.isArray(arrTemplate)) {
			if (arrTemplate.length > 0) {
				if (arrTemplate.length < fim) {
					mkt.erro(
						"O arrTemplate tem menos itens do que o informado para o fim."
					);
					return novaArray;
				}
			} else {
				mkt.erro(
					"Função encheArrayUltimos precisa receber ao menos 1 item em arrTemplate."
				);
				return novaArray;
			}
		} else {
			mkt.erro(
				"Função encheArrayUltimos precisa receber uma array com dados em arrTemplate."
			);
			return novaArray;
		}
		if (fim <= 0) {
			mkt.erro("O fim precisa ser maior que zero.");
			return novaArray;
		}
		if (total == null) total = arrTemplate.length;
		let anterior = fim;
		for (let c = total; c > 0; c--) {
			novaArray = [arrTemplate[anterior - 1], ...novaArray];
			anterior--;
			if (anterior <= 0) {
				anterior = arrTemplate.length;
			}
		}
		return novaArray;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "isData", {
	value: (i: string) => {
		return mkt.util.data[1].test(i);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getMs", {
	value: (dataYYYYMMDD: string | null = null): number => {
		// Retorna Milisegundos da data no formato Javascript
		if (dataYYYYMMDD != null) {
			let dataCortada = dataYYYYMMDD.split("-");
			let oDia: number = Number(dataCortada[2]);
			let oMes: number = Number(dataCortada[1]) - 1;
			let oAno: number = Number(dataCortada[0]);
			return new Date(oAno, oMes, oDia).getTime();
		} else return new Date().getTime();
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "hojeMkData", {
	value: () => {
		return new Date(mkt.getMs()).toLocaleDateString();
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "hojeMkHora", {
	value: () => {
		return new Date(Number(mkt.getMs())).toLocaleTimeString();
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "hoje", {
	value: () => {
		let mkFullData = mkt.hojeMkData() + " " + mkt.hojeMkHora();
		return mkFullData;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getFullData", {
	value: (ms = null) => {
		let ano = new Date().getUTCFullYear();
		let mes = new Date().getUTCMonth() + 1;
		let dia = new Date().getUTCDate();
		if (ms != null) {
			ano = new Date(ms).getUTCFullYear();
			mes = new Date(ms).getUTCMonth() + 1;
			dia = new Date(ms).getUTCDate();
		}
		return ano.toString().padStart(4, "0") + "-" + mes.toString().padStart(2, "0") + "-" + dia.toString().padStart(2, "0");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getDia", {
	value: (ms = null) => {
		if (ms != null) return Number(mkt.getFullData(ms).split("-")[2]);
		else return Number(mkt.getFullData().split("-")[2]);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getMes", {
	value: (ms = null) => {
		if (ms != null) return Number(mkt.getFullData(ms).split("-")[1]);
		else return Number(mkt.getFullData().split("-")[1]);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getAno", {
	value: (ms = null) => {
		if (ms != null) return Number(mkt.getFullData(ms).split("-")[0]);
		else return Number(mkt.getFullData().split("-")[0]);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "geraMeses", {
	value: (config: any) => {
		// config: {ini: mkt.getMs("2022-08-01"),fim:mkt.getMs()}
		if (typeof config != "object") config = { ini: config };
		if (!config.ini) config.ini = mkt.getMs();
		if (!config.fim) config.fim = mkt.getMs();
		if (!config.limit) config.limit = 100;
		if (!config.tipo) config.tipo = '2';
		if (!config.ano) config.ano = true;
		if (!config.anoCaracteres) config.anoCaracteres = 2;
		if (!config.separador && config.separador != "") config.separador = "-";
		let r = [];
		let mesAtual = mkt.getMes(config.ini);
		let anoAtual = mkt.getAno(config.ini);
		let mesFim = mkt.getMes(config.fim);
		let anoFim = mkt.getAno(config.fim);
		let c = 0;
		while (((anoAtual < anoFim) || (anoAtual == anoFim && mesAtual <= mesFim)) && (c < config.limit)) {
			let gerado = mkt.MESES[(mesAtual % 13) - 1]?.[config.tipo];
			let anoFormatado = anoAtual.toString().slice((4 - config.anoCaracteres), 4);
			if (config.ano) gerado = gerado + config.separador + anoFormatado;
			r.push(gerado);
			mesAtual++;
			if (mesAtual > 12) {
				mesAtual = 1;
				anoAtual++;
			}
			c++;
		}
		return r;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getTempoDiferenca", {
	value: (msOld: number, msNew: number | null = null) => {
		let dias = mkt.getDiasDiferenca(msOld, msNew);
		if (dias < 0) {
			dias = dias * -1;
		}
		let strTempo = "";
		if (dias > 30) {
			if (dias < 60) {
				strTempo = "1 mês";
			} else {
				if (dias > 365) {
					let anos = Math.floor(dias / 365);
					let diasRestoAno = dias % 365;
					if (anos < 2) {
						strTempo += anos + " ano ";
					} else {
						strTempo += anos + " anos ";
					}
					if (diasRestoAno > 30) {
						if (diasRestoAno < 60) {
							strTempo += "1 mês";
						} else {
							strTempo += Math.floor(diasRestoAno / 30) + " meses";
						}
					}
				} else {
					strTempo = Math.floor(dias / 30) + " meses";
				}
			}
		} else {
			if (dias < 1) {
				strTempo = "menos de 1 dia";
			} else {
				strTempo = dias + " dias";
			}
		}
		return strTempo;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getDiasDiferenca", {
	value: (
		msOld: number,
		msNew: number | null = null
	): number => {
		if (msNew == null) msNew = mkt.getMs();
		return mkt.transMsEmDias(msNew! - msOld);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "transMsEmSegundos", {
	value: (ms: number) => {
		return Math.trunc(ms / 1000); // 1000 ms == 1s
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "transMsEmMinutos", {
	value: (ms: number) => {
		return Math.trunc(ms / 60000); // 1000 * 60
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "transMsEmHoras", {
	value: (ms: number) => {
		return Math.trunc(ms / 3600000); // 1000 * 3600
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "transMsEmDias", {
	value: (ms: number) => {
		// 1000 * 3600 * 24 Considerando todo dia tiver 24 horas (~23h 56m 4.1s)
		// (360º translacao / 86400000) = ~4.1
		// Então o erro de 1 dia ocorre 1x ao ano (Dia represeta 1436min).
		return Math.trunc(ms / 86400000);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "transSegundosEmMs", {
	value: (s: number) => {
		return s * 1000;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "transMinutosEmMs", {
	value: (m: number) => {
		return m * 60000;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "transHorasEmMs", {
	value: (h: number) => {
		return h * 3600000;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "transDiasEmMs", {
	value: (d: number) => {
		return d * 86400000;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkNodeToScript", {
	value: (node: any) => {
		// Apenas Scripts
		if (node.tagName === "SCRIPT") {
			let eScript: any = document.createElement("script");
			eScript.text = node.innerHTML;
			let i = -1, attrs = node.attributes, attr;
			while (++i < attrs.length) {
				eScript.setAttribute((attr = attrs[i]).name, attr.value);
			}
			node.parentNode.replaceChild(eScript, node);
		} else {
			// Recursividade sobre filhos
			var i = -1,
				children = node.childNodes;
			while (++i < children.length) {
				mkt.mkNodeToScript(children[i]);
			}
		}
		return node;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "frequencia", {
	value: (array: any): object => {
		let f: any = {};
		for (let e of array) {
			f[e] ? f[e]++ : (f[e] = 1);
		}
		return f;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkYYYYMMDDtoDDMMYYYY", {
	value: (dataYYYYMMDD: string): string => {
		// Converter de YYYY-MM-DD para DD/MM/YYYY
		let arrayData = dataYYYYMMDD.split("-");
		let stringRetorno = "";
		if (arrayData.length >= 3) {
			// Tenta evitar bug de conversao
			stringRetorno = arrayData[2] + "/" + arrayData[1] + "/" + arrayData[0];
		} else {
			stringRetorno = dataYYYYMMDD;
		}
		return stringRetorno;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "toLocale", {
	value: (data: string): string => {
		// '2023-12-27T12:01:16.158' => '22/12/2023, 11:18:33'
		let dataNum: string | number = Number(data);
		if (mkt.classof(dataNum) != "Number") {
			dataNum = data
		}
		return new Date(dataNum).toLocaleString();
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkFormatarDataOA", {
	value: (oa: object | object[]) => {
		// Converter (OBJ / ARRAY) Formato Booleano em Sim/Não
		function mkFormatarDataOA_Execute(o: any) {
			let busca = new RegExp("^[0-2][0-9]{3}[-][0-1][0-9][-][0-3][0-9]$"); // Entre 0000-00-00 a 2999-19-39
			let busca2 = new RegExp("^[0-2][0-9]{3}[-][0-1][0-9][-][0-3][0-9]T[0-2][0-9]:[0-5][0-9]"); // Entre 0000-00-00T00:00 a 2999-19-39T29:59 (Se iniciar nesse formato de ISO)
			for (var propName in o) {
				if (busca.test(o[propName])) {
					o[propName] = mkt.mkYYYYMMDDtoDDMMYYYY(o[propName]);
				}
				if (busca2.test(o[propName])) {
					o[propName] = mkt.toLocale(o[propName]);
				}
			}
			return o;
		}
		return mkt.mkExecutaNoObj(oa, mkFormatarDataOA_Execute);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkBoolToSimNaoOA", {
	value: (oa: object | object[]) => {
		// Converter (OBJ / ARRAY) Formato Booleano em Sim/Não
		function mkBoolToSimNaoOA_Execute(o: any) {
			for (var propName in o) {
				if (
					o[propName].toString().toLowerCase() === "true" ||
					o[propName] === true
				) {
					o[propName] = "Sim";
				}
				if (
					o[propName].toString().toLowerCase() === "false" ||
					o[propName] === false
				) {
					o[propName] = "N&atilde;o";
				}
			}
			return o;
		}
		return mkt.mkExecutaNoObj(oa, mkBoolToSimNaoOA_Execute);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkFormatarOA", {
	value: (oa: object | object[]) => {
		// Converter (OBJ / ARRAY) Formatar para normalizar com a exibicao ao usuario.
		return mkt.mkBoolToSimNaoOA(mkt.mkFormatarDataOA(mkt.mkLimparOA(oa)));
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			Carregador									\\
//___________________________________\\

Object.defineProperty(mkt, "CarregarON", {
	value: (nomeDoRequest: string = "") => {
		if (mkt.Q("body .CarregadorMkBlock") == null) {
			let divCarregadorMkBlock = document.createElement("div");
			divCarregadorMkBlock.className = "CarregadorMkBlock";
			let divCarregadormkt = document.createElement("div");
			divCarregadormkt.className = "CarregadorMk";
			let buttonCarregadorMkTopoDireito = document.createElement("button");
			buttonCarregadorMkTopoDireito.className = "CarregadorMkTopoDireito";
			buttonCarregadorMkTopoDireito.setAttribute("type", "button");
			buttonCarregadorMkTopoDireito.setAttribute("onClick", "mkt.CarregarOFF()");
			buttonCarregadorMkTopoDireito.innerHTML =
				"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z'/></svg>";
			divCarregadorMkBlock.appendChild(divCarregadormkt);
			divCarregadorMkBlock.appendChild(buttonCarregadorMkTopoDireito);
			document.body.appendChild(divCarregadorMkBlock);
		}
		mkt.Q("body .CarregadorMkBlock").classList.remove("oculto");
		mkt.Q("body").classList.add("CarregadorMkSemScrollY");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "CarregarOFF", {
	value: (nomeDoRequest: string = "") => {
		if (mkt.Q("body .CarregadorMkBlock") != null) {
			mkt.Q("body .CarregadorMkBlock").classList.add("oculto");
		}
		mkt.Q("body").classList.remove("CarregadorMkSemScrollY");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "CarregarHtml", {
	value: (estilo = "", classe = "relative") => {
		return `<div class="CarregadorMk ${classe}" style="${estilo}"></div>`;
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			REQUEST											\\
//___________________________________\\

Object.defineProperty(mkt, "get", {
	value: {
		// Formas pre formatadas de chamar o Request de forma simples.
		// mkt.get.json({ url:"/GetList", done: (c)=>{console.log("done:",c)}})
		json: async (config: any) => {
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.t.G;
			config.tipo = mkt.t.J;
			return await mkt.request(config);
		},
		html: async (config: any) => {
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.t.G;
			config.tipo = mkt.t.H;
			let retorno = await mkt.request(config);
			return retorno;
		},
		blob: async (config: any) => {
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.t.G;
			config.tipo = mkt.t.B;
			let retorno = await mkt.request(config);
			return retorno;
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "post", {
	value: {
		json: async (config: any, json: object) => { // post json object...
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.t.P;
			config.tipo = mkt.t.J;
			config.dados = json;
			let retorno = await mkt.request(config);
			return retorno;
		},
		html: async (config: any, text: string) => { // post b64...
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.t.P;
			config.tipo = mkt.t.H;
			config.dados = text;
			let retorno = await mkt.request(config);
			return retorno;
		},
		form: async (config: any, formdata: FormData) => {
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.t.P;
			config.tipo = mkt.t.F;
			config.dados = formdata;
			let retorno = await mkt.request(config);
			return retorno;
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "request", {
	value: async (config: any) => {
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
		 * 	done: (c)=>{mkt.l("Deu Boa? ",c.pacote.ok)},
		 * 	error: (c)=>{mkt.l("Deu Boa? ",c.pacote.ok)},
		 *  //pacote: É populado com os dados do pacote.
		 *  //retorno: É populado com os dados retornados.
		 * }
		 * @returns Sempre retorna o config preenchido (utilizar await para capturar o resultado)
		 */
		// CONFIG ! Necessário
		if (typeof config != "object") {
			mkt.w("É necessário informar o objeto de configuração com a URL.");
			return { url: null, retorno: null }; // Não há config, Mas pra retornar sempre o config
		}
		// URL ! Necessário
		if (!config?.url) {
			mkt.w("Necessário informar uma URL nos requests.");
			return { url: config?.url, retorno: null };
		}
		// GET ? POST, PUT, DELETE
		if (!config?.metodo) {
			mkt.w("Nenhum método informado. Avançando com GET");
			config.metodo = "GET";
		} else {
			if (config.metodo == "POST" && config.dados == null) { // Todo POST requer dados a serem enviados.
				mkt.w("Método POST, mas SEM DADOS informados. Enviando string vazia ''.");
				config.dados = "";
			}
		}
		// Name e Timer Start
		let nomeRequest = config.metodo + ": " + config.url;
		mkt.ct("Request: " + nomeRequest);
		// JSON / FORM / *
		if (!config?.tipo) {
			mkt.w("Nenhum tipo de dado informado. Avançando com " + mkt.t.J);
			config.tipo = mkt.t.J;
		}
		if (!config?.headers) {
			config.headers = new Headers();
			// CONTENT TYPE
			if (config.tipo == mkt.t.J) {
				config.headers.append("Content-Type", config.tipo);
			}
			// TOKEN Baseado neste primeiro input
			let aft: any = mkt.Q("input[name='__RequestVerificationToken']")?.value;
			config.headers.append("MKANTI-FORGERY-TOKEN", aft || "");
		}
		if (!config.quiet) config.quiet = false;
		// TIPO DE ENVIO
		config.json = mkt.stringify(config.dados);
		if (config.metodo != mkt.t.G) {
			if (config.tipo == mkt.t.J) {
				config.body = config.json;
			} else if (config.tipo == mkt.t.F) {
				config.body = config.dados;
			}
		}
		// config.dev = true;
		// INFO
		if (!config.quiet) {
			mkt.gc(nomeRequest);
			if (config.dev) {
				mkt.l("Header: ", Object.fromEntries(config.headers.entries()));
				mkt.l("Config: ", config);
			}
			if (config.metodo == mkt.t.P) {
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
			mkt.ge(); // Fim do metodo
		}
		// Inicia o carregador 
		if (config.carregador) {
			mkt.CarregarON(nomeRequest);
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
				mkt.gc(
					"HTTP RETURNO: " + config.pacote.status + " " + config.pacote.statusText
				);
				let texto = await config.pacote.text();
				mkt.l(texto);
				mkt.ge();
				if (config.pacote.status >= 300) {
					if (!localStorage.mktRequests) {
						localStorage.mktRequests = mkt.stringify([]);
					}

					let erros = JSON.parse(localStorage.mktRequests);
					erros.push({
						quando: mkt.hoje(),
						status: config.pacote.status,
						texto: texto,
						url: config.url,
					})
					if (erros.length > 10) {
						erros.shift(1);
					}

					localStorage.mktRequests = mkt.stringify(erros);
				}
			} else {
				config.conectou = true;
				config.statusCode = config.pacote.status;
				// 200 DONE (Retorna baseado no tipo de envio)
				if (config.tipo == mkt.t.J) {
					config.retorno = await config.pacote.json();
				} else if (config.tipo == mkt.t.H) {
					config.retorno = await config.pacote.text();
				} else if (config.tipo == mkt.t.B) {
					config.retorno = await config.pacote.blob();
				} else if (config.tipo == mkt.t.F) {
					config.retorno = await config.pacote.json();
				}
				if (!config.quiet) {
					let tam = config.retorno?.length;
					if (!tam) {
						tam = "";
					}
					mkt.gc(
						"Retorno " + config.pacote.status +
						" (" + config.metodo + "):{" + config.retorno?.length + "} " +
						config.url + " (" + config.tipo + ")"
					);
				}
				mkt.cte("Request: " + nomeRequest, config.quiet);
				if (!config.quiet) {
					mkt.l(config.retorno);
					mkt.ge();
				}
				if (config.done) { config.done(config); }
			}
		} catch (error) {
			// Caso Conection_Refused, Não tem código de erro. Então cai aqui.
			config.conectou = false;
			config.catch = error;
		}
		// Aqui tem Status code se o erro foi no servidor, Mas não tem se o servidor não estiver online.
		if (!config.conectou) {
			mkt.gc("(" + config.statusCode + ") HTTP ERRO:");
			// Se bateu no catch, expoem trace error do JS
			if (config.catch && !config.quiet) {
				mkt.l("Config: " + config);
				mkt.erro("Erro: ", config.catch);
			}
			// Executa funcao de erro externa.
			if (config.error) { config.error(config); }
			mkt.ge();
		}

		// Finaliza o carregador 
		if (config.carregador) {
			mkt.CarregarOFF(nomeRequest);
		}
		// Sempre retorna o config
		return config;
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			LISTAGEM										\\
//___________________________________\\

Object.defineProperty(mkt, "getObjetoFromId", {
	value: (
		nomeKey: any,
		valorKey: any,
		listaDados: Array<any>
	): object | null => {
		let temp: object | null = null;
		if (Array.isArray(listaDados)) {
			listaDados.forEach((o) => {
				if (o[nomeKey] == valorKey) {
					temp = o;
				}
			});
		}
		return temp;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "setObjetoFromId", {
	value: (
		nomeKey: any,
		valorKey: any,
		itemModificado: object,
		listaDados: Array<any>
	): Array<any> | null => {
		if (Array.isArray(listaDados)) {
			for (let i = 0; i < listaDados.length; i++) {
				if (listaDados[i][nomeKey] == valorKey) {
					listaDados[i] = itemModificado;
				}
			}
		}
		return listaDados;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "delObjetoFromId", {
	value: (
		nomeKey: any,
		valorKey: any,
		listaDados: Array<any>
	): Array<any> => {
		let temp: Array<any> = [];
		if (Array.isArray(listaDados)) {
			listaDados.forEach((o) => {
				if (o[nomeKey] != valorKey) {
					temp.push(o);
				}
			});
		} else {
			temp = listaDados;
		}
		return temp;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "processoFiltragem", {
	value: (aTotal: any, objFiltro: any, inst: mkt) => {
		/**
		 * FullFiltroFull - processoFiltragem
		 * Executa a redução da listagem basedo no objFiltro.
		 * Usando filtroExtra(), pode-se filtrar o objeto da lista também.
		 * Atributos:
		 * 		data-mkfformato = "date"
		 * 		data-mkfoperador = "<="
		 */
		let aFiltrada = [];
		if (Array.isArray(aTotal)) {
			let temp: any[] = [];
			aTotal.forEach((o) => {
				let podeExibir = true;
				if (inst.c.filtroExtra != null) podeExibir = inst.c.filtroExtra(o); // true
				if (mkt.classof(podeExibir) != "Boolean") {
					podeExibir = true;
					mkt.w("filtroExtra() precisa retornar boolean");
				}
				for (let propFiltro in objFiltro) {
					// Faz-se o cruzamento dos dados, quando encontrar a prorpiedade no outro objeto, seta pra executar o filtro.
					let m: any = null;
					if (o[propFiltro as keyof typeof o] != null) {
						m = o[propFiltro as keyof typeof o]; // m representa o dado do item
					}
					if (propFiltro.includes(".")) {
						m = mkt.getV(propFiltro, o); // m representa o dado do item
						//this.l("NoFIltro: ", objFiltro[propFiltro].conteudo.toString().toLowerCase(), " DadoItem: ", m)
					}
					//this.l("objFiltro[propFiltro]: ", objFiltro[propFiltro])
					// Cada Propriedade de Cada Item da Array
					if (m != null) {
						// Cruzar referencia com objFiltro e se so avancar se realmente for um objeto
						let k: any = objFiltro[propFiltro]; // k representa a config do filtro para essa propriedade
						if (k.formato === "string") {
							k.conteudo = k.conteudo.toString().toLowerCase();
							if (!mkt.contem(m, k.conteudo)) {
								podeExibir = false;
							}
						} else if (k.formato === "mkHeadMenuSel") {
							let item = mkt.removeEspecias(m).toString().toLowerCase().trim();
							if (k.conteudo.includes(item)) {
								podeExibir = false;
							}
						} else if (k.formato === "stringNumerosVirgula") {
							// Filtro por numero exado. Provavelmente sejam duas arrays (MultiSelect), O filtro precisa encontrar tudo no objeto.
							let filtroInvertido = false;
							if (mkt.isJson(k.conteudo)) {
								let arrayM = m.toString().split(","); // String de Numeros em Array de Strings
								let mayBeArrayK = mkt.parseJSON(k.conteudo); // << No objFiltro
								if (Array.isArray(mayBeArrayK)) {
									mayBeArrayK.forEach((numeroK: any) => {
										// A cada numero encontrado pos split na string do item verificado
										filtroInvertido = arrayM.some((numeroM: any) => {
											return Number(numeroM) == Number(numeroK);
										});
									});
								} else {
									filtroInvertido = arrayM.some((numeroM: any) => {
										return Number(numeroM) == Number(mayBeArrayK);
									});
								}
								if (!filtroInvertido) {
									podeExibir = false;
								}
							} else mkt.w("Não é um JSON");
						} else if (k.formato === "number") {
							// Filtro por numero exado. Apenas exibe este exato numero.
							// Ignorar filtro com 0
							if (
								Number(m) !== Number(k.conteudo) &&
								Number(k.conteudo) !== 0
							) {
								podeExibir = false;
							}
						} else if (k.formato === "date") {
							// Filtro por Data (Gera milissegundos e faz comparacao)
							let dateM = new Date(m).getTime();
							let dateK = new Date(k.conteudo).getTime();
							if (k.operador === ">=") {
								// MAIOR OU IGUAL
								if (!(dateM >= dateK)) {
									podeExibir = false;
								}
							} else if (k.operador === "<=") {
								// MENOR OU IGUAL
								if (!(dateM <= dateK)) {
									podeExibir = false;
								}
							} else if (k.operador === ">") {
								// MAIOR
								if (!(dateM > dateK)) {
									podeExibir = false;
								}
							} else if (k.operador === "<") {
								// MENOR
								if (!(dateM < dateK)) {
									podeExibir = false;
								}
							} else {
								// IGUAL ou nao informado
								if (!(dateM == dateK)) {
									podeExibir = false;
								}
							}
						}
					} else {
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

						mkt.allSubPropriedades(o, (v: any) => {
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
		} else {
			aFiltrada = [];
		}
		return aFiltrada;
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			ORDER LIST									\\
//___________________________________\\

Object.defineProperty(mkt, "ordenar", {
	value: (array: object[], nomeProp: string, sortDir: any) => {
		// Possibilidade de inverter a lista (Tentar deixar esse padrao)
		// Essa funcção deveria ser da instancia atual para recever os atributos da instancia por padrao
		// 0 - Crescente:
		array.sort((oA: any, oB: any) => {
			let a = nomeProp ? mkt.getV(nomeProp, oA) : null;
			let b = nomeProp ? mkt.getV(nomeProp, oB) : null;
			//let b = oB[nomeProp];
			if (typeof a == "string") a = a.toLowerCase().trim();
			if (typeof b == "string") b = b.toLowerCase().trim();
			if (a !== b) {
				if (a > b) return 1;
				if (a < b) return -1;
			}
			if (!a || !b) { // Nulo
				return 0;
			}
			return -1;
		});
		if (!mkt.vars.contaOrdena) { mkt.vars.contaOrdena = 0; }
		mkt.vars.contaOrdena++;
		// 1 - Decrescente
		if (sortDir === 1) {
			array = array.reverse();
		} else if (sortDir === 2) {
			// 2 - Toogle 
			if (mkt.vars.contaOrden % 2 == 0) {
				array = array.reverse();
			}
		}
		return array;
	}, enumerable: false, writable: false, configurable: false,
});


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//	 MASCARAS, REGEX E	VALIDADOR		\\
//___________________________________\\
Object.defineProperty(mkt, "util", {
	value: {
		cpf: ["000.000.000-00", /^([0-9]{3}([\.]?[0-9]{3}){2}[-]?[0-9]{2})$/, (cpf: any) => {
			let m1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
			let m2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
			if (!cpf) { return false; }
			cpf = mkt.apenasNumeros(cpf);
			if (cpf.length != 11) { return false; }
			let temp = cpf.slice(0, 9);
			let c = 0;
			for (let i = 0; i < 9; i++) { c += Number(temp.charAt(i)) * m1[i]; }
			let r = c % 11;
			(r < 2) ? r = 0 : r = 11 - r;
			temp += r.toString();
			c = 0;
			for (let i = 0; i < 10; i++) { c += Number(temp.charAt(i)) * m2[i]; }
			r = c % 11;
			(r < 2) ? r = 0 : r = 11 - r;
			return cpf.charAt(10) == r.toString();
		}],
		cep: ["00.000-000", /^([0-9]{2}[\.]?[0-9]{3}[-]?[0-9]{3})$/, (cep: any) => {
			if (!cep) { return false; }
			cep = mkt.apenasNumeros(cep);
			if (cep.length != 8) { return false; }
			return true;
		}],
		cnpj: [
			"00.000.000/0000-00",
			/^([0-9]{2}([\.]?[0-9]{3}){2}[\/]?[0-9]{4}[-]?[0-9]{2})$/, (cnpj: any) => {
				let m1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
				let m2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
				if (!cnpj) { return false; }
				cnpj = mkt.apenasNumeros(cnpj);
				if (cnpj.length != 14) { return false; }
				let temp = cnpj.slice(0, 12);
				let c = 0;
				for (let i = 0; i < 12; i++) { c += Number(temp.charAt(i)) * m1[i]; }
				let r = (c % 11);
				(r < 2) ? r = 0 : r = 11 - r;
				temp += r.toString();
				c = 0;
				for (let i = 0; i < 13; i++) { c += Number(temp.charAt(i)) * m2[i]; }
				r = (c % 11);
				(r < 2) ? r = 0 : r = 11 - r;
				return cnpj.charAt(13) == r.toString();
			}
		],
		cpf_cnpj: [
			"00.000.000/0000-00",
			/^([0-9]{2}([\.]?[0-9]{3}){2}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}([\.]?[0-9]{3}){2}[-]?[0-9]{2})$/, (cpf_cnpj: any) => {
				return mkt.util.cpf[2](cpf_cnpj) || mkt.util.cnpj[2](cpf_cnpj);
			}
		],
		cnh: ["00000000000", /^([0-9]{11})$/, (cnh: any) => {
			if (!cnh) { return false; }
			cnh = mkt.apenasNumeros(cnh);
			if (cnh.length != 11) { return false; }
			return true;
		}],
		placa: ["AAA-0S00", /^([A-Za-z]{3}[-]?[0-9]{1}[A-Za-z0-9]{1}[0-9]{2})$/],
		placaAntesMercosul: ["AAA-0000", /^([A-Za-z]{3}[-]?[0-9]{4})$/],
		placaMercosul: [
			"AAA-0A00",
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
		anoRecente: ["0000", /^(1[8-9]([0-9]){2})|(20([0-9]){2})$/],
		ip: ["000.000.000.000", /^([0-2]?[0-9]?[0-9]([\.][0-2]?[0-9]?[0-9]){3})$/],
		data: ["0000-00-00", /^([0-9]{4}(-[0-9]{2}){2})$/],
		dataIso8601: [
			"0000-00-00T00:00:00.000Z",
			/^([0-9]{4}(-[0-9]{2}){2}T[0-9]{2}(:[0-9]{2})\.[0-9]{3}Z)$/,
		],
		numeros: ["0", /^[0-9]*$/],
		letras: ["A", /^[A-Za-z]*$/],
		telefone_ddd: ["(00) 000000000", /^[0-9]{11}$/],
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mascarar", {
	value: (texto: any, mascara: any) => {
		// Mascaras: 0=Numero, A=Letra, Outros repete.
		if (texto && mascara) {
			if (typeof texto != "string") texto = texto?.toString();
			if (typeof mascara != "string") mascara = mascara?.toString();
			let ms = [...mkt.clonar(mascara)];
			let ss = [...mkt.clonar(texto)];
			// this.l("ss: ", ss);
			let ts: any = [];
			let pm = 0;
			ss.forEach(s => {
				let t = null;
				if (/[0-9]/.test(s)) {
					t = "0";
				} else if (/[a-zA-Z]/.test(s)) {
					t = "A";
				} else {
					t = " ";
				}
				ts.push(t);
				pm++;
			});
			// this.l("ts: ", ts);
			// this.l("ms: ", ms);
			let r: any = [];
			for (let tp = 0, mp = 0; (tp < ts.length) && (mp < ms.length); tp++, mp++) {
				if (((ms[mp] === "0" || ms[mp] === "A") && (ms[mp] == ts[tp]))
					|| (ms[mp] === "S" && (ts[tp] === "A" || ts[tp] === "0"))) {
					// FORMATO IGUAL.
					r.push(ss[tp]);
				} else {
					// MESMO CARACTER
					if (ss[tp] === ms[mp]) {
						r.push(ss[tp]);
					} else {
						// this.l("> ", ss[tp], " vs ", ms[mp])
						// Mágica: Coloca o especial que o usuário não colocou.
						if (ms[mp] != "0" && ms[mp] != "A" && ms[mp] != "S") {
							r.push(ms[mp]);
							tp--;
						} else {
							mp--;
						}
					}
				}
			}
			return r.join("");
		} else {
			mkt.l("Mascarar Requer Texto: ", texto, " e Mascara: ", mascara);
		}
		return null;
	}, enumerable: false, writable: false, configurable: false,
});


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   Variaveis Estáticas            \\
//___________________________________\\
Object.defineProperty(mkt, "vars", {
	value: {
		exeTimer: 500,
		poppers: [],
		wpool: null as any | null, // WorkerPool quando iniciado
		svgSquare: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z'/></svg>",
		svgX: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'/></svg>",
		svgAB: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z'/><path d='M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z'/></svg>",
		svgBA: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z'/><path d='M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z'/></svg>",
		svgF: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z'/></svg>",
		svgL: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-left' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0'/></svg>",
		svgR: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-right' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708'/></svg>",
		clacre: "Classificar Crescente",
		cladec: "Classificar Decrescente",
		contem: "Contém...",
		espaco: "&nbsp;",
		limparIndivisual: "Limpar filtros de",
		limparTodos: "Limpar todos filtros",
		selectAll: "Selecionar Todos",
		contaListas: 0,
		contaOrdena: 0,
		paginationAtual: 1,
		objetoSelecionado: {},
		sendObjFull: {},
		mkCountValidate: 0,
		debug: 0,
		timers: [] as any, // Array para guardar timers em andamento ou finalizados
		mkFaseAtual: 1, // Old Fase System
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "t", {
	value: {
		G: "GET", // Api Method GET
		P: "POST", // Api Method POST
		J: "application/json", // ContentType JSON
		B: "*/*", // ContentType Blob
		H: "text/html", // ContentType HTML
		F: "multipart/form-data", // ContentType FORM
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "MESES", {
	value: [
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
	], enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "CORES", {
	value: {
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
	}, enumerable: false, writable: false, configurable: false,
});


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   HEAD MENU                      \\
//___________________________________\\
Object.defineProperty(mkt, "headMenuHideX", {
	value: () => {
		mkt.Q("body .mkHeadMenu")?.classList.add("oculto");
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "headMenuHide", {
	value: (ev: any) => {
		let ehm = mkt.Q("body .mkHeadMenu");
		// if (ehm?.classList.contains("lock")) {
		// 	ehm.classList.remove("lock");
		// } else {
		let ethm = ev.target.closest('.mkHeadMenu');
		if (!ethm) {
			ehm?.classList.add("oculto");
		}
		// }
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   WORKERS                        \\
//___________________________________\\
// Atalho de tarefa. Já constroi se necessário
// mkt.addTask({ k: "MKT_INCLUDE", v: ["a","b"], target: "a" }).then(r=>{mkt.l("Main Recebeu: ",r)})
Object.defineProperty(mkt, "addTask", {
	value: (msg: any, numWorkers: number | undefined) => {
		return new Promise((r) => {
			if (!mkt.vars.wpool) {
				mkt.Workers(numWorkers).then(() => {
					r(mkt.vars.wpool.addTask(msg));
				});
			} else {
				r(mkt.vars.wpool.addTask(msg));
			}
		});

	}, enumerable: true, writable: false, configurable: false,
});

/** #TASKS
 * Trazer as tarefas e processos aqui.
 * - Exclusivos - OK
 * - PK Duplicada - OK
 * - Duplice: PK Diferente, mas Mesmo Conteúdo - OK
 * - ProcessoFiltragem
 */
Object.defineProperty(mkt, "Workers", {
	value: (numWorkers: number = navigator.hardwareConcurrency || 5) => {
		if (numWorkers > 3) numWorkers = 3; // Máximo
		if (numWorkers < 1) numWorkers = 1; // Mínimo
		return new Promise((r) => {
			// Constroi elemento se ele não existir:
			if (!document.querySelector("#mktWorker")) {
				let we = document.createElement("script")
				we.setAttribute("type", "javascript/worker")
				we.setAttribute("id", "mktWorker")
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
				}`
				document.body.append(we);
			}
			// Transformar o elemento em link para dar inicio a classe.
			let workerBlob: string = window.URL.createObjectURL(new Blob([mkt.Q("#mktWorker")?.textContent], { type: "text/javascript" }));
			class WorkerPool {
				idleWorkers: Array<Worker>;
				workQueue: Array<any>;
				workerMap: Map<Worker, any>;
				// New
				constructor(numWorkers: number, workerSource: string) {
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
				// Response
				_workerDone(worker: Worker, error: ErrorEvent | null, msg: MessageEvent<any> | null) {
					let [res, rej] = this.workerMap.get(worker);
					this.workerMap.delete(worker);
					if (this.workQueue.length === 0) {
						this.idleWorkers.push(worker);
					} else {
						let [task, res, rej] = this.workQueue.shift();
						this.workerMap.set(worker, [res, rej]);
						worker.postMessage(task);
					}
					error === null ? res(msg) : rej(error);
				}
				// Send Task
				addTask(task: any) {
					return new Promise((res, rej) => {
						if (this.idleWorkers.length > 0) {
							let worker = this.idleWorkers.pop();
							if (worker) {
								this.workerMap.set(worker, [res, rej])
								worker.postMessage(task);
							} else {
								mkt.w("addTask() - Worker desocupado: ", worker, " não encontrado. " + this.idleWorkers.length + " desocupados: ", this.idleWorkers, " Solicitando novo!");
								this.workQueue.push([task, res, rej]);
							}
						} else {
							this.workQueue.push([task, res, rej]);
						}
					});
				}
			} // FIM WorkerPool class
			mkt.vars.wpool = new WorkerPool(numWorkers, workerBlob);
			r(mkt.vars.wpool);
		});
	}, enumerable: true, writable: false, configurable: false,
});


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   ABA                            \\
//___________________________________\\
Object.defineProperty(mkt, "mkClicarNaAba", {
	value: (e: HTMLAnchorElement) => {
		let pag = Number(e?.getAttribute("data-pag"));
		if (mkt.classof(pag) == "Number") { // Caso não for NaN
			let mkAbasTotal = 0;
			let mkAbas = e.closest(".mkAbas");
			mkAbas?.querySelectorAll("a").forEach((a: HTMLAnchorElement) => {
				a.classList.remove("active");
				mkAbasTotal++;
			});
			e.classList.add("active");
			for (let i = 1; i <= mkAbasTotal; i++) {
				// Busca, Oculta todas, mas exibe a clicada.
				mkt.QAll(".mkAba" + i).forEach((e: any) => {
					if (i == pag) {
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
//			REGRAR E VALIDAR						\\
//___________________________________\\

Object.defineProperty(mkt, "regrar", {
	value: (container: any, nome: string, ...obj: any) => {
		/**
		 * Informar o C (Container), N (Nome do input) e OBJ (Regra)
		 * Atributos do Objeto
		 * k:		nome da regra a ser utilizada
		 * v: 	atributo da regra escolhida
		 * m: 	mensagem de exibição caso esteja em estado falso.
		 * a: 	auto executar essa regra assim que regrar (true/false)
		 * f:		força validar mesmo se estiver invisivel / desativado (true/false)
		 * on: 	padrão true. define se vai executar a regra ou não.
		 */
		if (typeof nome != "string") {
			return mkt.w("Regrar() precisa receber o nome do input como string");
		}
		container = mkt.Q(container);
		let e = container?.querySelector("*[name='" + nome + "']");
		if (e) {
			mkt.atribuir(e, () => { mkt.exeregra(e) }, "oninput");
			mkt.atribuir(e, () => { mkt.exeregra(e, event) }, "onblur");

			// Buscar Elemento e regra
			let auto = false;
			let novaregra: any = { c: container, n: nome, e: e, r: [...obj] };
			let posE = mkt.regras.findIndex((o: any) => o.e == e);
			if (posE >= 0) {
				// Elemento já encontrado, substituir a regra específica
				novaregra.r.forEach((i: any) => {
					let posRe = mkt.regras[posE].r.findIndex((o: any) => o.k == i.k);
					if (posRe >= 0) {
						for (let p in novaregra.r) {
							mkt.regras[posE].r[posRe] = novaregra.r[p];
						}
					} else {
						mkt.regras[posE].r.push(i);
					}
				});
			} else {
				mkt.regras.push(novaregra);
			}
			// Auto Executa
			if (auto) {
				mkt.exeregra(e, "inicial");
			}
		} else {
			mkt.w("Regrar Requer Elemento (" + nome + "): ", e, " Container: ", container)
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "vibrar", {
	value: async (tipo: boolean | null) => {
		if (tipo === false) {
			navigator.vibrate([100, 30, 100, 30, 100]); // 3 tempos curtos com intervalo representando: "Não, Não, Não"
		} else if (tipo === true) {
			navigator.vibrate([300]); // 3 tempos sem intervalo representando: "Efetivado"
		} else {
			navigator.vibrate([200, 50, 200]) // 2 Tempos seguidos representando: "Talvez"
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "estaValido", {
	value: async (container: any) => {
		container = mkt.Q(container);
		let validou = false;

		// Informando um container qualquer, executa apenas as regras dentro deles.
		let promises: any = [];
		mkt.regras.forEach((regra: any) => {
			if (mkt.isInside(regra.e, container)) {
				promises.push(mkt.exeregra(regra.e, "full"));
			}
		});
		let resultado: any = [];
		resultado = await Promise.all(promises);
		validou = resultado.flat().length <= 0;
		if (!validou) {
			mkt.vibrar(false);
			mkt.gc("Validou a ação? ", (validou ? "Sim." : "Não."));
			resultado.flat().forEach((r: any) => {
				mkt.gc("Regra:", r.k?.toString().toUpperCase(), "Campo: " + r.e?.name);
				mkt.l(r.e);
				mkt.ge();
			});
			mkt.ge();
		} else {
			mkt.l("Validou a ação? Sim.");
		}

		return validou;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "m", {
	value: {
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
		apenasletras: "Apenas Letras",
		datamaiorque: "Deve ser maior que hoje",
		datamenorque: "Deve ser menor que hoje",
		carregarmais: "Carregar Mais Resultados",
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "exeregra", {
	value: async (e: any, ev: any = null) => {
		// Função que executa as regras deste campo com base nos objetos salvos
		// Quando concluir (onChange), executar novamentepra remover erros já corrigidos (justamente no último caracter).
		return new Promise((resolver) => {
			let erros: any = [];
			let regrasDoE = mkt.regras.find((o: any) => o.e == e);
			let eDisplay = regrasDoE?.c.querySelector(".mkRegrar[data-valmsg-for='" + regrasDoE.n + "']")
			let regras = regrasDoE?.r;
			let promises: any = []
			if (regras) {
				regras.forEach((re: any) => {
					if (!re.target) {
						re.target = "value";
					}
					if (re.on == null) {
						re.on = true;
					}
					let podeValidar = re.on; // Padrão validar, mas se regra estiver com o on=false, já inicia o giro sem validar;
					if (!e.offsetParent) { // Invisivel, padrão sem validar
						podeValidar = false;
					}
					if (e.classList.contains("disabled")) { // Desativado, padrão sem validar
						podeValidar = false;
					}
					// Validar apenas quando i estiver true na regra OU  Visível e Não bloqueado
					if (podeValidar || re.f) {
						promises.push(new Promise((prom) => {
							re.e = e;
							let regraK = re.k?.toLowerCase();

							switch (regraK) {

								case "mascarar":  // EXE
									if (e[re.target]) {
										let mascarado = mkt.mascarar(e[re.target], re.v)
										if (mascarado != null) e[re.target] = mascarado;
									}
									prom(re.k);
									break;

								case "moeda":  // EXE
									if (e[re.target]) {
										e[re.target] = mkt.toMoeda(e[re.target]);
									}
									prom(re.k);
									break;

								case "numero":  // EXE
									if (e[re.target]) {
										e[re.target] = mkt.fromNumber(e[re.target]);
									}
									prom(re.k);
									break;

								case "charproibido": // EXE
									for (let c of re.v) {
										if (e[re.target].includes(c)) {
											if (!re.m) re.m = mkt.m.charproibido + c;
											erros.push(re);
											e[re.target] = e[re.target].replaceAll(c, "");
										}
									}
									prom(re.k);
									break;

								case "apenasnumeros": // EXE
									if (!(mkt.util.numeros[1].test(e[re.target]))) {
										if (!re.m) re.m = mkt.m.apenasnumeros;
										erros.push(re);
										e[re.target] = e[re.target].replaceAll(/((?![0-9]).)/g, "")
									}
									prom(re.k);
									break;

								case "apenasletras": // EXE
									if (!(mkt.util.letras[1].test(e[re.target]))) {
										if (!re.m) re.m = mkt.m.apenasletras;
										erros.push(re);
										e[re.target] = e[re.target].replaceAll(/((?![a-zA-Z]).)/g, "")
									}
									prom(re.k);
									break;

								case "maxchars": // EXE
									e.setAttribute("maxlength", re.v);
									if (e[re.target].length > Number(re.v)) {
										if (!re.m) re.m = mkt.m.maxc;
										erros.push(re);
										e[re.target] = e[re.target].slice(0, Number(re.v));
									}
									prom(re.k);
									break;

								case "minchars": // EXE
									e.setAttribute("minlength", re.v);
									if (e[re.target].length < Number(re.v)) {
										if (!re.m) re.m = mkt.m.minc + re.v;
										erros.push(re);
										let _a = [...e[re.target]];
										if (!re.fill) re.fill = "0";
										while (_a.length <= Number(re.v)) {
											_a.unshift(re.fill.charAt(0));
										}
										e[re.target] = _a.join("");
									}
									prom(re.k);
									break;

								case "datamax": // EXE
									if (mkt.getMs(e[re.target]) > mkt.getMs(re.v)) {
										if (!re.m) re.m = mkt.m.datamax;
										erros.push(re);
										e[re.target] = re.v;
									}
									prom(re.k);
									break;

								case "nummin": // EXE
									e.setAttribute("min", re.v);
									if (mkt.mkFloat(e[re.target]) < Number(re.v)) {
										if (!re.m) re.m = mkt.m.nummin + re.v;
										erros.push(re);
										e[re.target] = re.v;
									}
									prom(re.k);
									break;

								case "nummax": // EXE
									e.setAttribute("max", re.v);
									if (mkt.mkFloat(e[re.target]) > Number(re.v)) {
										if (!re.m) re.m = mkt.m.nummax + re.v;
										erros.push(re);
										e[re.target] = re.v;
									}
									prom(re.k);
									break;

								case "obrigatorio": // INFO
									if (re.v == null) re.v = "true";
									if (re.v == "true") {
										if (e[re.target] == "") {
											if (!re.m) {
												if (e.classList.contains("mkSel")) {
													re.m = mkt.m.so;
												} else {
													re.m = mkt.m.po;
												}
											}
											erros.push(re);
										}
									}
									prom(re.k);
									break;

								case "regex": // INFO
									if (!(new RegExp(re.v).test(e[re.target]))) {
										if (!re.m) re.m = mkt.m.fi;
										erros.push(re);
									}
									prom(re.k);
									break;

								case "some": // INFO 
									// (Ao menos 1 ocorrencia do regex informado) (Pode gerar varios erros)
									let _vs: any;
									re.vmfail = [];
									let b = false;
									Array.isArray(re.v) ? _vs = re.v : _vs = [re.v];
									for (let i = 0; i < _vs.length; i++) {
										if (!([...e[re.target]].some(le => new RegExp(_vs[i]).test(le)))) {
											if (!re.m) {
												re.m = mkt.m.some;
											}
											re.vmfail.push(re.vm[i]);
											b = true;
										}
									}
									if (b) {
										erros.push(re);
									}
									prom(re.k);
									break;

								case "mincharsinfo": // INFO
									e.setAttribute("minlength", re.v);
									if (e[re.target].length < Number(re.v)) {
										if (!re.m) re.m = mkt.m.minc + re.v;
										erros.push(re);
									}
									prom(re.k);
									break;

								case "maxcharsinfo": // INFO
									if (e[re.target].length > Number(re.v)) {
										if (!re.m) re.m = mkt.m.maxc + re.v;
										erros.push(re);
									}
									prom(re.k);
									break;

								case "fn": // INFO
									if (!(re.v(e[re.target]))) {
										if (!re.m) re.m = mkt.m.negado;
										erros.push(re);
									}
									prom(re.k);
									break;

								case "datamaiorque": // INFO
									if (mkt.getMs(e[re.target]) < mkt.getMs(re.v)) {
										if (!re.m) re.m = mkt.m.datamaiorque;
										erros.push(re);
									}
									prom(re.k);
									break;

								case "datamenorque": // INFO
									if (mkt.getMs(e[re.target]) > mkt.getMs(re.v)) {
										if (!re.m) re.m = mkt.m.datamenorque;
										erros.push(re);
									}
									prom(re.k);
									break;

								case "server": // INFO - ASYNC EVENT
									//(Verificação remota, DB / API)
									if (ev) {
										if (!re.m) re.m = mkt.m.in;
										if (e[re.target] != "") {
											e.classList.add("pending");
											let queryString = "?" + regrasDoE.n + "=" + e[re.target];
											// Anexar campos adicionais:
											if (re.a) {
												let arrAdd: Array<string> = re.a.split(",");
												arrAdd.forEach((s: string) => {
													let eAdd = regrasDoE.c.querySelector("*[name='" + s + "']");
													if (eAdd) {
														queryString += "&" + s + "=" + eAdd[re.target];
													} else {
														mkt.w("Regrar: Campo Adicional solicitado não encontrado: ", s);
													}
												});
											}
											mkt.get.json({ url: re.v + queryString, quiet: true }).then((p: any) => {
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
										} else {
											erros.push(re);
											prom(re.k);
										}
									} else {
										// Apenas executa quando não tem evento
										prom(re.k);
									}
									break;

								default:
									mkt.w("Regrar() - Regra não encontrada: ", regraK)
									prom(null);
							} // fim switch regras possíveis

						})); // <= Promessas push
					} // <= Fim do PodeValidar
				}); // <= A cada regra
			} // Possui regra
			Promise.all(promises).then(ok => {
				if (erros.length > 0) {
					let mensagens = erros.map((a: any) => {
						if (Array.isArray(a.vmfail)) {
							// Aqui dá pra evoluir se houver um template nos padrões.
							a.m = mkt.m.some + a.vmfail.join(", ");
						}
						return a.m;
					}).join("<br/>");
					mkt.regraDisplay(e, true, eDisplay, mensagens);
					mkt.TerremotoErros("");
				} else {
					mkt.regraDisplay(e, false, eDisplay, "");
				}
				resolver(erros);
			});
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "regraDisplay", {
	value: (e: any, erro: boolean, eDisplay: any, mensagem: string = "") => {
		// Reagindo similar ao Unobtrusive, mas usando oculto no span.
		// Falta um meio pra limpar o display da regra
		if (erro) {
			e.classList.remove("valid");
			e.classList.add("input-validation-error");
			eDisplay?.classList.remove("oculto");
			eDisplay?.classList.add("field-validation-error");
		} else {
			if (e.offsetParent && !e.classList.contains("disabled")) { // Não setar valido nos desativados/invisiveis
				e.classList.add("valid");
			}
			e.classList.remove("input-validation-error");
			eDisplay?.classList.add("oculto");
		}
		if (eDisplay) eDisplay.innerHTML = mensagem;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "regraClear", {
	value: () => {
		// A cada elemento
		mkt.regras.forEach((r: any) => {
			let e = r.e;
			let eDisplay = r.c.querySelector(".mkRegrar[data-valmsg-for='" + r.n + "']")
			mkt.regraDisplay(e, false, eDisplay);
		})
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "desregrar", {
	value: async (container: any) => {
		// Remove as regras de um determinado container
		container = mkt.Q(container);

		mkt.regras.forEach((r: any) => {
			if (mkt.isInside(r.e, container)) {
				mkt.regras.splice(mkt.regras.indexOf(r), 1);
			}
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "TerremotoErros", {
	value: (form: string): void => {
		// Efeito de terremoto em campos com erros no formulario informado
		if (!form) form = "";
		mkt.QAll(form + " input.input-validation-error").forEach((e: HTMLInputElement) => {
			e.nextElementSibling?.classList.add("mkTerremoto");
			setTimeout(() => {
				e.nextElementSibling?.classList.remove("mkTerremoto");
			}, 500);
		});
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			FASEADOR / FasearMK (OBJ)		\\
//___________________________________\\

Object.defineProperty(mkt, "fase", {
	value: (possiveis: number[], config: any) => {
		// Botões: .btnVoltar, .btnAvancar, .btnConclusivo.
		// Telas: .modalFaseX (X é o numero da fase)
		// Utiliza a array mkt.fase.possiveis para possibilitar a rota
		// config.classe (Classe do container que cerca todas as fases, botoes e navegadores)
		// Faltando os Validadores no avancar e colocar o avancar específico no menu html.
		class FasearMK {
			possiveis: number[];
			atual: number;
			historico: number[];
			config: any;
			constructor(possiveis: number[], config: any) {
				this.possiveis = possiveis;
				this.atual = possiveis[0];
				this.historico = [this.atual];
				if (typeof config != "object") { config = {}; }
				if (!config.classe) { config.classe = ""; }
				if (!config.aoAvancar) { config.aoAvancar = this.aoAvancar }
				this.config = config;
				this.update();
			}
			async aoAvancar() { }
			async avancar(novaFase: any = null) {
				return new Promise(async (r, err) => {
					if (await mkt.estaValido(".modalFase" + this.atual)) {
						if (novaFase) {
							if (novaFase instanceof HTMLElement) {
								if (novaFase.getAttribute("data-libera")) {
									this.atual = Number(novaFase.getAttribute("data-pag"))
									this.config.aoAvancar();
								} else {
									mkt.w("Avançar para fase específica negado. Requer Libera!")
								}
							} else {
								this.atual = novaFase;
							}
							this.historico.push(this.atual);
							this.update();
							r(this.atual);
						} else {
							let proxFase = this.possiveis[this.possiveis.indexOf(this.atual) + 1];
							if (proxFase) {
								this.atual = proxFase;
								this.historico.push(this.atual);
								this.update();
								r(this.atual);
							} else {
								err("Não é possível avançar mais.");
							}
						}
					} else {
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
						} else {
							err("Não há histórico de onde voltar.");
						}
					} else {
						err("Já está na primeira fase possível.")
					}
				});
			}
			update() {
				mkt.QAll(this.config.classe + " ul.mkUlFase li a").forEach((e: HTMLAnchorElement) => {
					// Limpar os Status
					e.parentElement?.classList.remove("mkFaseBack");
					e.parentElement?.classList.remove("mkFaseAtivo");
					e.parentElement?.classList.remove("disabled");
					let eNumPag = Number(e.getAttribute("data-pag"));
					let bLibera = e.getAttribute("data-libera");
					// Tem-se a o elemento e o numero
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
					} else {
						mkt.w("Fase não encontrada: .modalFase" + i);
					}
				}
				mkt.QverOff(this.config.classe + " .btnVoltar");
				mkt.QverOff(this.config.classe + " .btnAvancar");
				mkt.QverOff(this.config.classe + " .btnConclusivo");
				if (Array.isArray(this.possiveis)) {
					if (this.possiveis.length >= 0) {
						if (this.possiveis.indexOf(this.atual) >= this.possiveis.length - 1) {
							// Fase Atual é a última possível, Então não há como avançar
							mkt.QverOn(this.config.classe + " .btnConclusivo");
						} else {
							// Não está na última posição
							mkt.QverOn(this.config.classe + " .btnAvancar");
						};
						if (this.possiveis.indexOf(this.atual) >= 1) {
							// Não está na primeira posição possível
							mkt.QverOn(this.config.classe + " .btnVoltar");
						};
						mkt.QverOn(this.config.classe + " .modalFase" + this.atual);
					} else {
						mkt.w("A array mkt.fase.possiveis não contém opções para dar update.");
					}
				} else {
					mkt.erro("mkt.fase.possiveis Deve ser uma Array!");
				}
			}
			has(x: number) {
				return typeof x === "number" && this.possiveis.includes(x);
			}
			toString() {
				return `[${this.possiveis.join()}]`;
			}
			// Iterator
			[Symbol.iterator]() {
				let next = 0;
				let last = this.possiveis;
				return {
					next() {
						// Só avança se não estiver no fim.
						return next < last.length ? { value: last[next++] } : { done: true };
					},
					[Symbol.iterator]() {
						return this;
					},
				};
			}
		}
		return new FasearMK(possiveis, config);
	}, enumerable: false, writable: false, configurable: false,
});


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			MK Molde (Template/Modelo)	\\
//___________________________________\\


Object.defineProperty(mkt, "removerAspas", {
	value: (s: any) => {
		if (typeof s == "string") {
			s = s.replaceAll('"', "&quot;");
			s = s.replaceAll("\'", "&#39;");
		}
		return s;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getV", {
	value: (keys: string, objeto: any) => {
		// Retorna o valor do chave informada, podendo ser obj.obj.chave
		// mkt.getV("a.b.c",{a:{b:{c:"d"}}})
		if (typeof objeto == "object") {
			if (typeof keys == "string") {
				if (keys.includes(".")) {
					// Multi
					let ks: string[] = keys.split(".");
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
				} else {
					// Simples
					return objeto[keys];
				}
			} else {
				mkt.w(
					"getV() - Nome da propriedade precisa ser em string. (" + typeof keys + "):", keys
				);
			}
		} else {
			mkt.w(
				"Para ver a chave, o parametro objeto precisa receber um objeto. (" +
				typeof objeto +
				")"
			);
		}
		return null;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkToValue", {
	value: (m: string, o: any) => {
		// Conversor de "${obj.key}" em valor.
		let ret: string = "";
		if (m.indexOf("${") >= 0) {
			let ini = m.split("${");
			ret = ini[0];
			for (let i in ini) {
				if (i == "0") continue;
				let end: number = ini[i].indexOf("}");
				let key: string = ini[i].slice(0, end).trim();
				if ((mkt.classof(o) == "Object" || mkt.classof(o) == "Array") && o != null) {
					// Quando é Objeto ou Array, entra na propriedade ou posição solicitada.
					let v = mkt.removerAspas(mkt.getV(key, o));
					if (v != null) {
						ret += v;
					}
				}
				ret += ini[i].slice(end + 1);
			}
		} else {
			ret = m;
		}
		return ret;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkMoldeOA", {
	value: async (
		dadosOA: object[] | object,
		modelo: string = "#modelo",
		repositorio: string = ".tableListagem .listBody"
	) => {
		return new Promise((r) => {
			let eModelo = mkt.Q(modelo);
			if (eModelo == null) {
				mkt.erro(
					"Template informado (" + modelo + ") não encontrado."
				);
				return r(null);
			}
			let eRepositorio = mkt.Q(repositorio);
			if (eRepositorio == null) {
				mkt.erro(
					"Repositório informado (" + repositorio + ") não encontrado."
				);
				return r(null);
			}
			let listaNode = "";
			let mkMoldeOAA_Execute = (o: any) => {
				let node: any = eModelo.innerHTML;
				node = mkt.mkToValue(node, o);
				listaNode += node;
			};
			mkt.mkExecutaNoObj(dadosOA, mkMoldeOAA_Execute);
			//Allow Tags
			listaNode = listaNode.replaceAll("&lt;", "<");
			listaNode = listaNode.replaceAll("&gt;", ">");
			eRepositorio.innerHTML = listaNode;
			r(true);
		});
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			MK Include									\\
//___________________________________\\

Object.defineProperty(mkt, "mkInclude", {
	value: async () => {
		return new Promise((r) => {
			mkt.QAll("body *").forEach(async (e: HTMLElement) => {
				let destino = e.getAttribute("mkInclude");
				if (destino != null) {
					//mkt.l("Incluindo: " + destino);
					let p = await mkt.get.html({ url: destino, quiet: true });
					if (p.retorno != null) {
						e.innerHTML = p.retorno;
						//mkt.mkNodeToScript(mkt.Q(".conteudo"));
					} else {
						mkt.l("Falhou ao coletar dados");
					}
					r(p.retorno);
				}
			});
		});
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			MK UI Confirmar							\\
//___________________________________\\

Object.defineProperty(mkt, "mkConfirma", {
	value: async (
		texto: string = "Você tem certeza?",
		p: any = null
	) => {
		// p { corSim: "bVerde", corNao: "bCinza"}
		let possiveisBotoes = ["bCinza", "bVermelho", "bVerde"];
		let corSim = "bVerde";
		if (p?.corSim != undefined) corSim = p.corSim;
		let corNao = "bCinza";
		if (p?.corNao != undefined) corNao = p.corNao;
		let classContainer = "";
		if (p?.classContainer != undefined) classContainer = p.classContainer;
		return new Promise((r) => {
			function verficiarResposta() {
				let resposta = null;
				if (mkt.Q(".mkConfirmadorBloco .mkConfirmadorArea .bBotao.icoSim.true"))
					resposta = true;
				if (mkt.Q(".mkConfirmadorBloco .mkConfirmadorArea .bBotao.icoNao.true"))
					resposta = false;
				//mkt.l("Resposta: " + resposta);
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
				divMkConfirmarSim.innerHTML = "Sim";
				divMkConfirmarNao.innerHTML = "Não";
				divMkConfirmarFora.setAttribute(
					"onclick",
					"mkt.w('Essa funcionalidade não está disponível no momento.')"
				);
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
			} else {
				// Limpeza de cores anteriores
				possiveisBotoes.forEach((s) => {
					mkt.QAll(".mkConfirmadorBloco .bBotao").forEach((botao: any) => {
						botao.classList.remove(s);
					});
				});
				// Set das cores novas
				mkt.Q(".mkConfirmadorBloco .bBotao.icoSim").classList.add(corSim);
				mkt.Q(".mkConfirmadorBloco .bBotao.icoNao").classList.add(corNao);
				mkt.Q(".mkConfirmadorBloco").classList.remove("oculto");
				mkt.Q(".mkConfirmadorTexto").innerHTML = texto;
			}
			const checkResposta = setInterval(verficiarResposta, 100);
			// Função de conclusão.
			function retornar(resultado: boolean = false) {
				clearInterval(checkResposta);
				return r(resultado);
			}
		});
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			MK Botao Imagem (mkBot)			\\
//___________________________________\\

Object.defineProperty(mkt, "mkBotCheck", {
	value: async () => {
		// Botao incluido uma imagem/pdf visualizavel e clicavel.
		// Valor inicial no value, quando não presente, exibe data-value.
		mkt.QAll("button.mkBot").forEach(async (e: any) => {
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
					} else {
						retornar +=
							e.innerHTML = "img class='mkCem' src='" + v;
					}
					if (exibirbarra) {
						retornar += "#toolbar=0"
					}

					// << Fim o conteúdo
					retornar += "'>";
					// Se é ou não clicavel
					if (!clicavel) {
						retornar += "<div class='mkBotSobre'></div>"
					}
					// Set
					e.innerHTML = retornar;

					// Ao concluir, tenta executar atributo onchange, se houver
					if (!semEvento) {
						if (e.onchange) {
							e.onchange();
						}
					}

				} else {
					mkt.w("Elemento com 'value' nulo. Esperava-se conteudo: ", v);
				}
				e.classList.remove("atualizando");
			}
		});
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			MK Recomendador (mkRec)			\\
//___________________________________\\

Object.defineProperty(mkt, "mkRecRenderizar", {
	value: async () => {
		mkt.QAll("input.mkRec").forEach(async (e: HTMLInputElement) => {
			// Gerar Elemento de recomendações
			if (!e.nextElementSibling?.classList.contains("mkRecList")) {
				let ePai: any = e.parentElement;
				let ePos = Array.from(ePai?.children).indexOf(e);
				let divMkRecList = document.createElement("div");
				divMkRecList.className = "mkRecList emFoco";
				divMkRecList.setAttribute("tabindex", "-1");
				ePai?.insertBefore(divMkRecList, ePai?.children[ePos + 1]);
				// Incrementar Evento
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
				e.setAttribute(
					"autocomplete",
					"off"
				);
				const popperInstance: any = Popper.createPopper(
					e,
					divMkRecList,
					{
						placement: "bottom-start",
						strategy: "fixed",
						modifiers: [],
					}
				);
				mkt.vars.poppers.push(popperInstance);
				mkt.mkRecUpdate(e);
			} else {
				if (!e.getAttribute("data-selarray") && e.getAttribute("data-refill")) {
					// REC não foi implementado refill
					//await mkt.mkRecDelRefillProcesso(e as HTMLElement);
				}
				let geraEvento = false;
				if (e.classList.contains("atualizar")) geraEvento = true;
				// Atualiza a lista com base na classe "atualizar" (Gera Evento input e change)
				if (e.classList.contains("atualizar") || e.classList.contains("atualizarSemEvento")) {
					e.classList.remove("atualizar");
					e.classList.remove("atualizarSemEvento");
					e.classList.add("atualizando");
					mkt.mkRecUpdate(e)
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
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkRecUpdate", {
	value: (e: any) => {
		// Recebe o elemento input principal.
		// GERA CADA ITEM DA LISTA COM BASE NO JSON
		if (e?.getAttribute("data-selarray") != "") {
			let eList = e.nextElementSibling;
			let array = e.dataset.selarray;
			eList.innerHTML = "";
			if (mkt.isJson(array)) {
				let kvList = mkt.parseJSON(array);
				let c = 0;
				/* ITENS */
				kvList.forEach((o: any) => {
					if (o.v != null && o.v != "") {
						if (mkt.like(e.value, o.v) && e.value.trim() != o.v.trim()) {
							c++;
							let item = document.createElement("div");
							let itemTexto = document.createElement("span");
							item.className = "recItem";
							item.setAttribute("data-k", o.k);
							item.setAttribute(
								"onmousedown",
								"mkt.mkRecChange(this,'" + o.v + "')"
							);
							itemTexto.innerHTML = o.v;
							item.appendChild(itemTexto);
							eList.appendChild(item);
						}
					}
				});
				if (c <= 0) {
					eList.innerHTML = "Sem recomendações";
				}
			} else {
				mkt.w(
					"mkRecUpdate(e):  atributo selarray Não é um JSON válido: ", array
				);
			}
		} else {
			mkt.w("mkRecUpdate(e): Elemento não encontrado ou selarray dele está vazia.", e);
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkRecChange", {
	value: (recItem: any, texto: string) => {
		let e = recItem?.parentElement?.previousElementSibling
		if (e) {
			e.value = texto;
			setTimeout(() => { mkt.mkRecUpdate(e); e.focus() }, 10);
		} else {
			mkt.w("Não foi possível alterar o elemento: ", e);
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkRecFoco", {
	value: (input: any, f: Boolean) => {
		let e = input?.nextElementSibling
		if (e) {
			if (!f) {
				e.classList.add("emFoco")
			} else {
				e.classList.remove("emFoco");
			}
		} else {
			mkt.w("Não foi possível alterar o elemento: ", e);
		}
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			MK Seletor (mkSel)					\\
//___________________________________\\

Object.defineProperty(mkt, "mkSelRenderizar", {
	value: async () => {
		mkt.QAll("input.mkSel").forEach(async (e: HTMLInputElement) => {
			// Transforma elemento se ele ainda não foi transformado
			if (!e.parentElement?.classList.contains("mkSelBloco")) {
				// COLETA
				let ePai: any = e.parentElement;
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
				if (
					e.getAttribute("data-selmovesel") == "true" &&
					e.getAttribute("data-selapenas") == "1"
				) {
					let divMkSelArrowSelLeft = document.createElement("div");
					let divMkSelArrowSelRight = document.createElement("div");
					divMkSelArrowSelLeft.className = "mkSelArrowSelLeft microPos6";
					divMkSelArrowSelRight.className = "mkSelArrowSelRight microPos4";
					divMkSeletorPesquisa.appendChild(divMkSelArrowSelLeft);
					divMkSeletorPesquisa.appendChild(divMkSelArrowSelRight);
					divMkSelArrowSelLeft.setAttribute("onclick", "mkt.mkSelLeftSel(this)");
					divMkSelArrowSelRight.setAttribute(
						"onclick",
						"mkt.mkSelRightSel(this)"
					);
					divMkSeletorBloco.style.setProperty("--mkSelArrowSize", "24px");
				}
				// Seta atributos e Gatilhos
				e.removeAttribute("style");
				e.setAttribute("readonly", "true");
				e.setAttribute("tabindex", "-1");
				mkt.mkSelTabIndex(e);
				divMkSeletorInputExibe.setAttribute("placeholder", "Filtro \u{1F50D}");
				divMkSeletorInputExibe.setAttribute(
					"onfocus",
					"mkt.mkSelPesquisaFocus(this)"
				);
				divMkSeletorInputExibe.setAttribute(
					"onblur",
					"mkt.mkSelPesquisaBlur(this)"
				);
				divMkSeletorInputExibe.setAttribute(
					"oninput",
					"mkt.mkSelPesquisaInput(this)"
				);
				divMkSeletorInputExibe.setAttribute(
					"onkeydown",
					"mkt.mkSelPesquisaKeyDown(event)"
				);
				divMkSeletorInputExibe.setAttribute(
					"autocomplete",
					"off"
				);
				divMkSeletorList.addEventListener("scroll", (ev) => {
					mkt.mkSelMoveu(ev.target);
				});
				// Popular Lista
				mkt.mkSelPopularLista(e);
				// Seleciona baseado no value do input
				mkt.mkSelUpdate(e);
				// Deixar Elemento de forma visivel, mas inacessivel.
				if (e.getAttribute("data-dev") != "true") {
					e.classList.add("mkSecreto");
				}
				// v2
				const popperInstance: any = Popper.createPopper(
					divMkSeletorPesquisa,
					divMkSeletorList,
					{
						placement: "bottom-start",
						strategy: "fixed",
						modifiers: [],
					}
				);
				mkt.vars.poppers.push(popperInstance);
			} else {
				// Se não tem array, mas tem o refill e entrou para atualizar, faz o processo de refill genérico
				if (!e.getAttribute("data-selarray") && e.getAttribute("data-refill")) {
					await mkt.mkSelDelRefillProcesso(e as HTMLElement);
				}
				// Atualiza a lista com base na classe "atualizar" (Gera Evento input e change)
				if (e.classList.contains("atualizar")) {
					e.classList.remove("atualizar");
					e.classList.add("atualizando");
					mkt.mkSelPopularLista(e);
					mkt.mkSelUpdate(e);
					// Executa evento, em todos atualizar.
					// O evento serve para que ao trocar o 1, o 2 execute input para então o 3 tb ter como saber que é pra atualizar
					e.dispatchEvent(new Event("input"));
					e.dispatchEvent(new Event("change"));
					e.classList.remove("atualizando");
				}
				if (e.classList.contains("atualizarSemEvento")) {
					e.classList.remove("atualizarSemEvento");
					e.classList.add("atualizando");
					mkt.mkSelPopularLista(e);
					mkt.mkSelUpdate(e);
					e.classList.remove("atualizando");
				}
				// Manter index em -1 para não chegar até esse campo
				e.setAttribute("tabindex", "-1");
				mkt.mkSelTabIndex(e);
			}
		});
		// Atualiza posição com a mesma frequencia que pesquisa os elementos.
		mkt.vars.poppers.forEach((o: any) => {
			o.update();
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelDelRefillProcesso", {
	value: async (
		eName: string | HTMLElement,
		cod = null
	) => {
		return new Promise(async (r) => {
			let e = mkt.Q(eName);
			if (e) {
				// Se há o elemento, e para evitar puxar várias veses a mesma lista, adiciona-se uma classe no inicio e tira-se quando concluiu. Se já tem, não refaz.
				if (!e.classList.contains("refilling")) {
					e.classList.add("refilling");
					let url = appPath + e.getAttribute("data-refill");
					cod != null ? (url += cod) : null;
					let p = await mkt.get.json(url);
					if (p.retorno != null) {
						let kv = p.retorno;
						if (typeof p.retorno == "object") {
							kv = mkt.stringify(p.retorno);
						}
						if (mkt.isJson(kv)) {
							e.setAttribute("data-selarray", kv);
							e.classList.remove("refilling");
							r(e);
						} else {
							mkt.erro("Resultado não é um JSON. (mkSelDlRefill)");
						}
					}
				} // Apenas 1 rewfill por vez
			} else {
				mkt.w(
					"Função (mkSelDlRefill) solicitou Refill em um campo inexistente (JS)"
				);
			}
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelDlRefill", {
	value: async (
		eName: string | HTMLElement,
		cod: any,
		clear: boolean = true
	): Promise<void> => {
		mkt.mkSelDelRefillProcesso(eName, cod).then((e: any) => {
			if (clear) e.value = "";
			e.classList.add("atualizar");
		});
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelTabIndex", {
	value: (e: any) => {
		if (e.classList.contains("disabled")) {
			let pes = e.nextElementSibling;
			if (pes) {
				if (pes.classList.contains("mkSelPesquisa")) {
					pes.firstElementChild?.setAttribute("tabindex", "-1");
				}
			}
		} else {
			let pes = e.nextElementSibling;
			if (pes) {
				if (pes.classList.contains("mkSelPesquisa")) {
					pes.firstElementChild?.removeAttribute("tabindex");
				}
			}
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelSelecionar", {
	value: (eItem: any) => {
		let ePrincipal = eItem.parentElement?.parentElement?.firstElementChild;
		let KV = mkt.mkSelGetKV(ePrincipal);
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
		} else if (selLimit > 1 || selLimit < 0) {
			let itemK = eItem.getAttribute("data-k");
			let jaSelecionado = 0;
			// Forma um array caso ainda não seja, pois pode seleconar mais de um.
			let arraySelecionado: string[] = [];
			// Verifica se algum KV.k é o K clicado. (Para saber se vai adicionar ou remover)
			KV.forEach((ObjKV: any) => {
				arraySelecionado.push(ObjKV.k.toString());
				if (ObjKV.k == itemK) jaSelecionado++;
			});
			if (jaSelecionado > 0) {
				// Remove valor da lista selecionada
				arraySelecionado.splice(arraySelecionado.indexOf(itemK), 1);
			} else {
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
			} else {
				let string = mkt.stringify(arraySelecionado);
				if (ePrincipal.type == "text") ePrincipal.value = string;
				else
					mkt.erro(
						"Erro durante o Set/Conversão do campo. É necessário que este campo seja tipo string."
					);
			}
			// Gera o Evento
			ePrincipal.dispatchEvent(new Event("input"));

			// Mantem foco no Display, pois pode selecionar mais de um
			setTimeout(() => {
				eItem.parentElement.previousElementSibling.firstElementChild.focus();
			}, 1);
		}
		mkt.mkSelUpdate(ePrincipal);
		// Evento change apos terminar a atualizacao
		ePrincipal.dispatchEvent(new Event("change"));
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelLeftSel", {
	value: (e: any) => {
		let eAlvo = null;
		Array.from(e.parentElement?.nextElementSibling?.children).forEach(
			(el: any) => {
				if (el.getAttribute("data-s") == "1") {
					eAlvo = (el as HTMLInputElement).previousElementSibling;
					return;
				}
			}
		);
		if (eAlvo == null) {
			mkt.mkSelSelecionar(e.parentElement?.nextElementSibling?.lastElementChild);
		} else {
			if ((eAlvo as HTMLElement).classList.contains("mkSelItemDeCima")) {
				eAlvo = (eAlvo as HTMLElement).parentElement?.lastElementChild
					?.previousElementSibling;
			}
			mkt.mkSelSelecionar(eAlvo);
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelRightSel", {
	value: (e: any) => {
		let eAlvo = null;
		Array.from(e.parentElement.nextElementSibling.children).forEach(
			(el: any) => {
				if (el.getAttribute("data-s") == "1") {
					eAlvo = el.nextElementSibling;
					return;
				}
			}
		);
		if (eAlvo == null) {
			mkt.mkSelSelecionar(e.parentElement.nextElementSibling.firstElementChild);
		} else {
			if ((eAlvo as HTMLElement).classList.contains("mkSelItemDeBaixo")) {
				eAlvo = (eAlvo as HTMLElement).parentElement?.firstElementChild
					?.nextElementSibling;
			}
			mkt.mkSelSelecionar(eAlvo);
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelPopularLista", {
	value: (e: any) => {
		// GERA CADA ITEM DA LISTA COM BASE NO JSON
		if (e.getAttribute("data-selarray") != "") {
			let eList = e.nextElementSibling.nextElementSibling;
			eList.innerHTML = "";
			try {
				let seletorArray = mkt.parseJSON(e.getAttribute("data-selarray"));
				if (seletorArray != null) {
					let c = 0;
					/* ITENS */
					seletorArray.forEach((o: any) => {
						if (o.k != null) {
							c++;
							let divMkSeletorItem = document.createElement("div");
							let divMkSeletorItemTexto = document.createElement("span");
							let divMkSeletorItemArrow = document.createElement("div");
							divMkSeletorItem.className = "mkSelItem";
							divMkSeletorItemArrow.className = "mkSelItemArrow";
							divMkSeletorItem.setAttribute("data-k", o.k);
							divMkSeletorItem.setAttribute(
								"onmousedown",
								"mkt.mkSelSelecionar(this)"
							);
							divMkSeletorItemTexto.innerHTML = o.v;
							divMkSeletorItem.appendChild(divMkSeletorItemTexto);
							divMkSeletorItem.appendChild(divMkSeletorItemArrow);
							eList.appendChild(divMkSeletorItem);
						}
					});
					if (c <= 0) {
						eList.innerHTML = "Nenhuma opção";
					} else if (c > 10) {
						if (e.getAttribute("data-selmove") != "false") {
							let divMkSelCima = document.createElement("div");
							divMkSelCima.className = "mkSelItemDeCima microPos2";
							divMkSelCima.setAttribute(
								"onmousemove",
								"mkt.mkSelMoveCima(this);"
							);
							divMkSelCima.innerHTML = "↑ ↑ ↑";
							eList.insertBefore(divMkSelCima, eList.firstElementChild);

							let divMkSelBaixo = document.createElement("div");
							divMkSelBaixo.className = "mkSelItemDeBaixo microPos8";
							divMkSelBaixo.setAttribute(
								"onmousemove",
								"mkt.mkSelMoveBaixo(this);"
							);
							divMkSelBaixo.innerHTML = "↓ ↓ ↓";
							eList.appendChild(divMkSelBaixo);
						}
					}
				}
			} catch {
				mkt.erro(
					"Erro durante conversao para Json:" + e.getAttribute("data-selarray")
				);
			}
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelPesquisaFocus", {
	value: (e: any) => {
		// Atualiza Itens Selecionados, caso houve mudança sem atualizar.
		mkt.mkSelUpdate(e.parentElement.previousElementSibling);
		// Limpa o Display
		e.value = "";
		// Limpa o resultado do filtro anterior
		let eList = e.parentElement.nextElementSibling;
		let ePrimeiroSel: any = null;
		Array.from(eList.children).forEach((el: any) => {
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
		mkt.mkSelReposicionar(e.parentElement.nextElementSibling);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "getParentScrollTop", {
	value: (e: any) => {
		let eHtml = e;
		let soma = 0;
		while (eHtml.tagName != "HTML") {
			soma += eHtml.scrollTop;
			eHtml = eHtml.parentElement;
		}
		return soma;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelReposicionar", {
	value: (eList: any) => {
		// Redimenciona a lista do tamanho do campo pesquisar
		let ew = eList.previousElementSibling.offsetWidth;
		eList.style.minWidth = ew + "px";
		eList.style.maxWidth = ew + "px";
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelPesquisaBlur", {
	value: (e: any) => {
		mkt.mkSelUpdate(e.parentElement.previousElementSibling);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelPesquisaKeyDown", {
	value: (ev: any) => {
		let isNegado = false;
		//mkt.l(ev);
		if (ev.key == "Escape") {
			ev.srcElement.blur();
		}
		if (ev.key == "ArrowUp" || ev.key == "ArrowDown" || ev.key == "Enter") {
			isNegado = true;
			let eList = ev.srcElement.parentElement.nextElementSibling;
			let eListItem;
			let array: any = Array.from(eList.children).filter((e: any) => {
				return e.style.display != "none";
			});
			let eM = array.find((e: any) => e.getAttribute("data-m") == "1");
			Array.from(eList.children).forEach((e: any) =>
				e.removeAttribute("data-m")
			);
			if (ev.key == "Enter") {
				if (eM) mkt.mkSelSelecionar(eM);
				ev.srcElement.blur();
			}
			if (ev.key == "ArrowUp") {
				isNegado = true;
				let ultimo = array[array.length - 1];
				let peNultimo = array[array.length - 2];

				if (eM) {
					let indexProximo = array.indexOf(eM) - 1;
					if (
						array[indexProximo] &&
						!array[indexProximo].classList.contains("mkSelItemDeCima")
					) {
						eListItem = array[indexProximo];
					} else {
						if (ultimo?.classList.contains("mkSelItemDeBaixo")) {
							eListItem = peNultimo;
						} else {
							eListItem = ultimo;
						}
					}
				} else {
					if (ultimo?.classList.contains("mkSelItemDeBaixo")) {
						eListItem = peNultimo;
					} else {
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
					if (
						array[indexProximo] &&
						!array[indexProximo].classList.contains("mkSelItemDeBaixo")
					) {
						eListItem = array[indexProximo];
					} else {
						if (array[0]?.classList.contains("mkSelItemDeCima")) {
							eListItem = array[1];
						} else {
							eListItem = array[0];
						}
					}
				} else {
					if (array[0]?.classList.contains("mkSelItemDeCima")) {
						eListItem = array[1];
					} else {
						eListItem = array[0];
					}
				}
				eListItem?.setAttribute("data-m", "1");
				let alvoOffsetTop = eListItem?.offsetTop || 0;
				eList.scrollTop =
					alvoOffsetTop - 120 - (eList.clientHeight - eList.offsetHeight) / 2;
			}
		}
		if (isNegado) {
			ev.preventDefault();
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelPesquisaInput", {
	value: (e: any) => {
		let cVisivel = 0;
		let eList = e.parentElement.nextElementSibling;
		Array.from(eList.children).forEach((el: any) => {
			let exibe = false;
			if (el.classList.contains("mkSelItem")) {
				let strInputado = e.value.toLowerCase();
				let strFromKv = el.firstElementChild.innerHTML.toLowerCase();
				if (mkt.like(strInputado, strFromKv)) {
					exibe = true;
					cVisivel++;
				}
			}
			if (exibe) {
				el.style.display = "";
			} else {
				el.style.display = "none";
			}
		});
		if (cVisivel > 10) {
			eList.firstElementChild.style.display = "";
			eList.lastElementChild.style.display = "";
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelMoveu", {
	value: (e: any) => {
		if (e.firstElementChild.classList.contains("mkSelItemDeCima")) {
			e.firstElementChild.style.display = "";
			e.lastElementChild.style.display = "";
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelMoveCima", {
	value: (e: any) => {
		let eList = e.parentElement;
		eList.scrollTop = eList.scrollTop - 5;
		mkt.mkSelMoveu(eList);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelMoveBaixo", {
	value: (e: any) => {
		let eList = e.parentElement;
		eList.scrollTop = eList.scrollTop + 5;
		mkt.mkSelMoveu(eList);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelUpdate", {
	value: (e: any, KV: any[] | null = null) => {
		if (KV == null) {
			KV = mkt.mkSelGetKV(e);
		}
		// Desmarcar todos mkSelItem pra 0
		Array.from(e.nextElementSibling.nextElementSibling.children).forEach(
			(el) => {
				(el as HTMLElement).setAttribute("data-s", "0");
			}
		);
		KV?.forEach((o) => {
			/* Marcar mkSelItem pra 1 onde tem K selecionado */
			Array.from(e.nextElementSibling.nextElementSibling.children).forEach(
				(item: any) => {
					if (item.getAttribute("data-k") == o.k) {
						item.setAttribute("data-s", "1");
					}
				}
			);
		});
		// Seta Valor do display
		mkt.mkSelSetDisplay(e, KV);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelArraySetMap", {
	value: (e: any, map: any) => {
		if (e) {
			if (map instanceof Map) {
				let kv: any[] = [];
				for (let [k, v] of map) {
					kv.push({
						k: k,
						v: v,
					});
				}
				mkt.mkSelArraySetKV(e, kv);
			} else {
				mkt.w(
					"Função mkSelArraySetMap() precisa receber um objeto formato Map no segundo parametro"
				);
			}
			return e;
		} else {
			mkt.w(
				"Função mkSelArraySetMap() precisa receber o elemento no primeiro parametro"
			);
			return null;
		}
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelArraySetKV", {
	value: (e: any, kv: any[]) => {
		let kvj = mkt.stringify(kv);
		e.dataset.selarray = kvj;
		e.classList.add("atualizarSemEvento");
		return e;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelArrayGetMap", {
	value: (e: any): any => {
		let kvs = e.dataset.selarray;
		let map: any[] = [];
		if (mkt.isJson(kvs)) {
			let kv = mkt.parseJSON(kvs);
			kv.forEach((o: any) => {
				map.push([o.k, o.v]);
			});
		}
		return new Map(map);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelArrayGetKV", {
	value: (e: any): any[] => {
		let kv = e.dataset.selarray;
		if (mkt.isJson(kv)) {
			kv = mkt.parseJSON(kv);
		}
		return kv;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelGetMap", {
	value: (e: any) => {
		let kv = mkt.mkSelGetKV(e);
		let map: any[] = [];
		kv.forEach((o: any) => {
			map.push([o.k, o.v]);
		});
		return new Map(map);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelGetKV", {
	value: (e: any): any[] => {
		let kSels: any[];
		let kOpcoes: any;
		// Lista de Selecoes vira K do KV
		if (mkt.isJson(e.value)) {
			kSels = mkt.parseJSON(e.value);
			if (!Array.isArray(kSels)) {
				kSels = [{ k: kSels }];
			} else {
				kSels = [];
				mkt.parseJSON(e.value).forEach((kSel: any) => {
					kSels.push({ k: kSel });
				});
			}
		} else kSels = [{ k: e.value }];
		// Prepara lista de Opções para iterar
		if (mkt.isJson(e.dataset.selarray)) {
			kOpcoes = mkt.parseJSON(e.dataset.selarray);
			if (!Array.isArray(kOpcoes)) {
				kOpcoes = [{ k: kOpcoes, v: "\u{2209} Opções" }];
			}
		} else kOpcoes = null;
		if (kOpcoes != null) {
			// Acrescentar V ao KV
			kSels.forEach((objKv) => {
				kOpcoes.forEach((opcao: any) => {
					if (opcao.k == objKv.k) {
						objKv.v = opcao.v;
					}
				});
			});
		}
		return kSels;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "mkSelSetDisplay", {
	value: (e: any, KV: any) => {
		if (KV.length <= 0) {
			mkt.w("Não foi possível encontrar os itens selecionados.");
			e.nextElementSibling.firstElementChild.value = "Opções \u{2209}";
		} else {
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
				} else {
					e.dataset.selerror = "false";
					e.dataset.selerrorMsg = "";
				}
				e.nextElementSibling.firstElementChild.value = display;
			} else if (KV.length > 1) {
				e.nextElementSibling.firstElementChild.value =
					"[" + KV.length + "] Selecionados";
			}
		}
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   Erros do LocalStorage          \\
//___________________________________\\

Object.defineProperty(mkt, "errosLog", {
	value: () => {
		let mktArmazenado = localStorage.mktRequests;
		if (localStorage.mktRequests) mktArmazenado = JSON.parse(localStorage.mktRequests);
		return console.table(mktArmazenado);
	}, enumerable: false, writable: false, configurable: false,
});
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   IMPORTAR                       \\
//___________________________________\\

Object.defineProperty(mkt, "importar", {
	value: async (tagBuscar = ".divListagemContainer", tipo: any = "race", quiet: boolean = true) => {
		// IMPORTAR - Classe - Coleta o html externo
		return new Promise((r, x) => {
			let num = mkt.contaImportados++;
			if (!quiet) {
				mkt.gc("\t(" + num + ") Executando Importador no modo: ", tipo)
			}
			let ps: any = [];
			mkt.QAll(tagBuscar + " *").forEach((e: HTMLElement) => {
				let destino = e.getAttribute("mkImportar");
				if (destino != null) {
					ps.push({ p: mkt.get.html({ url: destino, quiet: quiet, carregador: false }), e: e, n: num });
				}
			});
			if (!quiet) {
				mkt.l(ps);
				mkt.ge();
			}
			(Promise as any)[tipo](ps.map((x: any) => { return x.p })).then((ret: any) => {
				ps.forEach(async (o: any) => {
					let re = await o.p;
					if (re.retorno != null) {
						o.e.removeAttribute("mkImportar");
						o.e.innerHTML = re.retorno;
						try {
							mkt.mkNodeToScript(o.e);
						} catch (error) {
							mkt.gc("Auto Import por TAG lancou erros:");
							mkt.erro("ERRO: ", error);
							mkt.ge();
						}
					} else {
						x(false);
						mkt.l("Falhou ao coletar dados");
					}
				});
				r(true);
			});
		});
	}, enumerable: false, writable: false, configurable: false,
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			AREA FASEADO (OLD)					\\
//___________________________________\\
Object.defineProperty(mkt, "fUIFaseUpdateLinkFase", {
	value: () => {
		// FUNCAO PARA ATUALIZAR OS LINKS DE FASES
		mkt.QAll("ul.mkUlFase li a").forEach((e: HTMLAnchorElement) => {
			e.parentElement?.classList.remove("mkFaseBack");
			e.parentElement?.classList.remove("mkFaseAtivo");
			e.parentElement?.classList.remove("disabled");
			let eNumPag = Number(e.getAttribute("data-pag"));
			let bLibera = e.getAttribute("data-libera");
			if (mkt.vars.mkFaseAtual > eNumPag) {
				e.parentElement?.classList.add("mkFaseBack");
			}
			if (mkt.vars.mkFaseAtual == eNumPag) {
				e.parentElement?.classList.add("mkFaseAtivo");
			}
			if (bLibera == "false") {
				e.parentElement?.classList.add("disabled");
			}
		});
	}, enumerable: false, writable: false, configurable: false,
});


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   UTEIS                          \\
//___________________________________\\
Object.defineProperty(mkt, "classof", {
	value: (o: any) => {
		let nomeClasse = Object.prototype.toString.call(o).slice(8, -1);
		// Exceção, apenas quando "Number" converter os NaN pra "NaN".
		if (nomeClasse == "Number") {
			if (o.toString() == "NaN") {
				nomeClasse = "NaN";
			}
		};
		return nomeClasse;
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "toString", {
	value: () => {
		return 'class mkt { /* classe gerenciadora de listagens */ }';
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "uuid", {
	value: () => {
		// Padrão UUIDV4 - Gerador de identificador unico
		return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) => { // c = String
			return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
		}
		);
	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "Inicializar", {
	value: () => {
		mkt.mkClicarNaAba(mkt.Q(".mkAbas a.active")); // Inicia no ativo
		mkt.exeTimer();

	}, enumerable: false, writable: false, configurable: false,
});

Object.defineProperty(mkt, "exeTimer", {
	value: () => {
		mkt.mkSelRenderizar();
		mkt.mkRecRenderizar();
		mkt.mkBotCheck();
		// Itera sobre todos os Poppers para atualizar na mesma frequencia deste intervalo.
		mkt.vars?.poppers?.forEach((o: any) => {
			if (!o.state.elements.popper.classList.contains("oculto")) {
				o.update();
			}
		});
		// Recursiva
		setTimeout(mkt.exeTimer, mkt.vars.exeTimer);
	}, enumerable: false, writable: false, configurable: false,
});

//Object.defineProperty(mkt , undefined ,{enumerable: false, writable: false, configurable: false});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   Auto Inicializar               \\
//___________________________________\\
mkt.Inicializar();
