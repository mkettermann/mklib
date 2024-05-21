//
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//  MK - MASTER KEY LIBRARY         \\
//      By Marcos Kettermann         \\
//___________Desde 2023_______________\\
//
// Variável de teste:
var mkz = null;
declare const Popper: any; // Esta biblioteca requer Popper

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//  FUNCOES EXTERNAS                \\
//___________________________________\\
(String.prototype as any).removeRaw = function (fix = false) {
	// Função que tira os elementos de quebra de linha e tabela da string.
	let r = this.replaceAll("\n", "")
		.replaceAll("\r", "")
		.replaceAll("\t", "")
		.replaceAll("\b", "")
		.replaceAll("\f", "")
	if (fix.toString() == "2") {
		r = r.replaceAll("&quot;", '"')
			.replaceAll("&#39;", "'")
			.replaceAll("&amp;", "&")
		r = r.replaceAll("\\", "/");
	}
	//
	// \u00E3 == ã, viraria /u00E3
	return r;
};
(String.prototype as any).toEntities = function () {
	// Transforma todas os caracteres especiais em entidades HTML.
	// "'".toEntities() == '&#39;'
	return this.replace(/./gm, function (s: string) {
		return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
	});
};
(String.prototype as any).fromEntities = function () {
	// Transforma todas entidades HTML numeradas em caracteres especiáis.
	// '&#39;'.fromEntities() == "'"
	return (this + "").replace(/&#\d+;/gm, function (s: any) {
		return String.fromCharCode(s.match(/\d+/gm)[0]);
	})
};

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//  MODELO DOS DADOS DA LISTA       \\
//___________________________________\\
// CLASSE Do Design das colunas para formar a listagem da classe mktm.
class mktm {
	// Classe Modelo: Serve para assossiar uma regra / tipo / padronização a um campo
	pk: boolean = false; // Este campo é Primary Key?
	k: string | null = null; // Key / Chave (Propriedade do objeto)
	v: any = null;	// Valor (Inicialmente nulo, mas ao recuperar o objeto da lista ele vem preenchido)
	l: string | null = null; // Label (Texto que descreve o campo)
	r: RegExp | null = null; // Regex para validar o campo
	tag: string | null = "input"; // Qual é a tag do campo caso ele precise preencher?
	atr: string | null = "type='text'" // Todos os atributos padrões deste campo.
	classes: string = "iConsultas" // Classes padrões / iniciais deste campo
	lclasses: string = "" // Classes para o label do campo
	target: string = "value" // Propriedade para edição (value, innerHTML).
	f: boolean = true; // Ativa ou desativa o filtro nesse campo (HeadMenu ok)
	opcoes: string = ""; // Aloja as opcoes em JSON de um seletor.
	filtroFormato: string = "string"; // Usado para preencher o valor de data-mkfformato
	filtroOperador: string = ""; // Usado para preencher o valor de data-mkfoperador
	field: string = ""; // Representa o elemento HTML inteiro.
	requer: boolean = false; // Permite saber qualquer vai ativar o Regrar
	regras: any = []; // Aloja os objetos da regra a serem usados neste campo
	url: string = ""; // Aloja a URL. Usada pra download de um refill.
	on: boolean = true; // Aloja se ele deve ser inicialmente disabled
	crud: boolean = true; // Aloja a configuração se deve ou não ser usado esse campo para crud
	constructor(o: any) {
		if (o.k) this.k = o.k;
		if (o.pk) this.pk = o.pk;
		if (o.l) this.l = o.l;
		if (o.r) this.r = o.r;
		if (o.v) this.v = o.v;
		if (o.tag) this.tag = o.tag;
		if (o.atr) this.atr = o.atr;
		if (o.opcoes) this.opcoes = o.opcoes;
		if (o.filtroFormato) this.filtroFormato = o.filtroFormato;
		if (o.filtroOperador) this.filtroOperador = o.filtroOperador;
		if (o.classes) this.classes = o.classes;
		if (o.lclasses) this.lclasses = o.lclasses;
		if (o.target) this.target = o.target;
		if (o.regras) this.regras = o.regras;
		if (o.url) this.url = o.url;
		if (o.on != null) this.on = o.on;
		if (o.crud != null) this.crud = o.crud;
		if (o.f == false) this.f = false;
		if (o.requer == true) this.requer = true;
		// Limpar nulos
		if (!this.k) this.k = "";
		if (!this.v) this.v = "";
		if (!this.l) this.l = "";
		if (o.field) {
			// Quando o campo já vem com o formato no modelo
			this.field = o.field;
		} else {
			// Quando não vem, monta sozinho.
			let varfOperador = ""; // Operador é necessário quando o filtro é Data.
			if (this.filtroOperador != "") varfOperador = ` data-mkfoperador="${this.filtroOperador}"`;
			let varUrl = ""; // Operador é necessário quando o filtro é Data.
			if (this.url != "") varUrl = ` data-url="${this.url}"`;
			let opcoes = ""; // Opções é utilizado em mk-sel.
			if (this.opcoes != "") opcoes = ` opcoes='${this.opcoes}'`;
			let disabled = "";
			if (this.on == false) disabled = " disabled";
			this.field = `<${this.tag} name="${this.k}" value="${this.v}" class="${this.classes}${disabled}"${disabled} data-mkfformato="${this.filtroFormato}"${varfOperador}${varUrl}${opcoes} ${this.atr}>`;
			if (this.tag != "input") {
				this.field += `</${this.tag}>`;
			}
		}

	}
	toObject: Function = () => {
		let o: any = {};
		["pk", "k", "v", "l", "r", "on", "crud", "tag", "atr", "classes", "lclasses", "target", "f", "opcoes", "field", "requer", "regras", "url"].forEach(k => {
			o[k] = this[k as keyof mktm];
		});
		return o;
	}
	get [Symbol.toStringTag]() { return "mktm"; }
}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//  PRÉ CONFIGURAÇÃO DA LISTAGEM    \\
//___________________________________\\
class mktc {
	// CLASSE que de configuração para que a listagem seja iniciada de forma personalizada.
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
	filtroDinamico: boolean | null = null; // Nessa listagem o filtro por tecla não é dinâmico por padrão.
	headSort: boolean = true; // Indicador se ativará o ordenamento ao clicar no cabeçalho
	headMenu: boolean = true; // Indicador se ativará o botãozinho que abre o filtro completo do campo.
	exibeBotaoMais: boolean = true; // Indicador se ativará o botãozinho que abre o filtro completo do campo.
	// Os demais podem se alterar durante as operações da listagem.
	sortBy: string | null = null; // Campo a ser ordenado inicialmente;
	sortDir: Number | null = 1; // 0,1,2 = Crescente, Decrescente, Toogle;
	objFiltro: any = {}; // Itens Filtrados
	urlOrigem: string | null = ""; // URL de origem dos dados a serem populados
	pagAtual: number = 1; // Representa a pagina
	pk: string | null = null; // Primary Key: Possivel setar o nome do campo que é único já na construcao
	totalFull = 0;
	totalFiltrado = 0;
	totalExibidos = 0;
	pagPorPagina = 5; // VAR = Total de linhas exibidas por página.
	pagItensIni = 0;
	pagItensFim = 0;
	totPags = 0;
	ativarDbCliente = false; // Quando ativo, salva o dado consultado por um worker em um indexedDb formando um cache rápido de dados no cliente.
	versaoDb = 1;
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
	aoReceberNovaConsulta = async (dadosFull: any, este: mkt) => { }; // Recebe os dados de dadosFull (Quando #btnConsultar mudou parametro)
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

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//  CLASSE MKT ESTÁTICA e LISTAGEM  \\
//___________________________________\\
class mkt {
	// Classe contendo uma grande ferramenta de gerenciamento de dados em massa é construida e diveras funções estáticas facilitadoras.
	c: mktc;
	started: boolean = false;
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

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//  CONSTRUTOR DA GRANDE LISTAGEM   \\
	//___________________________________\\
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
		// Busca uma Primary Key
		if (this.c.model?.length > 0) {
			this.c.model?.forEach(o => {
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
		// Guarda a instância para facilitar o acesso aos métodos.
		mkt.a.build.push(this);
	}

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//  INICIO DOS MÉTODOS MKT          \\
	//___________________________________\\
	autoStartConfig = async (arg: any = {}) => {
		// Apos instanciar a classe mkt, essa função tenta iniciar a listagem baseado nas regras.
		if (!this.started) { // <= Previne que Reset duplique os Listners
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
					//mkt.l("TablePorPagina: ", this.c.tablePorPagina);
					this.atualizaNaPaginaUm();
				});
			}

			// Ativar THEAD funcionalidades
			this.headAtivar();

			//Adiciona eventos aos botões do filtro
			if (this.c.filtro) this.setFiltroListener();
		}

		// A partir daqui o New e o Reset seguem iguais

		// Check e config da quantidade de download
		if (mkt.classof(this.c.qntSolicitada) != "Number") {
			this.c.qntSolicitada = 10000;
		} else if (this.c.qntSolicitada < 0) {
			this.c.qntSolicitada = 10000;
		}
		if (mkt.classof(this.c.qntInicial) != "Number") {
			this.c.qntInicial = this.c.qntSolicitada;
		} else if (this.c.qntInicial <= 0) {
			this.c.qntInicial = 0;
		}

		// Inicial SortBy
		if (!this.c.sortBy)
			this.c.sortBy = this.c.pk; // Padrão PK
		// Inicial SortDir
		if (!this.c.sortDir)
			this.c.sortDir = 1; // Padrão 0 Decrescente por ID Deixando a Ultima ID no topo

		// Inicial Sort
		this.setDirSort(this.c.sortBy, Number(this.c.sortDir));

		if (this.c.dados != null) {
			if (mkt.classof(this.c.dados) == "Array") {
				if (this.c.qntInicial > 0) { // Se solicitar 0 ou menos, não realiza append no autoConfig
					if (await this.appendList(this.c.dados) != null) {
						this.started = true;
						this.startListagem();
					}
				} else {
					this.started = true;
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
				if (this.c.qntInicial > 0) { // Se solicitar 0 ou menos, não realiza append no autoConfig
					if (await this.appendList(this.c.url) != null) {
						if (!this.started) {
							this.started = true;
							this.startListagem();
						} else {
							this.atualizarListagem();
						}
					}
				} else {
					this.started = true;
					this.startListagem();
				}
			}
		} else {
			// Quando não tiver url, ocultar botão de puxar mais
			this.aindaTemMais = false;
		}

		if (this.c.dados == null && this.c.url == null) {
			mkt.w("Nenhuma fonte de dados encontrada. Não será possível popular a listagem sem dados.")
		}
		if (!this.started) {
			// Se chegar aqui sem iniciar, avança zerado.
			mkt.erro("A lista foi iniciada sem confirmação dos dados. Provavelmente ocorreu erro na coleta de dados.")
			this.startListagem();
		}
	}

	reset = async () => {
		// Limpa as variaveis da instancia e solicita novamente o recomeço da listagem
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
		this.c.objFiltro = {}; // Limpa Filtro sem limpar os campos
		await this.autoStartConfig();
		//this.startListagem()
	}

	mais = async (parametros: string | null = null, novaurl: string | null = null) => {
		// Aqui representa a solicitação do novo
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
		// Manipula URL e dados. Executa um acrescimo nos dados se o parametro for o mesmo
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
				// Incrementa o lh e lr após o "?", se tiver
				let urlTemp: string = "";
				if (data_url.includes("?")) { // Caso a url já contenha Query, não sobreescrever
					urlTemp = (data_url as string) + "&lr=" + solicitar + "&lh=" + this.cTotUltimoParametro;
				} else { // Caso não tenha, acrescenta o Query
					urlTemp = (data_url as string)?.split("?")[0] + "?lr=" + solicitar + "&lh=" + this.cTotUltimoParametro;
				}
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
						// Similar ao aoPossuirDados. Evento aoReceberNovaConsulta
						if (this.totalappends == 1) {
							//EVENT: aoReceberNovaConsulta
							mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoReceberNovaConsulta"));
							this.c.aoReceberNovaConsulta(this.dadosFull, this);
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
						document.dispatchEvent(new Event("getListFalhou"));
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

	startListagem = async (arg: any = {}) => {
		// Inicia a listagem com os dados atuais.
		//EVENT: aoIniciarListagem
		mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoIniciarListagem"));
		this.c.aoIniciarListagem(this);

		// Limpar Dados nulos
		mkt.limparOA(this.dadosFull);

		//EVENT: aoPossuirDados
		mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoPossuirDados"));
		await this.c.aoPossuirDados(this.dadosFull, this);

		// Ordena a lista geral com base na primeira propriedade.
		mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);

		// Executa um filtro inicial e na sequencia processa a exibição.
		if (this.c.filtro) { // Coleta se houver uma tag de filtro
			if (this.c.filtroDinamico) { // Não refiltrar caso for por consulta
				this._RecoletarFiltros();
			}
		}
		this.efeitoSort();
		// Remove oculto, caso encontre a tag
		if (mkt.Q(this.c.tableResultado)) {
			mkt.Q(this.c.tableResultado).classList.remove("oculto");
		}

		this.atualizaNaPaginaUm();
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

	dbCon = async (): Promise<IDBDatabase | null> => {
		// Gera uma instancia de conexão ao banco de dados Client-Side indexavel
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
		// Atualiza Status, Filtra, Botão Mais...
		// A cada atualizar listagem, atualiza o filtro por garantia.
		if (this.c.filtroDinamico) { // Não refiltrar caso for por consulta
			this._RecoletarFiltros();
		}
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
							mklEFim.innerHTML = mkt.a.msg.carregarmais;
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
			await mkt.moldeOA(this.dadosExibidos, this.c.idmodelo, this.c.tbody);

			//EVENT: aoConcluirExibicao
			mkt.Q(this.c.container).dispatchEvent(new CustomEvent("aoConcluirExibicao"));
			await this.c.aoConcluirExibicao(this);
		}
	};

	atualizarStatusListagem = () => {
		// Atualiza o objeto que contem os dados desta instancia.
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

	atualizaNaPaginaUm = async () => {
		// Retorna a pagina 1 e atualiza
		// Procedimento padrão ao modificar um filtro / modificar o conteúdo.
		this.c.pagAtual = 1;
		this.atualizarListagem();
	};

	mudaPag = (e: any) => {
		// Gatilhos para trocar a pagina (Parte de baixo da lista 1,2,3,4,5,6)
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

	processoPaginar = () => {
		// Exibe Diferenciado dependendo em que página está (Antrerior,1,2,3,Proximo)
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

	_RecoletarFiltros = () => {
		// Limpa e Recoleta o filtro baseado no filtro contruído.
		// Limpa filtro atual
		this.c.objFiltro = {};
		// Gera filtro os nos campos
		mkt.QAll(this.c.filtro).forEach((e: HTMLElement) => {
			this.updateFiltroElemento(e);
		});
	}

	updateFiltro = () => {
		// Limpa, Gera Filtro e Atualiza. Padrao class ".iConsultas".
		this._RecoletarFiltros();
		this.atualizaNaPaginaUm();
	};

	updateFiltroElemento = (e: any) => {
		// Gerar Filtro baseado nos atributos do MKF gerados no campo.
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
		// A cada filtro disponível, gera um valor parametro na consulta Query
		return mkt.QAll(this.c.filtro)
			.map((i: HTMLInputElement) => {
				// Apenas parametros com conteúdo
				if (i.value != "") return "&" + i.name + "=" + encodeURIComponent(i.value);
			})
			.join("");
	}

	setFiltroListener = () => {
		// Gerar Gatilhos de FILTRO
		// Onclick do botao
		if (this.c.botaoNovaConsulta != null) {
			mkt.Ao("click", this.c.botaoNovaConsulta, (e: HTMLElement) => {
				mkt.l("NOVA consulta ()");
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
			// Conecta Filtro se o filtro for dinamico
			if (this.c.filtroDinamico) {
				this.updateFiltroElemento(e);
				this.atualizaNaPaginaUm();
			}
		});
	};

	headSeeMenuAbrir = (colName: string, e: HTMLTableCellElement) => {
		// Cria o botão que abre o menuzinho do Filtro
		e.classList.add("relative");
		if (!e.querySelector(".mkhmHeadIco")) {
			let mkhmIco = document.createElement("div");
			mkhmIco.className = "mkhmHeadIco";
			mkhmIco.innerHTML = mkt.a.SVGINI + mkt.a.svgFiltro + mkt.a.SVGFIM;
			mkt.Ao("click", mkhmIco, () => {
				this.headMenuAbrir(colName);
			})
			e.appendChild(mkhmIco);
		}
	}

	headMenuAbrir = async (colName: string) => {
		// HEAD MENU (O mesmo por documento)
		// Função que cria, exibe e seta as funções para filtrar baseado na coluna.
		let eHead = mkt.Q(this.c.container + " .sort-" + colName);
		let eHm = mkt.Q("body .mkHeadMenu");
		// CRIA A ESTRUTURA
		if (eHm == null) {
			let ehm = document.createElement("div");
			ehm.className = "mkHeadMenu oculto";
			ehm.innerHTML = `
			<div class='hmin fimsecao'>
				<div class='i htit'>
					<div class='col10 microPos5 botao hmPrevious'>${mkt.a.SVGINI}${mkt.a.svgLeft}${mkt.a.SVGFIM}</div>
					<div class='col70 hmTitulo'>
						Filtro
					</div>
					<div class='col10 microPos5 botao hmNext'>${mkt.a.SVGINI}${mkt.a.svgRight}${mkt.a.SVGFIM}</div>
					<div class='col10 fechar botao nosel hmHide'>
					${mkt.a.SVGINI}${mkt.a.svgFecha}${mkt.a.SVGFIM}
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
			// GATILHOS Só no ato a construção do elemento
			mkt.Ao("click", ".mkHeadMenu .hmPrevious", (e: HTMLDivElement) => {
				let eHmenu = mkt.Q("body .mkHeadMenu");
				mkt.hm.Previous(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
			})
			mkt.Ao("click", ".mkHeadMenu .hmNext", (e: HTMLDivElement) => {
				let eHmenu = mkt.Q("body .mkHeadMenu");
				mkt.hm.Next(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
			})
			mkt.Ao("click", ".mkHeadMenu .hmHide", (e: HTMLDivElement) => {
				mkt.Q("body .mkHeadMenu")?.classList.add("oculto");
			})
			mkt.Ao("click", ".mkHeadMenu .hmCrescente", (e: HTMLLIElement) => {
				let eHmenu = mkt.Q("body .mkHeadMenu");
				mkt.hm.Crescente(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
			})
			mkt.Ao("click", ".mkHeadMenu .hmDecrescente", (e: HTMLLIElement) => {
				let eHmenu = mkt.Q("body .mkHeadMenu");
				mkt.hm.Decrescente(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
			})
			mkt.Ao("click", ".mkHeadMenu .hmLimpar", (e: HTMLLIElement) => {
				let eHmenu = mkt.Q("body .mkHeadMenu");
				mkt.hm.Limpar(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
			})
			mkt.Ao("click", ".mkHeadMenu .hmLimparTodos", (e: HTMLLIElement) => {
				let eHmenu = mkt.Q("body .mkHeadMenu");
				mkt.hm.LimparTodos(eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
			})
			mkt.Ao("input", ".mkHeadMenu .hmFiltraExclusivo", (e: HTMLInputElement) => {
				mkt.hm.FiltraExclusivo(e.value, e.closest(".mkHeadMenu")?.getAttribute("data-mkt"));
			})
			mkt.Ao("input", ".mkHeadMenu .hmContemInput", (e: HTMLInputElement) => {
				let eHmenu = mkt.Q("body .mkHeadMenu");
				mkt.hm.ContemInput(e.value, eHmenu?.getAttribute("data-colname"), e.closest(".mkHeadMenu")?.getAttribute("data-mkt"));
			})
		}
		// Reexecuta o query pois agora já criou.
		eHm = mkt.Q("body .mkHeadMenu");
		// Conecta Elemento a Lista
		let thisList = this.getIndexOf().toString();
		eHm.setAttribute("data-colname", colName);
		eHm.setAttribute("data-mkt", thisList);

		// Zera ou popula Filtro atual do Contem
		if (this.c.objFiltro[colName]?.formato == "string") {
			mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = this.c.objFiltro[colName]?.conteudo;
		} else {
			mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
		}
		// Limpar pesquisa do Exclusivo
		mkt.Q(".mkHeadMenu input[name='filtrarPossibilidades']").value = "";
		if (this.c.objFiltro[colName]?.formato == "mkHeadMenuSel") {
			this.hmunsel = this.c.objFiltro[colName].conteudo;
		} else {
			this.hmunsel = [];
		}
		// Atualiza Lista de exclusivos
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
		// Popula .possibilidades usando a Lista de exclusivos
		mkt.hm.FiltraExclusivo("", thisList);

		mkt.atribuir(mkt.Q("body"), () => { mkt.hm.Hide(event) }, "onclick");
		let colNameLabel = colName;
		let esteLabel = this.getModel()?.filter((f) => { return f.k == colName })?.[0]?.l;
		if (esteLabel) {
			colNameLabel = esteLabel;
		}
		if (colNameLabel == colName) {
			if (eHead) {
				// Tenta utilizar o campo do Head.
				colNameLabel = eHead?.innerHTML;
			} else {
				// Mas se não encontrar, deixa o próprio.
				colNameLabel = colName;
			}
		}
		mkt.QAll("body .mkHeadMenu .hmTitulo").forEach((e: HTMLElement) => {
			e.innerHTML = colNameLabel;
		});
		// Finalmente inicializa, Exibe e seta o foco.
		eHm.classList.remove("oculto");
		mkt.Q(".mkHeadMenu input[name='filtrarCampo']").focus();
	}

	headAtivar = () => {
		// Gera Listeners na THEAD da tabela (Requer classe: "sort-campo")
		let eTrHeadPai = mkt.Q(this.c.container + " thead tr");
		// Coleta as labels
		let opcoes = this.getModel().map(o => { if (o.f == false) { return o.k; } }).filter(r => { return r != null });
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
					//mkt.l("HM?", this.c.headMenu, "Col:", colName, "Model:", opcoes);
					if (colName != "") {
						if (this.c.headSort == true) {
							mkt.Ao("click", th, (e: HTMLTableCellElement) => {
								this.orderBy(colName);
							});
						}
						if (this.c.headMenu == true) { // Se Ativo
							// Ignora caso a coluna estiver impedida de filtrar. mktm({f:false})
							if (!opcoes?.includes(colName)) {
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


	setDirSort = (propriedade: string | null, direcao: number = 2) => {
		// Ordena os dados baseados na direção
		// Direção 0: Crescente
		// Direção 1: Decrescente
		// Direção 2: Toogle
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

	orderBy = (propriedade: string | null, direcao: number = 2) => {
		// Seta, Ordena e Atualiza uma nova Ordem (Direcao: 0(Cre),1(Dec),2(toogle))
		// Atualiza atual Sort
		this.setDirSort(propriedade, Number(direcao));
		// Executa Ordenador da lista principal
		this.dadosFull = mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
		// Atualiza classes indicadoras de ordem
		this.efeitoSort();
		this.atualizarListagem();
	};

	efeitoSort = () => {
		// Gera o Efeito de flexinha no cabeçalho da tabela.
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

	clearFiltro = (campoEspecifico: string | null = null) => {
		// Limpa o Filtro específico ou tudo.
		if (campoEspecifico) {
			// LIMPAR APENAS ESTE
			if (this.c.objFiltro[campoEspecifico]) {
				delete this.c.objFiltro[campoEspecifico];
			}
			mkt.QAll(this.c.filtro + "[name='" + campoEspecifico + "']").forEach((e: HTMLInputElement) => {
				e.value = "";
			});
		} else {
			// LIMPAR TUDO
			this.c.objFiltro = {};
			// RESET Form (Limpar seria "0" / "") (Set e.defaultValue)
			mkt.QAll(this.c.filtro).forEach((e: HTMLInputElement) => {
				e.value = "";
			});
		}
	};

	clearFiltroUpdate = () => {
		// LIMPAR FILTRO E ATUALIZA
		this.clearFiltro();
		this.atualizarListagem();
	};

	getObj = (valorKey: any): object | null => {
		// Retorna o último objeto da lista onde a chave primaria bateu.
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

	getObjs = (k: string, v: any): object[] => {
		// Retorna uma lista de todos objetos encontrados onde o KV bateu.
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
		// Troca o conteúdo do objeto todo
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

	getModel = () => {
		// Retorna os modelos setados
		return this.c.model; // <= Classe mktm
	};

	getUsedKeys = (formatoKV = false) => {
		// Retorna todas as chaves utilizadas em todos os registros.
		// Cria um Set retorna um array de Keys Usadas
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
		// Através da chave primaria setada, retorna 1 acima do maior.
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
		// Retorna todas as TR atuais sendo visualizadas.
		return Array.from(mkt.QAll(this.c.container + " tbody tr"));
	};

	// USER INTERFACE - UI FOR CRUD
	add = (objDados: object, ordenar = true) => {
		// Adicionar na listagem
		objDados = this.c.aoReceberDados(objDados, this);
		this.dadosFull.push(objDados);
		if (ordenar) mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
		this.atualizarListagem();
	};

	edit = (objDados: object, k: string, v: any, ordenar = true) => {
		// Editar na listagem
		objDados = this.c.aoReceberDados(objDados, this);
		this.dadosFull = mkt.setObjetoFromId(k, v, objDados, this.dadosFull);
		if (ordenar) mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
		this.atualizarListagem();
	};

	del = (k: any, v: any) => {
		// Remover da listagem
		this.dadosFull = mkt.delObjetoFromId(k, v, this.dadosFull);
		mkt.ordenar(this.dadosFull, this.c.sortBy, this.c.sortDir);
		this.atualizarListagem();
	};

	// mkt.aoReceberDados e mkt.ordenar Não se executam pra acelerar a inserção assincrona da listagem
	addMany = (arrayDados: object[]) => {
		// Acrescenta uma lista no fim da lista previamente acrescentada
		this.dadosFull.push(...arrayDados);
		this.atualizarListagem();
	};

	find = (k: string, v: any) => {
		// Procura um objeto inserido na listagem
		return this.dadosFull.find((o: any) => o[k] == v);
	};

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//  DEFINIÇÕES DA CLASSE MKT        \\
	//___________________________________\\

	getIndexOf = () => {
		// Retorna a Posição deste Build (new mkt) no container local
		return mkt.a.build.indexOf(this);
	}

	static getThis = (build: number) => {
		// Retorna a instância da posicao
		return mkt.a.build[build];
	}

	toJSON = () => {
		// Return Json
		return this.dadosFull;
	};

	toString = () => {
		// Return String Instancia
		return mkt.stringify(this.dadosFull);
	};

	static toString = () => {
		// Return String Classe
		return 'class mkt { /* classe gerenciadora de listagens */ }';
	};

	valueOf = () => {
		// Return Number
		return this.dadosFull;
	};

	get [Symbol.toStringTag]() {
		// Get Name
		return "mkt";
	}

	[Symbol.iterator]() {
		// Iterator
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

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//  FIM DOS MÉTODOS MKT             \\
	//___________________________________\\

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//  INÍCIO FUNCÕES ESTÁTICAS        \\
	//___________________________________\\


	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//                     ARMAZENADORES ESTÁTICOS                             \\
	//==========================================================================\\

	// mkt.a. - XXX UTIL
	static a: any = {
		// Configurações, Armazenadores, Constantes, Funcões uteis...
		ALL: "*/*", // ContentType Blob
		FORMDATA: "multipart/form-data", // ContentType FORM
		GET: "GET", // Api Method GET
		HTML: "text/html", // ContentType HTML
		JSON: "application/json", // ContentType JSON
		POST: "POST", // Api Method POST
		SVGINI: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>",
		SVGFIM: "</svg>",
		AoConfig: {
			capture: false,
			once: false,
			passive: true,
		},
		build: [] as Array<mkt>,
		clacre: "Classificar Crescente",
		cladec: "Classificar Decrescente",
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
		log: true, // Desliga / Liga Log do console
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
		msg: { // Mensagens padroes
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
		mkFaseAtual: 1, // DEPRECATED - Faseador antigo (Usando em G5_Fichas)
		poppers: new Map(),
		queue: new Map(),
		svgAB: "<path fill-rule='evenodd' d='M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z'/><path d='M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z'/>",
		svgBA: "<path fill-rule='evenodd' d='M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z'/><path d='M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z'/>",
		svgFecha: "<path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'/>",
		svgFiltro: "<path d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z'/>",
		svgLeft: "<path fill-rule='evenodd' d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0'/>",
		svgRight: "<path fill-rule='evenodd' d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708'/>",
		svgSquare: "<path d='M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z'/>",
		timers: [] as any, // Array para guardar timers em andamento ou finalizados
		util: {
			cpf: ["000.000.000-00", "^([0-9]{3}([\.]?[0-9]{3}){2}[-]?[0-9]{2})$", (cpf: any) => {
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
			cep: ["00.000-000", "^([0-9]{2}[\.]?[0-9]{3}[-]?[0-9]{3})$", (cep: any) => {
				if (!cep) { return false; }
				cep = mkt.apenasNumeros(cep);
				if (cep.length != 8) { return false; }
				return true;
			}],
			cnpj: [
				"00.000.000/0000-00",
				"^([0-9]{2}([\.]?[0-9]{3}){2}[\/]?[0-9]{4}[-]?[0-9]{2})$", (cnpj: any) => {
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
				(str: string) => {
					if (mkt.apenasNumeros(str).length <= 11) {
						return "000.000.000-00"
					} else {
						return "00.000.000/0000-00"
					};
				},
				"^([0-9]{2}([\.]?[0-9]{3}){2}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}([\.]?[0-9]{3}){2}[-]?[0-9]{2})$", (cpf_cnpj: any) => {
					return mkt.a.util.cpf[2](cpf_cnpj) || mkt.a.util.cnpj[2](cpf_cnpj);
				}
			],
			cnh: ["00000000000", "^([0-9]{11})$", (cnh: any) => {
				if (!cnh) { return false; }
				cnh = mkt.apenasNumeros(cnh);
				if (cnh.length != 11) { return false; }
				return true;
			}],
			rg: ["00.000.000-0", "^[0-9]{2}([\.]?[0-9]{3}){2})[-]?[0-9]$", (rg: string) => {
				// Remove todos os caracteres que não são números
				rg = rg.replace(/[^0-9]/g, '');
				// Verifica se o RG tem 9 dígitos
				if (rg.length !== 9) return false;
				// Calcula o dígito verificador
				let soma = 0;
				const pesos = [2, 3, 4, 5, 6, 7, 8, 9, 100]; // Pesos aplicados aos 8 primeiros dígitos do RG
				for (let i = 0; i < 8; i++) {
					soma += parseInt(rg[i]) * pesos[i];
				}
				let resto = soma % 11;
				let dig = resto === 0 ? 0 : 11 - resto;
				if (dig === 10) dig = 0; // Ajuste para o caso de resto 10
				// Verifica se o dígito verificador está correto
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
		} as any, // Util: Mascarar, Regex, Funcao Validadora
		wpool: null as any | null, // WorkerPool quando iniciado
	};

	// ============================ ATALHOS PERSONALIZADOS ============================ \\
	// ================================================================================= \\

	static Q = (query: any) => {
		// Permite buscar por um elemento em string ou ele mesmo. Formando uma bufurcação ao elemento quando buscar por ele mais de uma vez.
		if (mkt.classof(query) == "String") return document.querySelector(query);
		return query;
	};

	static QAll = (query: any = "body"): any[] => {
		// Sempre retorna uma array de encontrados. Inclusive uma array com um mkt.Q
		if (mkt.classof(query) == "String") {
			// Se buscando uma string, retorna a array do select encontrado
			return Array.from(document.querySelectorAll(query));
		} else if (mkt.classof(query).endsWith("Element")) {
			// Quando buscar um elemento, retorna a array do elemento
			return [query];
		} else if (mkt.classof(query) == "Array") {
			// Quando buscar uma array, retorna a propria array.
			return query;
		} else {
			mkt.w("QAll() - Requer String / Elemento. ClassOf: ", mkt.classof(query), " Query: ", query);
			return [];
		}
	};

	static QverOff = (query: HTMLElement | string | null = "body"): any[] => {
		// Adiciona Classe Oculto em todos os elementos do Query
		// Retorna uma array de elementos por causa do QAll
		return mkt.aCadaElemento(query, (e: any) => {
			e?.classList.add("oculto");
		});
	};

	static QverOn = (query: HTMLElement | string | null = "body") => {
		// Remove classe Oculto em todos os elementos do Query
		// Retorna uma array de elementos por causa do QAll
		return mkt.aCadaElemento(query, (e: any) => {
			e?.classList.remove("oculto");
		});
	};

	static Qoff = (query: any = "body") => {
		// Desabilita o campo e Remove acesso ao Tab nesses campos do Query
		// Retorna uma array de elementos por causa do QAll
		return mkt.aCadaElemento(query, (e: any) => {
			e.setAttribute("disabled", "");
			e.classList.add("disabled");
			e.setAttribute("tabindex", "-1");
		});
	};

	static Qon = (query: any = "body") => {
		// Habilita o campo e Libera acesso ao Tab nesses campos do Query
		// Retorna uma array de elementos por causa do QAll
		return mkt.aCadaElemento(query, (e: any) => {
			e.removeAttribute("disabled");
			e.classList.remove("disabled");
			e.removeAttribute("tabindex");
		});
	};

	static Ao = (tipoEvento: string = "click", query: any, executar: any, autoExecutar: boolean = false, config: Object | undefined = mkt.a.AoConfig) => {
		// Adiciona LISTNER em todos elementos do query usando uma config preventiva.
		// Em QAll, pois o Filtro pega todos os .iConsultas
		mkt.QAll(query).forEach((e: HTMLElement) => {
			e.addEventListener(tipoEvento, (ev: Event) => {
				if (ev) ev.stopPropagation(); // Não se reexecuta quando o botão está dentro do outro. (HM inside Sort por exemplo)
				executar(e, ev);
			}, config);
			if (autoExecutar === true) {
				executar(e, null); // Pode ser solicitado já executar um Ao assim que criado. Mas não tem evento.
			}
		});
	};

	static atribuir = (e: any, gatilho: any, atributo: string = "oninput") => {
		// Incrementa no ATRIBUTO do elemento E o texto do GATILHO.
		if (e) {
			if (atributo) {
				let tipo = mkt.classof(gatilho);
				if (tipo == "Function") {
					e[atributo] = gatilho;
				} else if (tipo == "String") {
					let attr = e?.getAttribute(atributo);
					if (attr) {
						if (!attr.includes(gatilho)) {
							e?.setAttribute(atributo, attr + ";" + gatilho);
						}
					} else {
						e?.setAttribute(atributo, gatilho);
					}
				} else {
					mkt.w("mkt.atribuir() - Formato não implementado: ", tipo);
				}
			} else { mkt.w("mkt.atribuir() - Precisa de um gatilho: ", gatilho) }
		} else { mkt.w("mkt.atribuir() - Precisa de um elemento: ", e) }
	};

	static html = (query: any, conteudo: string) => {
		// Atalho para innerHTML que retorna apenas o primeiro elemento da query.
		let e = mkt.Q(query);
		if (e) {
			e.innerHTML = conteudo;
		}
		return e;
	};

	static wait = (ms: number) => {
		// Essa mecânica usa um setTimeout. A mecânica do Queue não foi implementada
		return new Promise(r => setTimeout(r, ms))
	};

	static QSetAll = (
		query: string = "input[name='#PROP#']",
		dados: object | null = null,
		comEvento: boolean | null = true
	) => {
		// Seta todos os query com os valores das propriedades informadas nos campos.
		// O nome da propriedade precisa ser compatível com o PROPNAME do query.
		let eAfetados: any = [];
		if (mkt.classof(dados) == "Object") { // Apenas Objeto
			for (let p in dados) {
				let eDynamicQuery = mkt.Q(query.replaceAll("#PROP#", p));
				if (eDynamicQuery) {
					if (mkt.getV(p, dados) != null) {
						eDynamicQuery.value = mkt.getV(p, dados);
						if (comEvento) {
							eDynamicQuery.classList.add("atualizar");
						} else {
							eDynamicQuery.classList.add("atualizarSemEvento");
						}
						eAfetados.push(eDynamicQuery);
					}
				}
			}
		} else if (mkt.classof(dados) == "String") {
			mkt.QAll(query).forEach((e: any) => {
				e.value = dados;
			})
		} else {
			mkt.w("QSetAll - Tipo de dado não implementado: " + mkt.classof(dados))
		}
		return eAfetados;
	}

	static eventInput = (e: any) => {
		e.dispatchEvent(new Event("input"));
	}

	static QSubSet = (queryContainer: string, dados: any, eventInput = true) => {
		let eAfetados: any = [];
		if (mkt.classof(dados) == "Object") { // Apenas Objeto
			mkt.QAll(queryContainer).forEach(e => {
				let v = mkt.getV(e.getAttribute("name"), dados)
				if (v == null) {
					e.setAttribute("value", "");
				} else {
					if (e.tagName == "IMG") {
						// IMG
						e.src = v;
					} else if (e.tagName == "DIV") {
						// DIV
						e.innerHTML = v;
					} else {
						// INPUT / TEXTAREA ...
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
	}

	static Qison = (query: any = "body") => {
		// Responde se Todos elementos deste query estão ON
		return (mkt.QAll(query).some((e: any) => { return e.classList.contains("disabled") }))
			? false
			: true;
	}

	static QverToggle = (query: HTMLElement | string | null = "body") => {
		// Inverte oculto dos campos da query
		return mkt.aCadaElemento(query, (e: any) => {
			e?.classList.toggle("oculto");
		});
	}


	// =========================== ERROS, LOGS E INFORMACOES ========================== \\
	// ================================================================================= \\

	static l = (...s: any) => {
		// Atalho e Redirect Log. Utilizar mkt.w para realizar trace route.
		if (mkt.a.log) {
			console.log(...s);
		}
	};

	static w = (...s: any) => {
		// Atalho e Redirect Warning com trace da origem.
		if (mkt.a.log) {
			console.warn(...s);
		}
	};

	static gc = (...s: any) => {
		// Group Collapsed INICIO. Termine com mkt.ge();
		if (mkt.a.log) {
			console.groupCollapsed(...s);
		}
	};

	static ge = () => {
		// Group End FIM. Inicie com mkt.gc("");
		if (mkt.a.log) {
			console.groupEnd();
		}
	};

	static erro = (...s: any) => {
		// Atalho e Redirect Error com trace da origem. 
		if (mkt.a.log) {
			console.error(...s);
		}
	};

	static ct = (s: any) => {
		// INICIO do CONTA TEMPO utillizado pra saber o tempo dos GET e POST.
		let t = mkt.a.timers.find((t: any) => t.name == s);
		if (!t) {
			mkt.a.timers.push({
				name: s,
				ini: mkt.dataGetMs(),
				fim: 0,
				tempo: -1,
			});
		}
	};

	static cte = (s: any, quietMode: any = false) => {
		// FIM do CONTA TEMPO utillizado pra saber o tempo dos GET e POST.
		let t = mkt.a.timers.find((t: any) => t.name == s);
		if (t.fim == 0) {
			t.fim = mkt.dataGetMs();
			t.tempo = t.fim - t.ini;
		}
		if (!quietMode) {
			mkt.l(s + " \t-> " + t.tempo + " ms");
		}
	};

	static errosLog = () => {
		// Utiliza o armazenamento local pra guardar erros, normalmente erros do Request Http.
		let mktArmazenado = localStorage.mktRequests;
		if (localStorage.mktRequests) mktArmazenado = JSON.parse(localStorage.mktRequests);
		return console.table(mktArmazenado);
	};

	// ============================ MKT Support / Component =========================== \\	
	// ================================================================================= \\

	static exeTimer = () => {
		// A um determinado tempo, reexecuta essas funções.
		// Quando trocar essas funções para Web Component, será possivel manter observado por dentro da classe.
		mkt.mkRecRenderizar();
		// Recursiva
		mkt.wait(mkt.a.exeTimer).then(r => {
			mkt.exeTimer();
		});
	};

	static Inicializar = () => {
		// Ao iniciar a biblioteca já executa essas funções
		mkt.clicarNaAba(mkt.Q(".mkAbas a.active")); // Inicia no ativo
		mkt.exeTimer();
	};

	static moldeOA = async (
		dados: object[] | object,
		modelo: any = "#modelo",
		repositorio: any = ".tableListagem .listBody",
		allowTags: boolean = false,
		removeAspas: boolean = false
	) => {
		// MoldeOA popula templates de forma escalável com uma array de objetos ou um objeto.
		// É no molde que se converte vários objetos em várias exibições estes objetos.
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
			let moldeO_Execute = (o: any) => {
				let node: any = eModelo.innerHTML;
				let ret: string = "";

				// Converte de "${obj.key}" em valor dentro de uma string.
				if (node.indexOf("${") >= 0) {
					let ini = node.split("${");
					ret = ini[0];
					for (let i in ini) {
						if (i == "0") continue;
						let end: number = ini[i].indexOf("}");
						let key: string = ini[i].slice(0, end).trim();
						if ((mkt.classof(o) == "Object" || mkt.classof(o) == "Array") && o != null) {
							// Quando é Objeto ou Array, entra na propriedade ou posição solicitada.
							let v = mkt.getV(key, o);
							if (removeAspas) v = mkt.removerAspas(v);
							if (v != null) {
								ret += v;
							}
						}
						ret += ini[i].slice(end + 1);
					}
					node = ret;
				}
				// Converte de "#{obj.key}" em ${valor do obj.key}.
				if (node.indexOf("#{") >= 0) {
					let ini = node.split("#{");
					ret = ini[0];
					for (let i in ini) {
						if (i == "0") continue;
						let end: number = ini[i].indexOf("}");
						let key: string = ini[i].slice(0, end).trim();
						if ((mkt.classof(o) == "Object" || mkt.classof(o) == "Array") && o != null) {
							// Quando é Objeto ou Array, entra na propriedade ou posição solicitada.
							let v = mkt.getV(key, o);
							if (removeAspas) v = mkt.removerAspas(v);
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
			//Allow Tags
			if (allowTags) {
				listaNode = listaNode.replaceAll("&lt;", "<");
				listaNode = listaNode.replaceAll("&gt;", ">");
			}
			eRepositorio.innerHTML = listaNode;
			// Após todos elementos inseridos, remove os r_e_m
			[...eRepositorio.querySelectorAll("*")].forEach(e => {
				if (e.classList.contains("r_e_m")) e.remove();
			})
			r(true);
		});
	};

	static getV = (keys: string, objeto: any) => {
		// Retorna o valor do chave informada, podendo ser obj.obj.chave
		// mkt.getV("a.b.c",{a:{b:{c:"d"}}})
		if (typeof objeto == "object") {
			if (mkt.classof(keys) == "String") {
				if (keys.includes(".")) {
					// Multi
					let ks: string[] = keys.split(".");
					let lastObj = objeto;
					let lastV = {};
					// Iterar o Keys, Ver Obj atual e Setar Conteudo;
					ks.forEach((k) => {
						if (lastObj) { // Pode ficar nulo durante
							lastV = lastObj[k];
							if (typeof lastV == "object") {
								lastObj = lastV;
							}
						}
					});
					return lastV;
				} else {
					// Simples
					return objeto[keys];
				}
			} else {
				mkt.w("getV() - Nome da propriedade precisa ser em String. (" + mkt.classof(keys) + "):", keys);
			}
		} else {
			mkt.w("Para ver a chave, o parametro objeto precisa receber um objeto. (" + typeof objeto + ")");
		}
		return null;
	};

	static setV = (keys: string, value: any, objeto: any) => {
		// Retorna o valor do chave informada, podendo ser obj.obj.chave
		// mkt.setV("a.b.c","mudei",{a:{b:{c:"d"}}})
		if (typeof objeto == "object") {
			if (mkt.classof(keys) == "String") {
				if (keys.includes(".")) {
					// Multi
					let ks: string[] = keys.split(".");
					let lastObj = objeto;
					// Iterar o Keys, Ver Obj atual e Setar Conteudo;
					ks.forEach((k) => {
						if (ks.indexOf(k) == (ks.length - 1)) {
							// Último
							lastObj[k] = value;
						} else {
							if (mkt.classof(lastObj[k]) != "Object") {
								lastObj[k] = {};
							}
						}
						lastObj = lastObj[k];
					});
					//delete objeto[keys];
					return objeto;
				} else {
					// Set direto, não tem ponto e é string
					objeto[keys] = value;
					return objeto;
				}
			} else {
				mkt.w("setV() - Nome da propriedade precisa ser em string. (" + mkt.classof(keys) + "):", keys);
			}
		} else {
			mkt.w("setV() - Objeto precisa receber um objeto. (" + typeof objeto + ")");
		}
		return null;
	};

	static processoFiltragem = (aTotal: any, objFiltro: any, inst: mkt) => {
		// Atravéz de uma array completa e vários filtros, retorna uma array filtrada sobre as regras de cada objeto.
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

						mkt.aCadaSubPropriedade(o, (v: any) => {
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
	};

	static delObjetoFromId = (
		nomeKey: any,
		valorKey: any,
		listaDados: Array<any>
	): Array<any> => {
		// Remove um objeto quando uma chave e valor bater com o objeto.
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
	};

	static setObjetoFromId = (
		nomeKey: any,
		valorKey: any,
		itemModificado: object,
		listaDados: Array<any>
	): Array<any> => {
		// Troca o objeto encontrado pelo ItemModificado e retorna a lista modificada;
		if (Array.isArray(listaDados)) {
			for (let i = 0; i < listaDados.length; i++) {
				if (listaDados[i][nomeKey] == valorKey) {
					listaDados[i] = itemModificado;
				}
			}
		}
		return listaDados;
	};

	static hm = { // Representa o Head Menu
		Hide: (ev: any) => {
			// Ocultar ao clicar fora.
			let ehm = mkt.Q("body .mkHeadMenu");
			let ethm = ev.target.closest('.mkHeadMenu');
			if (!ethm) {
				ehm?.classList.add("oculto");
			}
		},
		Previous: (colName: string, iof: string | null | undefined) => {
			// iof == indexOf mkt.a.build
			if ((mkt.classof(iof) == "String") && (mkt.classof(colName) == "String")) {
				// Sempre que abre o menu, da o replace do this na estática.
				let opcoes = mkt.getThis(Number(iof)).getModel().map((o: any) => { if (o.f) return o.k; }).filter((r: any) => { return r != null });
				let posAtual = opcoes.indexOf(colName);
				let posAnterior = 0;
				if (posAtual >= 0) { // Se o atual existe
					posAnterior = posAtual - 1;
				}
				if (posAnterior < 0) {// Era o primeiro
					posAnterior = opcoes.length - 1;//Vira Última Posição
				}
				if (opcoes[posAnterior]) mkt.getThis(Number(iof)).headMenuAbrir(opcoes[posAnterior] as string);
			} else {
				mkt.w("mkt.hm.Previous() - Parametros precisam ser duas string: ", colName, iof);
			}

		},
		Next: (colName: string, iof: string | null | undefined) => {
			if (mkt.classof(iof) == "String") {
				let opcoes = mkt.getThis(Number(iof)).getModel().map((o: any) => { if (o.f) return o.k; }).filter((r: any) => { return r != null });
				let posAtual = opcoes.indexOf(colName);
				let posSeguinte = 0;
				if (posAtual >= 0) { // Se o atual existe
					posSeguinte = posAtual + 1;
				}
				if (posSeguinte >= opcoes.length) {// Era o último
					posSeguinte = 0;//Vira Primeira Posição
				}
				if (opcoes[posSeguinte]) mkt.getThis(Number(iof)).headMenuAbrir(opcoes[posSeguinte] as string);
			} else {
				mkt.w("mkt.hm.Next() - Parametros precisam ser uma string: ", colName, iof);
			}
		},
		Crescente: (colName: string, iof: string | null | undefined) => {
			if (mkt.classof(iof) == "String") {
				mkt.getThis(Number(iof)).orderBy(colName, 0);
			} else {
				mkt.w("mkt.hm.Crescente() - Parametros precisam ser string: ", colName, iof);
			}
		},
		Decrescente: (colName: string, iof: string | null | undefined) => {
			if (mkt.classof(iof) == "String") {
				mkt.getThis(Number(iof)).orderBy(colName, 1);
			} else {
				mkt.w("mkt.hm.Decrescente() - Parametros precisam ser string: ", colName, iof);
			}
		},
		Limpar: (colName: string, iof: string | null | undefined) => {
			mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
			mkt.getThis(Number(iof)).hmunsel = [];
			mkt.hm.FiltraExclusivo("", iof);
			mkt.getThis(Number(iof)).clearFiltro(colName);
			mkt.getThis(Number(iof)).atualizarListagem();
		},
		LimparTodos: (colName: string, iof: string | null | undefined) => {
			mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
			mkt.getThis(Number(iof)).hmunsel = [];
			mkt.hm.FiltraExclusivo("", iof);
			mkt.getThis(Number(iof)).clearFiltro();
			mkt.getThis(Number(iof)).atualizarListagem();
		},
		ContemInput: (v: any, colName: string, iof: string | null | undefined) => {
			mkt.getThis(Number(iof)).c.objFiltro[colName] = {
				formato: "string",
				operador: "",
				conteudo: v,
			};
			mkt.getThis(Number(iof)).atualizaNaPaginaUm();
			// Limpar outros filtros
			mkt.getThis(Number(iof)).hmunsel = [];
			mkt.hm.FiltraExclusivo("", iof);
		},
		FiltraExclusivo: (v: string, iof: string | null | undefined) => {
			if (mkt.classof(iof) == "String") {
				let vProcessado = mkt.removeEspecias(v).toLowerCase().trim();
				let exFiltrado = mkt.getThis(Number(iof)).exclusivos?.filter((f: string) => {
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
					exFiltrado.forEach((v: any) => {
						let sel = "sel";
						let v2 = mkt.removeEspecias(v).toLowerCase().trim();
						mkt.getThis(Number(iof)).hmunsel.forEach((hm: any) => {
							if (mkt.removeEspecias(hm).toLowerCase().trim() == v2) {
								sel = "";
							}
						});
						// Tratamento das possíveis saída de dados diferentes.
						let vOut: any = v;
						if (new RegExp(mkt.a.util.data[1]).test(vOut)) {
							vOut = mkt.dataToLocale(vOut);
						} else if (new RegExp(mkt.a.util.dataIso8601[1]).test(vOut)) {
							vOut = mkt.dataToLocale(vOut);
						}
						vOut = vOut.toString();
						if (vOut.length > 40) {
							vOut = vOut.slice(0, 37) + "...";
						}
						htmlPossiveis += "<li name='" + mkt.removerAspas(v2) + "' class='hmMarcarExclusivos nosel botao " + sel + "'>" + mkt.a.SVGINI + mkt.a.svgSquare + mkt.a.SVGFIM + mkt.a.espaco + vOut + "</li>";
					})
				}
				htmlPossiveis += "</ul>"
				mkt.Q("body .mkHeadMenu .possibilidades").innerHTML = htmlPossiveis;
				// Gatilhos para as Possibilidades assim que inseridas;
				mkt.Ao("click", ".mkHeadMenu .hmMarcarExclusivos", (e: HTMLInputElement | null) => {
					let eHmenu = mkt.Q("body .mkHeadMenu");
					if (e?.id == "headMenuTodos") {
						e = null;
					}
					mkt.hm.MarcarExclusivos(e, eHmenu?.getAttribute("data-colname"), eHmenu?.getAttribute("data-mkt"));
				})
			} else {
				mkt.w("mkt.hm.FiltraExclusivo() - Parametros precisam ser string: ", v, iof);
			}
		},
		MarcarExclusivos: (e: HTMLElement | null, colName: string, iof: string | null | undefined) => {
			// Marca de Desmarca
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
						} else {
							e.classList.remove("sel");
							if (name != null) {
								este.hmunsel.push(name);
								if (este.hmunsel.length == este.exclusivos.length) {
									mkt.Q("#headMenuTodos").classList.remove("sel");
									mkt.Q("body .mkHeadMenu .possibilidades").classList.toggle("st");
								}
							}
						}
					} else {
						mkt.w("mkt.hm.MarcarExclusivos() - Atributo NAME não encontrado em: ", e);
					}
				} else {
					mkt.Q("body .mkHeadMenu .possibilidades").classList.toggle("st");
					if (mkt.Q("body .mkHeadMenu .possibilidades").classList.contains("st")) {
						mkt.QAll(".mkHeadMenu .possibilidades li").forEach((el: HTMLLIElement) => {
							let name = el.getAttribute("name");
							el.classList.remove("sel");
							if (name != null) {
								if (!este.hmunsel.includes(name)) {
									este.hmunsel.push(name);
								}
							}
						})
					} else {
						mkt.QAll(".mkHeadMenu .possibilidades li").forEach((el: HTMLLIElement) => {
							let name = el.getAttribute("name");
							el.classList.add("sel");
							if (name != null) {
								este.hmunsel.splice(este.hmunsel.indexOf(name), 1);
							}
						})
					}
				}
				este.c.objFiltro[colName] = {
					formato: "mkHeadMenuSel",
					operador: "",
					conteudo: este.hmunsel,
				};
				este.atualizaNaPaginaUm();
				// Limpar outros filtros
				mkt.Q(".mkHeadMenu input[name='filtrarCampo']").value = "";
			} else {
				mkt.w("mkt.hm.MarcarExclusivos() - Parametros colName, iof precisam ser string: ", colName, iof);
			}
		},
		HideX: Function,

	};

	// ============================= Web Generic Component ============================ \\	
	// ================================================================================= \\

	static CarregarON = (nomeDoRequest: string = "") => {
		// Gera e exibe um sobreposto elemento que representa o carregamento com opção de ocultar.
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

	static CarregarOFF = (nomeDoRequest: string = "") => {
		// Oculta o elemento do carregador criado pelo CarregarON.
		if (mkt.Q("body .CarregadorMkBlock") != null) {
			mkt.Q("body .CarregadorMkBlock").classList.add("oculto");
		}
		mkt.Q("body").classList.remove("CarregadorMkSemScrollY");
	};

	static CarregarHtml = (estilo = "", classe = "relative") => {
		return `<div class="CarregadorMk ${classe}" style="${estilo}"></div>`;
	}

	static detectedServerOff = (mensagem: string = "Servidor OFF-LINE") => {
		// Gera e exibe um elemento que representa o servidor offline com opção de ocultar.
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
		// Oculta o elemento de exibição de servidor offline
		mkt.Q("body .offlineBlock")?.classList?.add("oculto");
		mkt.Q("body").classList.remove("CarregadorMkSemScrollY");
	};

	static importar = async (tagBuscar = ".divListagemContainer", tipo: any = "race", quiet: boolean = true) => {
		// IMPORTAR - Coleta o html externo através da classe mkImportar contendo a url.
		return new Promise((r, x) => {
			let num = mkt.a.contaImportados++;
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
							mkt.nodeToScript(o.e);
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
	};

	static post = {
		// Este objeto contém funções para enviar dados em um formato e espera-se que voltem no mesmo.
		json: async (config: any, json: object) => { // post json object...
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.a.POST;
			config.tipo = mkt.a.JSON;
			config.dados = json;
			let retorno = await mkt.request(config);
			return retorno;
		},
		html: async (config: any, text: string) => { // post b64...
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.a.POST;
			config.tipo = mkt.a.HTML;
			config.dados = text;
			let retorno = await mkt.request(config);
			return retorno;
		},
		form: async (config: any, formdata: FormData) => {
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.a.POST;
			config.tipo = mkt.a.FORMDATA;
			config.dados = formdata;
			let retorno = await mkt.request(config);
			return retorno;
		}
	};

	static get = {
		// Este objeto contém funções para solicitar dados de um formato e espera-se que voltem neste formato.
		json: async (config: any) => {
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.a.GET;
			config.tipo = mkt.a.JSON;
			return await mkt.request(config);
		},
		html: async (config: any) => {
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.a.GET;
			config.tipo = mkt.a.HTML;
			let retorno = await mkt.request(config);
			return retorno;
		},
		blob: async (config: any) => {
			if (typeof config != "object") config = { url: config };
			config.metodo = mkt.a.GET;
			config.tipo = mkt.a.ALL;
			let retorno = await mkt.request(config);
			return retorno;
		}
	};

	static request = async (config: any) => {
		// Função para transferencia HTTP que utiliza o FETCH e agrega um config do início da solicitação até o fim.
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
			mkt.w("Nenhum tipo de dado informado. Avançando com " + mkt.a.JSON);
			config.tipo = mkt.a.JSON;
		}
		if (!config?.headers) {
			config.headers = new Headers();
			// CONTENT TYPE
			if (config.tipo == mkt.a.JSON) {
				config.headers.append("Content-Type", config.tipo);
			}
			// TOKEN Baseado neste primeiro input
			let aft: any = mkt.Q("input[name='__RequestVerificationToken']")?.value;
			config.headers.append("MKANTI-FORGERY-TOKEN", aft || "");
		}
		if (!config.quiet) config.quiet = false;
		// TIPO DE ENVIO
		config.json = mkt.stringify(config.dados);
		if (config.metodo != mkt.a.GET) {
			if (config.tipo == mkt.a.JSON) {
				config.body = config.json;
			} else if (config.tipo == mkt.a.FORMDATA) {
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
				// FALHA (NÂO 200)
				config.conectou = false;
				config.statusCode = config.pacote.status;
				config.erros = await config.pacote.text();
				mkt.gc(
					"HTTP RETURNO: " + config.pacote.status + " " + config.pacote.statusText
				);
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
					})
					if (erros.length > 10) {
						erros.shift(1);
					}

					localStorage.mktRequests = mkt.stringify(erros);
				}
			} else {
				// OK == 200 até 299
				config.conectou = true;
				config.statusCode = config.pacote.status;
				// 104, 204, 304, 404, 504 não tem conteúdo.
				if (config.statusCode != 204) {
					// Se OK e TEM CONTEUDO. Transforma baseado na solicitação.
					if (config.tipo == mkt.a.JSON) {
						config.retorno = await config.pacote.json();
					} else if (config.tipo == mkt.a.HTML) {
						config.retorno = await config.pacote.text();
					} else if (config.tipo == mkt.a.ALL) {
						config.retorno = await config.pacote.blob();
					} else if (config.tipo == mkt.a.FORMDATA) {
						config.retorno = await config.pacote.json();
					}
				}

				if (!config.quiet) {
					let tam = config.retorno?.length;
					// Exibe o tamanho do retorno, se houver
					if (!tam) {
						tam = "";
					} else {
						tam = "{" + tam + "} ";
					}
					mkt.gc(
						"Retorno " + config.pacote.status +
						" (" + config.metodo + "): " + tam +
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
				mkt.l("Config: ", config);
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
	};


	static mkConfirma = async (
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
	}


	// ================ Gerenciamento Monetário / Numérico / Locale =================== \\
	// ================================================================================= \\

	static getCountry = (): string => {
		return Intl.DateTimeFormat().resolvedOptions().locale.toUpperCase().slice(3);
	}

	static numToDisplay = (num: any, c: any = {}): string => {
		// Formata o número para uma string com casas fixas atrás da vírgula.
		if (c.casas == null) c.casas = 2; // Valor Padrão de casas atrás da vírgula.
		if (c.mincasas == null) c.mincasas = c.casas; // Mínimo de casas atrás da vírgula
		if (c.maxcasas == null) c.maxcasas = c.casas; // Máximo de casas atrás da vírgula
		if (c.milhar == null) c.milhar = false; // Exibe ou remove o separador de milhar
		if (c.locale == null) c.locale = "pt-BR";
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

	static toMoeda = (valor: any): string => {
		// Texto / Número convertido em Reais
		if (valor != null) {
			if (mkt.classof(valor) == "Number") {
				valor = valor.toFixed(2);
			}
			let d = [...valor.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a) }).join("").padStart(3, "0");
			return new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(Number(d.slice(0, -2) + "." + d.slice(-2)));
		}
		return "";
	};

	static fromMoeda = (texto: string): Number => {
		// Retorna um float de duas casas / 0 a partir de um valor monetario 
		if (texto) {
			let d = [...texto.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a) }).join("").padStart(3, "0");
			return Number(d.slice(0, -2) + "." + d.slice(-2));
		}
		return 0;
	};

	static toNumber = (valor: any, c: any = {}): number => {
		// Informando String/Number, converte para o número de casas c.casas (padrão 2).
		// mkt.toNumber("R$ 1.222,333") => 1222.33
		if (c.casas == null) c.casas = 2; // Limite de casas apenas para o valor retornado.
		if (valor != null) {
			if (mkt.classof(valor) == "String") {
				// Possiveis separadores
				let us = [".", ","].reduce((x, y) => (valor.lastIndexOf(x) > valor.lastIndexOf(y)) ? x : y);
				let posPonto = valor.lastIndexOf(us)
				if (posPonto >= 0) {
					let i = valor.slice(0, posPonto);
					let d = valor.slice(posPonto + 1).slice(0, 2).padEnd(2, "0");
					i = [...i.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a) }).join("");
					d = [...d.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a) }).join("");
					valor = i + "." + d;
				} else {
					valor = [...valor.toString()].filter(a => { return new RegExp(mkt.a.util.numeros[1]).test(a) }).join("").padStart(3, "0")
					valor = valor.slice(0, -(c.casas)) + "." + valor.slice(-(c.casas));
				}
			} else if (mkt.classof(valor) == "Number") {
				valor = valor.toFixed(c.casas); // <= Vira String, mas essa função apenas devolve Number
			} else {
				mkt.w("toNumber() - Formato de entrada não implementado: ", mkt.classof(valor));
			}
			return Number(valor); // <= OutPut Number
		}
		return 0; // <= OutPut Number
	};

	static numMedia = (menor: string | number, maior: string | number): string => {
		return mkt.numToDisplay((mkt.toNumber(menor) + mkt.toNumber(maior)) / 2);
	}

	// =========================== Gerenciamento de Data ============================== \\
	// ================================================================================= \\

	static dataGetDia = (ms = null) => {
		// GET UTC Dia - '18'
		if (ms != null) return Number(mkt.dataGetData(ms).split("-")[2]);
		else return Number(mkt.dataGetData().split("-")[2]);
	};

	static dataGetMes = (ms = null) => {
		// GET UTC Ano - '02'
		if (ms != null) return Number(mkt.dataGetData(ms).split("-")[1]);
		else return Number(mkt.dataGetData().split("-")[1]);
	};

	static dataGetAno = (ms = null) => {
		// GET UTC Ano - '2024'
		if (ms != null) return Number(mkt.dataGetData(ms).split("-")[0]);
		else return Number(mkt.dataGetData().split("-")[0]);
	};

	static dataGetData = (ms = null) => {
		// GET UTC Data - '2024-02-18'
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
		// Data Local: '18/02/2024'
		return new Date(mkt.dataGetMs()).toLocaleDateString();
	};

	static dataGetHoraToday = () => {
		// Hora Local: '19:06:07'
		return new Date(Number(mkt.dataGetMs())).toLocaleTimeString();
	};

	static dataGetFullToday = () => {
		// Data e Hora Local: '18/02/2024 19:06:47'
		return mkt.dataGetDataToday() + " " + mkt.dataGetHoraToday();
	};

	static dataToBRData = (data: string): string => {
		// Converter de YYYY-MM-DD para DD/MM/YYYY
		let arrayData = data.split("-");
		let stringRetorno = "";
		if (arrayData.length >= 3) {
			// Tenta evitar bug de conversao
			stringRetorno = arrayData[2] + "/" + arrayData[1] + "/" + arrayData[0];
		} else {
			stringRetorno = data;
		}
		return stringRetorno;
	};

	// ISO 8601
	static dataToIsoData = (data: string): string => {
		// Converter de DD/MM/YYYY para YYYY-MM-DD
		let dataDDMMYYYY = new RegExp("^[0-3][0-9][/][0-1][0-9][/][0-2][0-9]{3}$");
		let stringRetorno = data;
		if (dataDDMMYYYY.test(data)) {
			let arrayData = data.split("/");
			if (arrayData.length >= 3) {
				stringRetorno = arrayData[2] + "-" + arrayData[1] + "-" + arrayData[0];
			} else {
				stringRetorno = data;
			}
		}
		return stringRetorno;
	};

	static isData = (i: string): Boolean => {
		// Verifica se é data Se não for, retorna 0 (false).
		// Se for, retorna o tipo de data baseado no regex usado.

		return new RegExp(mkt.a.util.data[1]).test(i);
	}

	static dataFormatarSOA = (soa: object | object[] | string, reverse: boolean | null = false) => {
		// Converter todas Datas (OBJ / ARRAY / STRING) - Não converte MS (Number)
		// Como deveria ser:
		// - A cada Sub Propriedade String
		// - -> Verificar se é: Só data, Data e Hora
		// - -> Verfificar se está padrao BR ou ISO
		// - -> Converter para o padrao BR se reverse estiver false.
		// - -> Converter para o padrao ISO se reverse estiver true.
		// MAS Está primitivo, apenas string que foi implementado formato via regex
		function dataFormatarS_Execute(s: string, rev: boolean | null = false) {
			// A cada vez que entrar aqui, precisa verificar se a string é um regex da data.
			if (rev) {
				s = mkt.dataToIsoData(s);
			} else {
				let busca = new RegExp("^[0-2][0-9]{3}[-][0-1][0-9][-][0-3][0-9]$"); // Entre 0000-00-00 a 2999-19-39
				let busca2 = new RegExp("^[0-2][0-9]{3}[-][0-1][0-9][-][0-3][0-9][T| ][0-2][0-9]:[0-5][0-9]"); // Entre 0000-00-00T00:00 a 2999-19-39T29:59 (Se iniciar nesse formato de ISO )

				if (busca2.test(s)) {
					s = mkt.dataToLocale(s).replaceAll(",", "");
				} else if (busca.test(s)) {
					s = mkt.dataToBRData(s);
				}
			}
			return s;
		}
		function dataFormatarO_Execute(o: any) {
			for (var propName in o) {
				if (mkt.classof(o[propName]) == "String") {
					o[propName] = dataFormatarS_Execute(o[propName], reverse);
				}
			}
			return o;
		}
		let tipo = mkt.classof(soa);
		if (tipo == "Object" || tipo == "Array") {
			return mkt.aCadaObjExecuta(soa as object | object[], dataFormatarO_Execute);
		} else if (tipo == "String") {
			return dataFormatarS_Execute(soa as string, reverse);
		}
		return soa; // Outra tipagem, não formata
	};

	static masterFormatarSOA = (soa: object | object[]) => {
		// Converter (OBJ / ARRAY) Formatar para normalizar com a exibicao ao usuario.
		return mkt.dataFormatarSOA(mkt.limparOA(soa));
	}

	static dataToLocale = (data: string): string => {
		// com Objeto DATA, STRING ou MS, retorna data BR.
		// '2023-12-27T12:01:16.158' => '22/12/2023, 11:18:33'
		let dataNum: string | number = Number(data);
		if (mkt.classof(dataNum) != "Number") {
			dataNum = data
		}
		if (mkt.classof(data) == "Date") {
			return data.toLocaleString();
		}
		return new Date(dataNum).toLocaleString();
	};

	static dataGetSegundosDiferenca = (
		msOld: number,
		msNew: number | null = null
	): number => {
		// Retorna a diferença de segundos entre dois MS
		if (msNew == null) msNew = mkt.dataGetMs();
		return mkt.dataMsToSegundos(msNew! - msOld);
	};

	static dataGetDiasDiferenca = (
		msOld: number,
		msNew: number | null = null
	): number => {
		// Retorna a diferença de dias entre dois MS
		if (msNew == null) msNew = mkt.dataGetMs();
		return mkt.dataMsToDias(msNew! - msOld);
	};

	static dataGetTempoDiferenca = (msOld: number, msNew: number | null = null) => {
		let dias = mkt.dataGetDiasDiferenca(msOld, msNew);
		if (dias < 0) {
			dias = dias * -1;
		}
		let strTempo = "";
		if (dias > 29) { // Em Meses
			if (dias < 60) {
				strTempo = "1 mês";
			} else {
				if (dias > 365) { // Em Anos (+ Meses restantes)
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
				let segundos = mkt.dataGetSegundosDiferenca(msOld, msNew);
				if (segundos > 7199) { // Em Horas
					strTempo = Math.floor(segundos / 3600) + " horas";
				} else {
					if (segundos > 3599) {
						strTempo = "1 hora";
					} else {
						if (segundos > 119) { // Em Minutos
							strTempo = Math.floor(segundos / 60) + " minutos";
						} else {
							if (segundos > 59) {
								strTempo = "1 minuto";
							} else {
								strTempo = Math.floor(segundos) + " segundos";
							}
						}
					}
				}
			} else { // Em Dias
				strTempo = dias + " dias";
			}
		}
		return strTempo;
	}

	static dataGetMs = (data: string | null = null): number => {
		// Retorna Milisegundos da data no formato Javascript
		if (data != null) {
			if (data.length > 10) {
				// Recomendado que os dados cheguem: 'YYYY-MM-DD HH:MM:SS'
				return new Date(data).getTime(); // Recomendado que os dados 
			} else {
				let dataCortada = data.split("-");
				let oDia: number = Number(dataCortada[2]);
				let oMes: number = Number(dataCortada[1]) - 1;
				let oAno: number = Number(dataCortada[0]);
				return new Date(oAno, oMes, oDia).getTime();
			}
		} else return new Date().getTime();
	};

	static dataMsToSegundos = (num: number, reverse: boolean = false) => {
		if (reverse) {
			return num * 1000;
		}
		return Math.trunc(num / 1000); // 1000 ms == 1s
	}

	static dataMsToMinutos = (num: number, reverse: boolean = false) => {
		if (reverse) {
			return num * 60000;
		}
		return Math.trunc(num / 60000); // 1000 * 60
	}

	static dataMsToHoras = (num: number, reverse: boolean = false) => {
		if (reverse) {
			return num * 3600000;
		}
		return Math.trunc(num / 3600000); // 1000 * 3600
	}

	static dataMsToDias = (num: number, reverse: boolean = false) => {
		// 1000 * 3600 * 24 Considerando todo dia tiver 24 horas (~23h 56m 4.1s)
		// (360º translacao / 86400000) = ~4.1
		// Então o erro de 1 dia ocorre 1x ao ano (Dia represeta 1436min).
		// Por isso, é melhor trabalhar com Dias em vez de outro formato maior.
		if (reverse) {
			return Math.trunc(num * 86400000);
		}
		return Math.trunc(num / 86400000);
	};


	// =============================== Web Components ================================= \\
	// ================================================================================= \\

	static mkRecChange = (recItem: any, texto: string) => {
		let e = recItem?.parentElement?.previousElementSibling
		if (e) {
			e.value = texto;
			mkt.wait(10).then(r => {
				mkt.mkRecUpdate(e);
				e.focus();
			});
		} else {
			mkt.w("Não foi possível alterar o elemento: ", e);
		}
	}

	static mkRecFoco = (input: any, f: Boolean) => {
		let eList = input?.nextElementSibling
		if (eList) {
			if (!f) {
				eList.classList.add("emFoco")
			} else {
				eList.classList.remove("emFoco");
			}
		} else {
			mkt.w("Não foi possível alterar o elemento: ", eList);
		}
		// Atualizar posição da Lista.
		mkt.Reposicionar(eList, false);
	}

	static mkRecRenderizar = async () => {
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
				// Seguir o Elemento durante o scroll e resize
				document.addEventListener("scroll", (event) => {
					mkt.Reposicionar(divMkRecList, false);
				});
				window.addEventListener("resize", (event) => {
					mkt.Reposicionar(divMkRecList, true);
				});
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
	};

	static mkRecUpdate = (e: any) => {
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
	};

	// ======================== REGRAR | VALIDAR | MASCARAR =========================== \\
	// ================================================================================= \\


	static regras: any[] = [];

	static regraExe = async (e: any, tipoEvento = "blur", ev: Event | null = null) => {
		// Função que executa as regras deste campo com base nos objetos salvos
		// O EVENTO pode estar nulo no FULL, pois a função que chamou regrasValidas() não passou o evento.
		// Quando concluir (onChange), executar novamentepra remover erros já corrigidos (justamente no último caracter).
		//mkt.l("Regrar " + tipoEvento + ":", ev);
		return new Promise((resolver) => {
			// Antes de buscar a regra para esse elemento, limpa os que estão fora do dom
			let tempRegras: any[] = [];
			mkt.regras.forEach((r) => {
				if (mkt.isInsideDom(r.e)) {
					tempRegras.push(r);
				} else {
					// Não está mais no DOM e será removida.
					// Mas emite aviso, pois não foi removida naturalmente.
					//mkt.l("Regrar > AutoRemoção de Validação do campo: ", r.n);
				};
			});
			mkt.regras = tempRegras; // Requer Propriedade destravada
			let erros: any = [];
			let regrasDoE = mkt.regras.find((o: any) => o.e == e);
			let eDisplay = regrasDoE?.c.querySelector(".mkRegrar[data-valmsg-for='" + regrasDoE.n + "']")
			let regras = regrasDoE?.r;
			let promises: any = []
			if (regras) {
				regras.forEach((re: any) => { // TODAS AS REGRAS
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
					let podeValidar = re.on; // Padrão validar, mas se regra estiver com o on=false, já inicia o giro sem validar;
					if (!mkt.isVisible(e)) { // NÃO estiver VISIVEL / fora do dom, padrão sem validar
						podeValidar = false;
					}
					if (e.classList.contains("disabled")) { // Desativado, padrão sem validar
						podeValidar = false;
					}
					if (re.vazio == true && e[re.target] == "") { // Ignora Validação Se estiver vindo vazio e vazio pode
						podeValidar = false;
					}
					// Validar apenas quando i estiver true na regra OU  Visível e Não bloqueado
					if (podeValidar || re.f) { // re.f == FORCE, pode ser passado no objeto do regrar.
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
									if (!(new RegExp(mkt.a.util.numerosvirgula[1]).test(e[re.target]))) {
										if (!re.m) re.m = mkt.a.msg.apenasnumerosvirgula;
										erros.push(re);
										e[re.target] = e[re.target].replaceAll(/((?![0-9,]).)/g, "")
									}
									if (tipoEvento == "blur") {
										// Apenas ultima virgula
										let valor = e[re.target];
										let posPonto = valor.lastIndexOf([".", ","].reduce((x, y) => (valor.lastIndexOf(x) > valor.lastIndexOf(y)) ? x : y));
										if (posPonto >= 0) {
											// Se houver ponto
											e[re.target] = Number(mkt.apenasNumeros(valor.slice(0, posPonto)) + "." + mkt.apenasNumeros(valor.slice(posPonto + 1))).toString().replaceAll(".", ",");
										}
									}
									prom(re.k);
									break;

								case "charproibido": // EXE
									for (let c of re.v) {
										if (e[re.target].includes(c)) {
											if (!re.m) re.m = mkt.a.msg.charproibido + c;
											erros.push(re);
											e[re.target] = e[re.target].replaceAll(c, "");
										}
									}
									prom(re.k);
									break;

								case "apenasnumeros": // EXE
									if (!(new RegExp(mkt.a.util.numeros[1]).test(e[re.target]))) {
										if (!re.m) re.m = mkt.a.msg.apenasnumeros;
										erros.push(re);
										e[re.target] = e[re.target].replaceAll(/((?![0-9]).)/g, "")
									}
									prom(re.k);
									break;

								case "apenasletras": // EXE
									if (!(new RegExp(mkt.a.util.letras[1]).test(e[re.target]))) {
										if (!re.m) re.m = mkt.a.msg.apenasletras;
										erros.push(re);
										e[re.target] = e[re.target].replaceAll(/((?![a-zA-Z]).)/g, "")
									}
									prom(re.k);
									break;

								case "maxchars": // EXE
									e.setAttribute("maxlength", re.v);
									if (e[re.target].length > Number(re.v)) {
										if (!re.m) re.m = mkt.a.msg.maxc;
										erros.push(re);
										e[re.target] = e[re.target].slice(0, Number(re.v));
									}
									prom(re.k);
									break;

								case "minchars": // EXE
									e.setAttribute("minlength", re.v);
									if (e[re.target].length < Number(re.v)) {
										if (!re.m) re.m = mkt.a.msg.minc + re.v;
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
									if (mkt.dataGetMs(e[re.target]) > mkt.dataGetMs(re.v)) {
										if (!re.m) re.m = mkt.a.msg.datamax;
										erros.push(re);
										e[re.target] = re.v;
									}
									prom(re.k);
									break;

								case "nummin": // EXE
									e.setAttribute("min", re.v);
									if (mkt.toNumber(Number(e[re.target])) < Number(re.v)) {
										if (!re.m) re.m = mkt.a.msg.nummin + re.v;
										erros.push(re);
										e[re.target] = re.v;
									}
									prom(re.k);
									break;

								case "nummax": // EXE
									e.setAttribute("max", re.v);
									if (mkt.toNumber(Number(e[re.target])) > Number(re.v)) {
										if (!re.m) re.m = mkt.a.msg.nummax + re.v;
										erros.push(re);
										e[re.target] = re.v;
									}
									prom(re.k);
									break;

								case "obrigatorio": // INFO
									//mkt.l("Regrar OBRIGATORIO " + tipoEvento + ":", ev);
									// A regra obrigatório se executa em todas: full, blur, input, inicial(se houver);
									//	if (e.getAttribute("type")?.toLowerCase() != "file") { // Se Não for um input FILE, que gera blur
									// Aqui tem que arrumar, para poder permitir a regra em input file de alguma forma.
									if (re.v == null) re.v = "true";
									if (re.v == "true") {
										if (e[re.target] == "") {
											if (!re.m) {
												if (mkt.classof(e) == "mkSelElement") {
													re.m = mkt.a.msg.so;
												} else {
													re.m = mkt.a.msg.po;
												}
											}
											erros.push(re);
										}
									}
									//}
									prom(re.k);
									break;

								case "regex": // INFO
									if ((tipoEvento == "full") || (tipoEvento == "blur")) {
										if (!(new RegExp(re.v).test(e[re.target]))) {
											if (!re.m) re.m = mkt.a.msg.fi;
											erros.push(re);
										}
									}
									prom(re.k);
									break;

								case "email": // INFO
									if ((tipoEvento == "full") || (tipoEvento == "blur")) {
										if (!re.v) re.v = mkt.a.util.email[1];
										if (!(new RegExp(re.v).test(e[re.target]))) {
											if (!re.m) re.m = mkt.a.msg.emailinvalido;
											erros.push(re);
										}
									}
									prom(re.k);
									break;

								case "some": // INFO 
									if ((tipoEvento == "full") || (tipoEvento == "blur")) {
										// (Ao menos 1 ocorrencia do regex informado) (Pode gerar varios erros)
										let _vs: any;
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

								case "mincharsinfo": // INFO
									if ((tipoEvento == "full") || (tipoEvento == "blur")) {
										e.setAttribute("minlength", re.v);
										if (e[re.target].length < Number(re.v)) {
											if (!re.m) re.m = mkt.a.msg.minc + re.v;
											erros.push(re);
										}
									}
									prom(re.k);
									break;

								case "maxcharsinfo": // INFO
									if ((tipoEvento == "full") || (tipoEvento == "blur")) {
										if (e[re.target].length > Number(re.v)) {
											if (!re.m) re.m = mkt.a.msg.maxc + re.v;
											erros.push(re);
										}
									}
									prom(re.k);
									break;

								case "fn": // INFO
									if ((tipoEvento == "full") || (tipoEvento == "blur")) {
										re.v = eval(re.v);
										if (!(re.v(e[re.target]))) {
											if (!re.m) re.m = mkt.a.msg.negado;
											erros.push(re);
										}
									}
									prom(re.k);
									break;

								case "datamaiorque": // INFO
									if ((tipoEvento == "full") || (tipoEvento == "blur")) {
										if (mkt.dataGetMs(e[re.target]) < mkt.dataGetMs(re.v)) {
											if (!re.m) re.m = mkt.a.msg.datamaiorque;
											erros.push(re);
										}
									}
									prom(re.k);
									break;

								case "datamenorque": // INFO
									if ((tipoEvento == "full") || (tipoEvento == "blur")) {
										if (mkt.dataGetMs(e[re.target]) > mkt.dataGetMs(re.v)) {
											if (!re.m) re.m = mkt.a.msg.datamenorque;
											erros.push(re);
										}
									}
									prom(re.k);
									break;

								case "server": // INFO - ASYNC EVENT
									//(Verificação remota, DB / API)
									if ((tipoEvento == "full") || (tipoEvento == "blur")) {
										// Apenas executa server no blur
										if (!re.m) re.m = mkt.a.msg.in;
										if (e[re.target] != "") {
											e.classList.add("pending");
											let queryString = "?" + regrasDoE.n + "=" + encodeURIComponent(e[re.target]);
											// Anexar campos adicionais:
											if (re.a) {
												let arrAdd: Array<string> = re.a.split(",");
												arrAdd.forEach((s: string) => {
													let eAdd = regrasDoE.c.querySelector("*[name='" + s.trim() + "']");
													if (eAdd) {
														queryString += "&" + s.trim() + "=" + eAdd[re.target];
													} else {
														mkt.w("Regrar: Campo Adicional (a) solicitado não encontrado: ", s.trim());
													}
												});
											}
											mkt.get.json({ url: re.v + queryString, quiet: re.quiet }).then((p: any) => {
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
										// Entrou aqui por que o evento não é blur. Então finaliza a promise.
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
							// Se 1 regra gerar varios erros, junta por virgula.
							a.m = mkt.a.msg.some + a.vmfail.join(", ");
						}
						return a.m;
					}).join("<br/>");
					mkt.regraDisplay(e, true, eDisplay, mensagens);
					if (eDisplay) mkt.Terremoto(eDisplay);
				} else {
					mkt.regraDisplay(e, false, eDisplay, "");
				}
				resolver(erros);
			}); // Promise All
		}); // Return Promise regraExe
	};

	static regrasValidas = async (container: any, ev: Event | null = null) => {
		// Retorna um booleano indicando se este container está ok ou não.
		container = mkt.Q(container);
		let validou = false;
		// Informando um container qualquer, executa apenas as regras dentro deles.
		let promises: any = [];
		mkt.regras.forEach((regra: any) => {
			if (mkt.isInside(regra.e, container)) {
				promises.push(mkt.regraExe(regra.e, "full", ev));
			}
		});
		let resultado: any = [];
		resultado = await Promise.all(promises);
		validou = resultado.flat().length <= 0;
		if (!validou) {
			mkt.vibrar(false);
			mkt.gc("Validou a ação? ", (validou ? "Sim." : "Não."), " TipoEvento: full");
			resultado.flat().forEach((r: any) => {
				mkt.gc("Regra:", r.k?.toString().toUpperCase(), "Campo: " + r.e?.name);
				mkt.l(r.e);
				mkt.ge();
			});
			mkt.ge();
		} else {
			mkt.l("Validou a ação? Sim. TipoEvento: full");
		}

		return validou;
	};

	static regraDisplay = (e: any, erro: boolean, eDisplay: any, mensagem: string = "") => {
		// Reagindo similar ao Unobtrusive, mas usando oculto no span.
		if (erro) {
			// EXIBE ERRO
			e.classList.remove("valid");
			e.classList.add("input-validation-error");
			eDisplay?.classList.remove("oculto");
			eDisplay?.classList.add("field-validation-error");
		} else {
			// OCULTA ERRO
			if (e.offsetParent && !e.classList.contains("disabled")) { // Não setar valido nos desativados/invisiveis
				e.classList.add("valid");
			}
			e.classList.remove("input-validation-error");
			eDisplay?.classList.add("oculto");
		}
		if (eDisplay) eDisplay.innerHTML = mensagem;
	};

	static regraOcultar = (container: any) => {
		// Atualiza Displays .mkRegrar baseado no Container
		container = mkt.Q(container);
		// A cada regra envia um OCULTAR ERROS
		mkt.regras.forEach((r: any) => {
			let e = r.e;
			let eDisplay = r.c.querySelector(".mkRegrar[data-valmsg-for='" + r.n + "']")
			if (container) {
				if (mkt.isInside(e, container)) {
					mkt.regraDisplay(e, false, eDisplay);
				}
			} else {
				mkt.regraDisplay(e, false, eDisplay);
			}
		})
	};

	static regraRemover = async (container: any) => {
		// Remove (Elimina) as regras de um determinado container
		// Para refazer a regra, precisa utilizar mkt.regrar novamente.
		container = mkt.Q(container);
		let tempRegras: any[] = [];
		mkt.regras.forEach((r) => {
			if (!mkt.isInside(r.e, container)) {
				tempRegras.push(r);
			};
		});
		mkt.regras = tempRegras; // Requer Propriedade destravada
	}

	static regrarAtivador = (e: any, nomeRegra: string, turnON = true) => {
		// Permite ativar ou desativar uma regra, informando o elemento e qual regra vai desabilitar.
		if (nomeRegra != null) {
			e = mkt.Q(e);
			if (e) {
				let eRegras = mkt.regras.filter(r => { return r.e == e });
				// A cada regrar da lista
				eRegras.forEach((r) => {
					// A cada regra K deste elemento
					r.r.forEach((re: any) => {
						// Ativa apenas a informada
						if (nomeRegra == re.k) {
							re.on = turnON;
						}
					});
				});
			} else {
				mkt.w("regrarOn - Elemento não encontrado: ", e);
			}
		} else {
			mkt.w("regrarOn - Requer parametro 'nomeRegra' com uma string: ", nomeRegra);
		}
	}

	static regrar = (container: any, nome: string, ...obj: any) => {
		/** Informar o Container, Nome do input e OBJ (Regra)
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
		// Se elemento for encontrado dentro do container
		if (e) {
			// Quando o elemento é um Input File, atribui o OnChange, em vez do blur e input.
			if (e.getAttribute("type") == "file") {
				mkt.Ao("change", e, () => { mkt.regraExe(e, "change") });
			} else {
				mkt.atribuir(e, () => { mkt.regraExe(e, "input") }, "oninput");
				mkt.atribuir(e, (ev: Event) => { mkt.regraExe(e, "blur", ev) }, "onblur");
			}


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
				mkt.regraExe(e, "inicial");
			}
		} else {
			mkt.w("Regrar Requer Elemento (" + nome + "): ", e, " Container: ", container)
		}
	}

	static mascarar = (texto: any, mascara: any) => {
		// Informando uma máscara e um texto, retorna dado mascarado.
		// Mascaras: 0=Numero, A=Letra, Outros repete.
		if (mkt.classof(mascara) != "String") {
			// Se passar uma funcao para a mascara, Executa a função enviando o texto e deve retornar uma string da mascara para esse texto.
			if (mkt.classof(mascara) == "Function") {
				mascara = mascara(texto); // Sobreextreve a mascara a ser executada pelo retorno da função.
			}
		}
		if (mascara) {
			if (texto) {
				if (mkt.classof(texto) != "String") texto = texto?.toString();
				if (mkt.classof(mascara) != "String") mascara = mascara?.toString(); // Se a chegar até aqui e ainda não for string
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
			}
		} else {
			mkt.w("Mascarar Requer Texto: ", texto, " e Mascara: ", mascara);
		}
		return null;
	};

	static mascaraTelefoneDDI = (texto: string) => {
		// Essa máscara tenta encontrar um espaço entre DDI e DDD e Telefone para formatar.
		// Formata DDI apenas se estiver presente o +
		let str = texto;
		let resultado = "";
		if (mkt.classof(str) == "String") { // Ex: "+55 (48) 99968-0348"
			let parteDDI = "";
			let parteDDDTelefone = "";
			if (str.indexOf("+") >= 0) { // true (2)
				str = str.replaceAll("+", ""); // "55 (48) 99968-0348"
				// ETAPA 1: Difivir o DDI do DDD+TELEFONE
				if (str.indexOf(" ") >= 0) { // true (2)
					// Encontrou Espaço. (Supor que seja a divisória do DDI com o DDD)
					parteDDI = mkt.apenasNumeros(str.split(" ")[0]); // "55"
					parteDDDTelefone = str.slice(str.split(" ")[0].length); // " (48) 99968-0348"
				} else {
					// Nenhum espaço encontrado (Supor que DDI tem 2 caracteres) "+5548999680348"
					parteDDI = mkt.apenasNumeros(str).slice(0, 2); // "55"
					parteDDDTelefone = str.slice(str.indexOf(parteDDI) + parteDDI.length) // " (48) 99968-0348"
				}
				resultado = "+" + parteDDI;
				if (texto.length >= 5) {
					resultado += " ";
				}
				parteDDDTelefone = parteDDDTelefone.trim(); // Apenas por garantia "(48) 99968-0348"
				// ETAPA 2 QUANDO for DDI 55, Formata o DDD
				if (parteDDDTelefone.indexOf(" ") >= 0) { // true (4)
					// DDD+Telefone contém espaço. (Supor que é a divisão entre DDD e Telefone)
					let parteDDD = mkt.apenasNumeros(parteDDDTelefone.split(" ")[0]); // "48"
					let parteTelefone = mkt.apenasNumeros(parteDDDTelefone.slice(parteDDDTelefone.split(" ")[0].length).trim()); // "999680348"
					let p1 = parteTelefone.length - 5; // 4
					if (p1 > 0) { // true (tamanho suficiente pra por o tracinho)
						parteTelefone = parteTelefone.slice(0, p1 + 1) + "-" + parteTelefone.slice(p1 + 1); // "9996-0348"
					}
					resultado += "(" + parteDDD + ") " + parteTelefone;
				} else {
					if (parteDDI == "55") {
						// Pais Brasil, mas sem espaco:
						let parteDDD = mkt.apenasNumeros(parteDDDTelefone).slice(0, 2); // "48"
						let parteTelefone = mkt.apenasNumeros(parteDDDTelefone).slice(2); // "999680348"
						let p1 = parteTelefone.length - 5; // 4
						if (p1 > 0) { // true (tamanho suficiente pra por o tracinho)
							parteTelefone = parteTelefone.slice(0, p1 + 1) + "-" + parteTelefone.slice(p1 + 1); // "9996-0348"
						}
						resultado += "(" + parteDDD + ") " + parteTelefone;
					} else {
						// Sem espaco e não é 55 
						resultado += mkt.apenasNumeros(parteDDDTelefone); // "+54 48999680348" 
					}
				}
			} else {
				// Sem +, padrão nacional BR
				if ((mkt.apenasNumeros(str).startsWith("55")) && (mkt.apenasNumeros(str).length >= 12)) { // "55 48 99968-0348"
					// Se iniciar com 55, esse 55 pode ser Brasil / Rio Grande do Sul.
					// Remove 55 do Brasil se for tamanho >= 12. (12/13)
					let temp = str.trim();
					let pos = temp.indexOf("55");
					resultado = "+55 " + mkt.mascarar(temp.slice(pos + 2), mkt.a.util.telefone_ddd[0]);
				} else {
					resultado = mkt.mascarar(str, mkt.a.util.telefone_ddd[0]);
				}
			}
		} else {
			mkt.w("mascaraTelefoneDDI() - Parametro precisa ser string: ", mkt.classof(texto));
		}
		if (resultado == "") resultado = texto;
		if (mkt.apenasNumeros(resultado).length > 13) resultado = resultado.slice(0, resultado.length - 1);
		mkt.l("Tel DDI: ", texto, " -> ", resultado);
		return resultado;
	}

	// ============================ TOOLS e JS HELPERS ================================ \\
	// ================================================================================= \\

	static contem = (strMaior: string, strMenor: string): boolean => {
		// Comparardor de string CONTEM
		strMaior = mkt.removeEspecias(strMaior).toLowerCase();
		strMenor = mkt.removeEspecias(strMenor).toLowerCase();
		return (strMaior.includes(strMenor));
	};

	static like = (strMenor: string, strMaior: string): boolean => {
		// Comparardor de string LIKE
		let result = false;
		// Apenas Numeros e Letras está presente,
		// pois se utilizar str.match(),
		// não pode conter os caracteres reservados do regex.

		// RemoveEspeciais já inclui apenasNumerosELetras.
		let rmMaior = mkt.removeEspecias(strMaior.toLowerCase().trim());
		let rmMenor = mkt.removeEspecias(strMenor.toLowerCase().trim());
		if (rmMaior.match(rmMenor)) {
			result = true;
		}

		// Desabilitei pois já estou removendo os especiais em cima. e a função precisa ser rápida.
		// Internacionalizador de comparação... (Galês CH e DD e Latin ä))
		// let likeMatcher = new Intl.Collator(undefined, {
		// 	sensitivity: "base",
		// 	ignorePunctuation: true,
		// }).compare;
		// if (likeMatcher(strMaior, strMenor) === 0) {
		// 	result = true;
		// }

		return result;
	};

	static classof = (o: any) => {
		// Identifica a classe do argumento informado.
		let nomeClasse = Object.prototype.toString.call(o).slice(8, -1);
		// Exceção, apenas quando "Number" converter os NaN pra "NaN".
		if (nomeClasse == "Number") {
			if (o.toString() == "NaN") {
				nomeClasse = "NaN";
			}
		};
		return nomeClasse;
	};

	static clonar = (i: any) => {
		// Clona com a técnica de montar e desmontar string.
		return mkt.parseJSON(mkt.stringify(i));
	};

	static ordenar = (array: object[], nomeProp: string | null, sortDir: any) => {
		// Efetua o ordenamento do array informando a propriedade e a direção (0,1,2)
		if (nomeProp) {
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
			if (!mkt.a.contaOrdena) { mkt.a.contaOrdena = 0; }
			mkt.a.contaOrdena++;
			// 1 - Decrescente
			if (sortDir === 1) {
				array = array.reverse();
			} else if (sortDir === 2) {
				// 2 - Toogle 
				if (mkt.a.contaOrdena % 2 == 0) {
					array = array.reverse();
				}
			}
		}
		return array;
	};

	static toBooleanOA = (oa: object | object[]) => {
		// Converte (OBJ / ARRAY) Limpar Nulos e Vazios
		let toBoolean_Execute = (o: any) => {
			for (let propName in o) {
				let comparado = o[propName as keyof typeof o]?.toString()?.toLowerCase();
				if (comparado == "true") {
					o[propName as keyof typeof o] = true;
				}
				if (comparado == "false") {
					o[propName as keyof typeof o] = false;
				}
			}
			return o;
		}
		return mkt.aCadaObjExecuta(oa, toBoolean_Execute);
	};

	static limparOA = (oa: object | object[]) => {
		// Converte (OBJ / ARRAY) Limpar Nulos e Vazios
		let limparO_Execute = (o: any) => {
			for (let propName in o) {
				if (
					o[propName as keyof typeof o] === null ||
					o[propName as keyof typeof o] === undefined ||
					o[propName as keyof typeof o] === "undefined"
				) {
					delete o[propName as keyof typeof o];
				}
			}
			return o;
		}
		return mkt.aCadaObjExecuta(oa, limparO_Execute);
	};

	static limparFull = (sub: object | object[]) => {
		// Converte (OBJ / ARRAY) Limpar Nulos e Vazios
		return mkt.aCadaSubPropriedade(sub, (v: any, i: any, a: any) => {
			if (v === null || v === undefined || v === "" || v === "undefined") {
				delete a[i];
			}
		});
	};

	static aCadaSubPropriedade = (OA: any, funcao: Function | null = null, exceto: string = "Object") => {
		// Executa a FUNCAO em todas as propriedades deste OA. Inclusive Obj.Obj... (Matriz de Dados)
		let c = 0;
		for (let a in OA) {
			if (mkt.classof(OA[a]) != exceto) {
				if (funcao) {
					funcao(OA[a], a, OA);
				}
			}
			c++;
			// Se o atual é objeto, itera internamente
			if (mkt.classof(OA[a]) == "Object") {
				c += mkt.aCadaSubPropriedade(OA[a], funcao, exceto);
			}
		}
		return c;
	};

	static aCadaObjExecuta = (oa: object | object[], func: any): object | object[] => {
		// Verifica se ARRAY ou OBJETO e executa a função FUNC a cada objeto dentro de OA.
		if (Array.isArray(oa)) {
			for (let i = 0; i < oa.length; i++) {
				func(oa[i]);
			}
		} else {
			func(oa);
		}
		return oa;
	};

	static aCadaElemento = (query: any, fn: Function): any[] => {
		// A cada elemento encontrado pelo QAll executa a funcao
		let elementos = mkt.QAll(query);
		elementos.forEach((e: any) => {
			fn(e);
		});
		// Sempre retorna uma array por caus do QAll
		return elementos;
	};

	static parseJSON = (t: any, removeRaw: boolean | number | null = false) => {
		// Se for um JSON válido. Retorna o objeto, se não null.
		if (removeRaw) {
			if (mkt.classof(t) == "String") {
				t = t.removeRaw(removeRaw);
			}
		}
		if (t === "") return ""; // Vazio
		if (mkt.isJson(t)) {
			return JSON.parse(t);
		} else {
			mkt.w("JSON Inválido: Não foi possível converter o JSON.");
			return null;
		}
	};

	static stringify = (o: any): string => {
		// Converte o Objeto em String JSON, e aproveita e já remove alguns caracteres de controle.
		return JSON.stringify(o)
			?.replaceAll("\n", "")
			?.replaceAll("\r", "")
			?.replaceAll("\t", "")
			?.replaceAll("\b", "")
			?.replaceAll("\f", "")
		//?.replaceAll('&', "&amp;") // Post C# não identifica os campos do JSON
		//?.replaceAll('"', "&quot;")
		//.replaceAll("'", "&#39;");
	};

	static clicarNaAba = (e: HTMLAnchorElement) => {
		// Funcionalidade de clicar na aba e trocar a classe ativo
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
	};

	static Workers = (numWorkers: number = navigator.hardwareConcurrency || 5) => {
		// POOL de Workers e funções de comunicação.
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
			mkt.a.wpool = new WorkerPool(numWorkers, workerBlob);
			r(mkt.a.wpool);
		});
	};

	static addTask = (msg: any, numWorkers: number | undefined = undefined) => {
		// WORKERS: Atalho de tarefa. Já constroi se necessário
		// mkt.addTask({ k: "MKT_INCLUDE", v: ["a","b"], target: "a" }).then(r=>{mkt.l("Main Recebeu: ",r)})
		return new Promise((r) => {
			if (!mkt.a.wpool) {
				mkt.Workers(numWorkers).then(() => {
					r(mkt.a.wpool.addTask(msg));
				});
			} else {
				r(mkt.a.wpool.addTask(msg));
			}
		});
	};

	static removeAcentos = (s: string): string => {
		if (s == null) return "";
		// Remove acentos e depois chama Apenas Números e Letras.
		s = s.toString();
		let r = "";
		let sS = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
		let sN = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
		for (let p = 0; p < s.length; p++) {
			let pSS = sS.indexOf(s.charAt(p)); // <= Procura
			if (pSS != -1) {
				r += sN.charAt(pSS); // Substitui mesma posicao
			} else {
				r += s.charAt(p);
			}
		}
		return r;
	};

	static removeEspecias = (s: string): string => {
		if (s == null) return "";
		// Remove acentos e depois chama Apenas Números e Letras.
		s = s.toString();
		return mkt.apenasNumerosLetras(mkt.removeAcentos(s));
	};

	static removerAspas = (s: any) => {
		// Converte as aspas simples e duplas.
		if (mkt.classof(s) == "String") {
			s = s.replaceAll('"', "&quot;");
			s = s.replaceAll("\'", "&#39;");
		}
		return s;
	};

	static apenasNumeros = (s: string | number = ""): string => {
		if (s == null) return "";
		// Ignora qualquer outro caracter além de Numeros
		return s.toString().replace(/(?![0-9])./g, "");
	};

	static apenasLetras = (s: string = ""): string => {
		if (s == null) return "";
		// Ignora qualquer outro caracter além de Letras formato ocidental
		return s.replace(/(?![a-zA-Z])./g, "");
	};

	static apenasNumerosLetras = (s: string = ""): string => {
		if (s == null) return "";
		// Ignora qualquer outro caracter além de Numeros e Letras formato ocidental
		return s.replace(/(?![a-zA-Z0-9])./g, "");
	};

	static nodeToScript = (node: any) => {
		// Recria o node SCRIPT dentro de uma tag SCRIPT para o eval()
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
				mkt.nodeToScript(children[i]);
			}
		}
		return node;
	};

	static isInside = (e: any, container: any) => {
		// Retorna o elemento está dentro do container.
		// Similar ao closest, mas itera sobre os objetos em vez do query.
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
			mkt.w("isInside() requer ao menos o Elemento: ", e, " Container: ", container);
		}
		return resultado;
	};

	static isJson = (s: any): boolean => {
		// Se conseguir efetuar o parse sem erros, então é um JSON
		// if (mkt.classof(s) == "String") {
		// 	s = s.removeRaw();
		// }
		try {
			JSON.parse(s);
		} catch (e) {
			return false;
		}
		return true;
	};

	static allParentOffset = (e: any) => {
		let conta = 0;
		let last = null;
		while (e != null) {
			e = e.offsetParent;
			if (e) {
				last = e;
				conta += e.offsetTop;
			} else {
				break;
			}
		}
		if (last?.tagName == "BODY") {
			return 0;
		} else {
			return conta;
		}
	}

	static Reposicionar = (e: any, largura: boolean | null = null) => {
		// REPOSICIONA o elemento E abaixo do elemento anterior.
		// Precisa de position: fixed;
		// Atenção: Essa função precisa ser rápida.
		// Redimenciona e Reposiciona a lista durante focus ou scroll.
		let eAnterior = e.previousElementSibling;
		// let oDinBloco = eAnterior.getBoundingClientRect();
		// let oDinList = e.getBoundingClientRect();
		//mkz = e;
		// let apoff = mkt.allParentOffset(eAnterior);
		// TAMANHO (min e max with baseado no pai)
		if (largura) {
			e.style.minWidth = (eAnterior.offsetWidth - 3) + "px";
			e.style.maxWidth = (eAnterior.offsetWidth - 3) + "px";
		}
		// mkt.l("apoff", apoff);
		// if (apoff <= 0) {
		// POSICAO e FUGA em Y (em baixo)
		// Lista = Bloco Fixed Top + Altura do Pai;
		// let novaPos = oDinBloco.top + oDinBloco.height;

		// SE PosicaoAtual + AlturaAtual estiver na tela
		// if ((novaPos + oDinList.height) <= window.innerHeight) {
		// mkt.l({
		// 	"E": oDinBloco,
		// 	"L": oDinList,
		// 	"E AllOff": mkt.allParentOffset(eAnterior),
		// 	"L AllOff": mkt.allParentOffset(e),
		// 	"ATop": oDinBloco.top,
		// 	"AAlt": oDinBloco.height,
		// 	"WHeight": window.innerHeight,
		// 	"NovaPos": novaPos + "px",
		// 	"offsetHeight": eAnterior.offsetHeight,
		// })
		// 		e.style.left = (oDinBloco.x) + "px";
		// 		e.style.top = novaPos + "px";
		// 		e.style.bottom = null;
		// 	} else {
		// 		e.style.top = null;
		// 		e.style.bottom = "0px";
		// 	}
		// } else {
		// 	e.style.bottom = null;
		// }
		// FUGA em Y (em cima)
		// if (oDinBloco.top <= 0) {
		// 	e.classList.add("oculto");
		// } else {
		// 	e.classList.remove("oculto");
		// }

		// Popper
		if (mkt.a.poppers.get(e) == null) {
			mkt.a.poppers.set(e, Popper.createPopper(
				eAnterior,
				e,
				{
					placement: "bottom-start",
					strategy: "fixed",
					modifiers: [],
				}
			));
		}
	};

	static BoolToSimNaoSOA = (soa: object | object[] | string) => {
		// Converter (OBJ / ARRAY) Formato Booleano em Sim/Não
		function BoolToSimNaoOA_Execute(o: any) {
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
		if (mkt.classof(soa) == "String") {
			if (soa.toString().toLowerCase() == "true") {
				soa = "Sim";
			}
			if (soa.toString().toLowerCase() == "false") {
				soa = "N&atilde;o";
			}
			return soa;
		}
		return mkt.aCadaObjExecuta(soa as object | object[], BoolToSimNaoOA_Execute);
	};

	static formatadorDeTexto = (texto: string) => {
		// Converte Tags como [b] e [/b] em <b> e </b>
		// Impede que o usuário faça uso do html de forma descontrolada.
		return texto
			.replaceAll("[b]", "<b>")
			.replaceAll("[/b]", "</b>");
	}

	static eToText = (query: any) => {
		// - Pega o Valor ou Inner do elemento e as classes,
		// - Remove o Elemento
		// - Coloca o conteudo dentro duma Div
		// - Mantem as classes
		let e = mkt.Q(query);
		let v = "";
		let classes = "";
		let div = document.createElement("div");
		if (e) {
			let ePai: any = e.parentElement;
			classes = e.classList.toString();
			if (mkt.classof(e) == "HTMLTextAreaElement") {
				v = e.innerHTML;
			}
			if (mkt.classof(e) == "HTMLInputElement") {
				v = e.value;
			} else if (mkt.classof(e) == "mkSelElement") {
				v = e.values.join(", ");
			}
			div.innerHTML = v;
			div.setAttribute("class", classes);
			ePai?.insertBefore(div, ePai?.children[Array.from(ePai?.children).indexOf(e) + 1]);
			e.remove();
			return div;
		}
		return null;
	}

	static getEFromNames = (arrayNames = [], classe = "*") => {
		if (mkt.classof(arrayNames) == "Array") {
			let queries: any = [];
			arrayNames.forEach((e) => {
				queries.push(mkt.Q(classe + "[name='" + e + "']"));
			})
			return queries;
		} else {
			mkt.w("getEFromNames() - Requer uma array de nomes: ", mkt.classof(arrayNames));
			return [];
		}
	}

	static uuid = () => {
		// Padrão UUIDV4 - Gerador de identificador unico
		return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) => { // c = String
			return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
		});
	}

	static cursorFim = (e: any) => {
		// Move o cursor para o fim do VALUE do elemento.
		let len = e.value.length;
		mkt.wait(1).then(r => {
			e.setSelectionRange(len, len);
		})
	}

	static geraObjForm = (form: any, bool = false) => {
		// Gerar Objeto a partir de um Form Entries
		if (mkt.classof(form) != "Object") {
			// Se vier o Elemento Form / o Query do Form
			form = mkt.Q(form);
		}
		let rObjeto: any = mkt.limparOA(Object.fromEntries(new FormData(form).entries()));
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
			Array.from(form.querySelectorAll("mk-sel")).forEach((mk: any) => {
				// rObjeto[mk.name] = mk.value;
				mkt.setV(mk.name, mk.value, rObjeto);
			});
			// Aqui apenas coleta os mkBot que foram modificados pelo usuário.
			Array.from(form.querySelectorAll("mk-bot.changed")).forEach((mk: any) => {
				// rObjeto[mk.name] = mk.value;
				mkt.setV(mk.name, mk.value, rObjeto);
			});
		}

		// rObjeto = mkt.setVAll(rObjeto);
		// mkt.gc("Objeto Gerado: ");
		// mkt.w(rObjeto);
		// mkt.ge();
		if (bool) {
			rObjeto = mkt.toBooleanOA(rObjeto);
		}
		mkt.limparFull(rObjeto);
		return rObjeto;
	}

	static QScrollTo = (query: HTMLElement | string = "body") => {
		// Move o Scroll da janela até o elemento
		let temp = mkt.Q(query) as HTMLElement;
		let distTopo = temp.offsetTop;
		window.scrollTo({
			top: distTopo,
			behavior: "smooth",
		});
		return temp;
	}

	static GetParam = (name: string | null = null, url: string | null = null) => {
		// Coleta o valor do parametro da url.
		if (!url) url = document.location.toString();
		if (name != null) {
			return new URL(url).searchParams.get(name);
		} else {
			return new URL(url).searchParams.toString();
		}
	}

	static isVisible = (e: HTMLElement) => {
		// Verifica se o elemento está no dom e se está com tamanho e display visivel.
		if (mkt.isInsideDom(e)) {
			// Está no DOM, mas se estiver
			if (!mkt.isOculto(e)) {
				// Aqui não verifica se está dentro da viewport.
				return true;
			};
		}
		return false;
	}

	static isOculto = (e: HTMLElement) => {
		// Verifica se está com display none (oculto) ou com tamanho zerado (mkSecreto)
		e = mkt.Q(e);
		// Se estiver com display none, vai zerar o Width.
		return !(e.offsetWidth > 0 || e.offsetHeight > 0)
	}

	static isInsideDom = (e: HTMLElement) => {
		// Retorna true se estiver dentro de HTML
		return mkt.Q(e).closest("html") ? true : false;
	}

	// (gerarDownload) - Entrou em desuso
	// static gerarDownload = (
	// 	blob: any,
	// 	nomeArquivo: string = "Arquivo.zip"
	// ) => {
	// 	// Funcção que recebe os dados de um arquivo e executa um Download deste dados.
	// 	const fileUrl = URL.createObjectURL(blob);
	// 	const link = document.createElement("a");
	// 	link.href = fileUrl;
	// 	link.download = nomeArquivo;
	// 	link.click();
	// 	URL.revokeObjectURL(fileUrl);
	// 	return nomeArquivo;
	// }

	static downloadData = (
		base64: any,
		nomeArquivo: string = "Arquivo"
	) => {
		// Função que recebe um Base64 e solicita pra download.
		const link = document.createElement("a");
		link.href = base64;
		link.download = nomeArquivo;
		link.click();
		return nomeArquivo;
	}

	static onlyFloatKeys = (ev: KeyboardEvent) => {
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
	}

	static eventBlock = (ev: Event) => {
		// Bloqueios de eventos especificos (varios, exemplo: onContextMenu)
		mkt.w("Negado", ev);
		ev.preventDefault();
	}

	static selecionarInner = (e: HTMLElement) => {
		// Seleciona texto do elemento
		if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(e);
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	}

	static formatarNumValue = (e: HTMLInputElement): void => {
		// 123,45 (2 casas pos conversao float)
		e.value = mkt.numToDisplay(e.value);
	}

	static fileReader = async (arquivo: any, eventos: Function) => {
		// File API
		// Recebe e Retorna o file, mas seta propriedade b64.
		// Durante o processo retorna os eventos no "eventos"
		return new Promise((r) => {
			let leitor = new FileReader();
			let gatilhos = (event: ProgressEvent) => {
				// Tratamento dos Eventos durante Leitura
				if (event.type == "error") {
					mkt.erro("fileReader() - Erro: ", event);
					r(null);
				} else if (event.type == "loadend") {
					arquivo.b64 = leitor.result;
					r(arquivo);
				}
				// Evento no PRIMEIRO parametro.
				// 0-100% carregamento no SEGUNDO parametro.
				if (eventos) eventos(event, Math.trunc((event.loaded / event.total) * 100));
			};
			if (arquivo) {
				if (arquivo.name != "") {
					// Possibilidades de eventos e Início da leitura
					leitor.addEventListener("loadstart", gatilhos);
					leitor.addEventListener("progress", gatilhos);
					leitor.addEventListener("error", gatilhos);
					leitor.addEventListener("abort", gatilhos);
					leitor.addEventListener("load", gatilhos);
					leitor.addEventListener("loadend", gatilhos);
					leitor.readAsDataURL(arquivo);
				} else {
					mkt.l("fileReader() - Nome do arquivo necessário: ", arquivo.name);
					r(null);
				}
			} else {
				mkt.w("fileReader() - Arquivo Nulo: ", arquivo);
				r(null);
			};

		});
	}

	static getModelo = (array: any) => {
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
	}

	static getExclusivos = async (array: any) => {
		let res: any = await mkt.addTask({ k: "Exclusivos", v: array });
		return res.v;
	}

	static encheArray = (
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
	}

	static encheArrayUltimos = (
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
	}

	static fase = (possiveis: number[], config: any) => {
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
					if (await mkt.regrasValidas(".modalFase" + this.atual)) {
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
	}

	static mkInclude = async () => {
		return new Promise((r) => {
			mkt.QAll("body *").forEach(async (e: HTMLElement) => {
				let destino = e.getAttribute("mkInclude");
				if (destino != null) {
					//mkt.l("Incluindo: " + destino);
					let p = await mkt.get.html({ url: destino, quiet: true });
					if (p.retorno != null) {
						e.innerHTML = p.retorno;
						//mkt.nodeToScript(mkt.Q(".conteudo"));
					} else {
						mkt.l("Falhou ao coletar dados");
					}
					r(p.retorno);
				}
			});
		});
	}

	static capitalize = (string: string): string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	static vibrar = async (tipo: boolean | null) => {
		// Funcionalidade de vibrar celular baseado no tipo informado.
		if (tipo === false) {
			navigator.vibrate([100, 30, 100, 30, 100]); // 3 tempos curtos com intervalo representando: "Não, Não, Não"
		} else if (tipo === true) {
			navigator.vibrate([300]); // 3 tempos sem intervalo representando: "Efetivado"
		} else {
			navigator.vibrate([200, 50, 200]) // 2 Tempos seguidos representando: "Talvez"
		}
	};

	static Terremoto = (e: any = null): void => {
		e = mkt.Q(e);
		// Efeito de terremoto no elemento
		if (e) {
			e.classList.add("mkTerremoto");
			mkt.wait(500).then(r => {
				e.classList.remove("mkTerremoto");
			});
		}
	};

	// DEPRECATED - Utiliza em Fichas (Substituir por Faseador)
	static fUIFaseUpdateLinkFase = () => {
		// FUNCAO PARA ATUALIZAR OS LINKS DE FASES
		mkt.QAll("ul.mkUlFase li a").forEach((e: HTMLAnchorElement) => {
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
	}


	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//  FIM DAS FUNCÕES ESTÁTICAS       \\
	//___________________________________\\
} // <= FIM CLASSE MKT


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//  DEFINE PROPERTY                 \\
//___________________________________\\

Object.keys(mkt).forEach((n) => {
	// Excessões
	if (!mkt.a.definePropertyExceptions.includes(n)) {
		Object.defineProperty(mkt, n, { enumerable: false, writable: false, configurable: false });
	}
});

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//  Web Component MkSel - Seletor   \\
//___________________________________\\
class mkSel extends HTMLElement {
	config: any = {
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
		scrollcharge: true, // Padrao é true: Com scroll carregando
		selapenas: 1,
		_data: new Map(),
		opcoes: "", // String das opções
		value: "", // String dos selecionados
		url: "",
		selecionados: new Map(),
		changed: false,
		fail: 0,
		geraInputEvent: () => {
			// Gera o Evento
			this.dispatchEvent(new Event("input"));
			this.config.changed = true;
		},
		pesquisaKeyDown: (ev: KeyboardEvent) => {
			let isNegado = false;
			//mkt.l(ev);
			if (ev.key == "Escape") {
				this.config.eK.blur();
			}
			if (ev.key == "ArrowUp" || ev.key == "ArrowDown" || ev.key == "Enter") {
				isNegado = true;

				let eListItem;
				let array: any = Array.from(this.config.eUL.children).filter((e: any) => {
					return e.style.display != "none";
				});
				// Procura o atual alvo move
				let eAlvo = array.find((e: any) => e.getAttribute("m") == "1");
				Array.from(this.config.eUL.children).forEach((e: any) =>
					e.removeAttribute("m")
				);
				// Se é enter, tenta selecionar o alvo.
				if (ev.key == "Enter") {
					if (eAlvo) {
						this.config.mecanicaSelecionar(eAlvo.getAttribute("k"));
					}
					if (this.config.selapenas == 1) {
						this.config.eK.blur();
					} else {
						this.aoFocus();
					}
				}
				if (ev.key == "ArrowUp") {
					let ultimo = array[array.length - 1];
					if (eAlvo) {
						let indexProximo = array.indexOf(eAlvo) - 1;
						if (array[indexProximo]) {
							eListItem = array[indexProximo];
						} else {
							eListItem = ultimo;
						}
					} else {
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
						} else {
							eListItem = array[0];
						}
					} else {
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
			} else {
				if (this.value) {
					let obj = this.value.split(",");
					//mkt.l("Obj Value: ", obj);
					if (obj) {
						let map: any = obj.map(s => { return [s.toString(), ""] });
						this.config.selecionados = new Map(map);
						this.config.updateSelecionadosValues();
					}
				}
			}
		},
		mecanicaSelecionar: (novoK: any) => {
			if (novoK != null) {
				let novoV = this.config._data.get(novoK);
				//mkt.l(this.config.name, " - novoK: ", novoK, " novoV: ", novoV, ", Data: ", this.config._data);
				if (mkt.classof(this.config.selapenas) == "Number") {
					//mkt.l("Setado K: ", novoK, " V:", novoV, " Selecoes: ", this.config);
					if (this.config.selapenas == 1) {
						// UNICA SELEÇÃO
						this.config.selecionados = new Map();
						this.config.selecionados.set(novoK?.toString(), novoV?.toString());
						this.value = novoK;
						this.config.updateSelecionadosValues();
						this.config.geraInputEvent();
					} else if ((this.config.selapenas > 1) || (this.config.selapenas < 0)) {
						// MULTI SELEÇÃO
						let jaSelecionado = false;
						// Verifica já possui um selecionado. (Para saber se vai adicionar ou remover)
						if (this.config.selecionados.has(novoK)) {
							jaSelecionado = true;
						};
						if (jaSelecionado) {
							// Remove valor da lista selecionada
							this.config.selecionados.delete(novoK);
						} else {
							// Verifica se é possivel selecionar mais (Se estiver negativo, pode selecionar infinito)
							if (this.config.selecionados.size < this.config.selapenas || this.config.selapenas < 0) {
								// Acrescenta valor
								this.config.selecionados.set(novoK?.toString(), novoV?.toString());
							}
						}

						// Quando estiver vazio, reseta o campo.
						// Seta o valor no campo de input
						if (this.config.selecionados.size == 0) {
							this.value = "";
						} else {
							this.value = [...this.config.selecionados.keys()].join(",");
						}
						this.config.updateSelecionadosValues();
						this.config.geraInputEvent();

					}
				} else {
					mkt.w("mkSelElement - atributo 'selapenas' precisa ser número: ", mkt.classof(this.config.selapenas));
				}
			} else {
				// Acredito que é possível clicar em alguns pixels fora da área do LI Element
				//mkt.w("mkSelElement", this.config.name, "Erro de seleção: K: ", novoK);
			}
			this.config.updateSelecionadosValues();
		},
		moveScrollList: (este: HTMLDivElement, num: number, op: boolean) => {
			op ? este.classList.add("move") : este.classList.remove("move");
			this.config.scrollRecursiveMove(este, (4 * num));
		},
		scrollRecursiveMove: (este: HTMLDivElement, num: number) => {
			this.config.eList.scrollTop = this.config.eList.scrollTop + num;
			if (este.classList.contains("move")) {
				mkt.wait(20).then(r => {
					this.config.scrollRecursiveMove(este, num);
				})
			}
		},
		updateSelecionadosValues: () => {
			// A cada chave no selecionado, seta o valor correspondente no opções
			[...this.config.selecionados.keys()].forEach(k => {
				this.config.selecionados.set(k, this.opcoes.get(k));
			});
		},
		checkMaisLinhas: () => {
			// Verifica se o tamanho e altura estao corretos, pra puxar mais linhas e já solicita.
			let altura = this.config.eList.scrollHeight - this.config.eList.offsetHeight - 10; // Reduz a altura total para começar a baixar um pouco antes.
			//mkt.l("Atual", this.config.eList.scrollTop, " Altura:", altura);
			if (this.config.eList.scrollTop >= altura) {
				this.maisLinhas(this.config.populado, 10);
			}
		},
		set: (key: string, value: any) => {
			this.config._data.set(key, value);
			this.setAttribute("opcoes", mkt.stringify([...this.config._data]));
		},
		del: (key: string) => {
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
</div>`
		// GET / SETS Iniciais
		this.shadowRoot?.append(template.content);
		this.config.eK = this.shadowRoot?.querySelector(".k");
		this.config.eList = this.shadowRoot?.querySelector(".lista");
		this.config.eUL = this.shadowRoot?.querySelector(".lista ul");
		this.config.rolaCima = this.shadowRoot?.querySelector(".rolaCima");
		this.config.rolaBaixo = this.shadowRoot?.querySelector(".rolaBaixo");
		this.config.svg = this.shadowRoot?.querySelector(".arrowAbreFecha");
		if (this.getAttribute("scrollcharge")) this.config.scrollcharge = this.getAttribute("scrollcharge")?.toString().toLowerCase() != "false";
		if (this.getAttribute("vazio")) this.config.vazio = this.getAttribute("vazio");
		if (this.getAttribute("selapenas")) this.config.selapenas = Number(this.getAttribute("selapenas"));
		if (this.getAttribute("name")) this.config.name = this.getAttribute("name");


		// Não precisa inicializar tudo por aqui pois quando tem opcoes, já gera get no opcoes.
		this.atualizarDisplay();

		// Eventos
		this.config.eK.onfocus = () => {
			this.setAttribute("focused", "");
			this.aoFocus();
		};
		this.config.eK.onblur = () => {
			this.aoBlur();
		};
		this.config.eK.oninput = (ev: Event) => {
			ev.stopPropagation(); // Input interno propaga pro elemento mkSelElement
			this.aoInput();
		};
		this.config.eK.onkeydown = (ev: KeyboardEvent) => {
			this.config.pesquisaKeyDown(ev);
		};
		mkt.Ao("mousedown", this.config.eUL, (e: any, ev: Event) => {
			this.selecionar(ev); // Não vai direto pra mecanicaSelecionar
		});
		this.config.svg.onclick = (ev: Event) => {
			ev.stopPropagation();
			this.config.eK.focus();
		};
		this.config.rolaBaixo.onmouseenter = (ev: Event) => {
			this.config.moveScrollList(this.config.rolaBaixo, 1, true);
		};
		this.config.rolaBaixo.onmouseout = (ev: Event) => {
			this.config.moveScrollList(this.config.rolaBaixo, 1, false);
		};
		this.config.rolaCima.onmouseenter = (ev: Event) => {
			this.config.moveScrollList(this.config.rolaCima, -1, true);
		};
		this.config.rolaCima.onmouseout = (ev: Event) => {
			this.config.moveScrollList(this.config.rolaCima, -1, false);
		};
		// Seguir o Elemento durante o scroll e resize
		document.addEventListener("scroll", (event) => {
			mkt.Reposicionar(this.config.eList, false);
		});
		window.addEventListener("resize", (event) => {
			mkt.Reposicionar(this.config.eList, true);
		});
		this.config.eList.addEventListener("scroll", () => {
			this.config.checkMaisLinhas();
		});
	} // Fim Construtor mkSel

	// Funçao que refaz a lista, Coleta, Popula, Seleciona e Exibe o selecionado.
	forceUpdate() {
		// Durante o update, o usuário não deveria estar com o seletor aberto.
		this.removeAttribute("focused");
		// Caso o opções contem uma string JSON
		// mkt.w({
		// 	"Nome": this.name,
		// 	"Opções": this.config.opcoes,
		// 	"Value": this.value,
		// 	"isJson?": mkt.isJson(this.config.opcoes),
		// 	"colect": mkt.parseJSON(this.config.opcoes),
		// 	"classOfColect": mkt.classof(mkt.parseJSON(this.config.opcoes)),
		// })
		if (mkt.isJson(this.config.opcoes)) {
			let colect = mkt.parseJSON(this.config.opcoes);
			if (mkt.classof(colect) == "Array") {
				if (mkt.classof(colect[0]) == "Array") {
					//Formato Map
					//[["","Todos"],["False","N\u00E3o"],["True","Sim"]]
					colect.forEach((v: any, i: any, a: any) => {
						a[i][0] = a[i][0].toString().replaceAll(",", ""); // Proibido Virgula na Key
						a[i][1] = a[i][1].toString();
						//mkt.l("v: ", v, " i: ", i, " a: ", a)
					});
				} else {
					if (mkt.classof(colect[0]) == "Object") {
						// Formato KV
						//[{"k":"","v":"Todos"},{"k":"False","v":"N\\u00E3o"},{"k":"True","v":"Sim"}]
						colect = colect.map((r: any) => { return [r.k?.toString().replaceAll(",", ""), r.v?.toString()]; });
					}
					else {
						colect = null;
					}
				}
			}
			try {
				this.config._data = new Map(colect);
			} catch (e) {
				mkt.erro("mk-sel > Opções precisa ser Array. Recebido:", mkt.classof(colect), colect);
			}
		} else {
			this.config._data = new Map(); // Inicializa sem opcoes
		}
		this.config.eUL.classList.add("topoSel"); // <= Classe pra subir os selecionados
		// Aqui Seleciona inicialmente ou Seleciona novamente ao trocar o Opcoes.
		if (mkt.classof(this.config.selapenas) == "Number") {
			if (this.config.selapenas == 1) {
				this.config.selecionados = new Map();
				this.config._data.forEach((v: string, k: string) => {
					if (k == this.value) {
						this.config.mecanicaSelecionar(k);
					}
				});
			} else {
				// mkt.w({
				// 	"Nome": this.name,
				// 	"Data": this.config._data,
				// 	"Value": this.value,
				// 	"isJson?": mkt.isJson(this.value),
				// 	"Colect": mkt.parseJSON(this.value),
				// 	"ClassOf Colect": mkt.classof(mkt.parseJSON(this.value)),
				// })
				// Multi seletor guarda um json no value.
				if (mkt.isJson(this.value)) {
					let colect: any = mkt.parseJSON(this.value);
					if (mkt.classof(colect) == "Array") {
						let map = new Map(mkt.parseJSON(this.value).map((a: any) => { return [a?.toString()] }));
						this.config.selecionados = map;
						this.config.updateSelecionadosValues();
					} else {
						if (colect != null) {
							let array: any = this.value?.split(",").map((a: any) => { return [a?.toString()] });
							this.config.selecionados = new Map(array);
							this.config.updateSelecionadosValues();
						} else {
							this.config.selecionados = new Map(); // Inicializa sem selecionados
						}
					}
				} else {
					this.config.selecionados = new Map(); // Inicializa sem selecionados
				}
			}
		}

		// Popular Lista com opcoes atuais
		this.aoPopularLista();
		// Atualiza a lista baseado no Map da Lista e no Map de Selecionados
		this.aoAtualizaSelecionadosNaLista();
		// Atualiza o Display
		this.atualizarDisplay();
	}

	// Quando o input principal de Pesquisar recebe foco.
	aoFocus() {
		// Ao receber Foco
		// Limpa Filtro atual
		this.config.filtrado = "";
		// Limpa o Display após atualizar status.
		this.config.eK.value = "";
		// Atualiza Itens Selecionados, caso houve mudança sem atualizar.
		this.aoAtualizaSelecionadosNaLista();

		// Encontra o primeira opção selecionado
		let ePrimeiroSel: any = null;
		Array.from(this.config.eUL.children).forEach((li: any) => {
			li.style.display = ""; // Pesquisa antiga
			li.removeAttribute("cursor"); // Seta Sobe e Desce teclado
			if (li.hasAttribute("selecionado") && ePrimeiroSel == null)
				ePrimeiroSel = li;
		});

		// Faz movimento no scroll até a primeira opção selecionada
		//if (this.config.scrollcharge) {
		let primeiroOffSet = ePrimeiroSel?.offsetTop || 0;
		this.config.eList.scrollTop =
			primeiroOffSet - 120 - (this.config.eList.offsetHeight - this.config.eList.clientHeight) / 2;
		//}

		// Atualizar posição da Lista.
		mkt.Reposicionar(this.config.eList, true);
		mkt.a.poppers.get(this.config.eList).update();

		// Além do Ao do scroll, verifica mais linhas quando carregar.
		this.config.checkMaisLinhas();
	}

	// Quando sai do botão de pesquisar principal
	aoBlur() {
		// Ao perder foco
		mkt.wait(150).then(r => {
			if (document.activeElement !== this) {
				// SE REALMENTE Saiu do elemento:
				// Seta Valor do display
				this.atualizarDisplay();
				// Remove Status de focus pra sumir
				this.removeAttribute("focused");
				if (this.config.changed) {
					this.config.changed = false;
					this.dispatchEvent(new Event("change"));
				}
			}
		});
	}

	// Exibe a lista baseado no filtro de pesquisa
	async aoInput() {
		let strInputado = this.config.eK.value;
		// Quando está pesquisando, precisa estar com todas as linhas já populadas pra filtrar sobre elas
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
						let map = new Map(r.retorno)
						this.config._data = map;
						this.opcoes = map;
						this.config.eK.value = strInputado;
					}
				} else {
					mkt.w("mkSelElement - Não foi possível fazer o refill: Sem URL setada.");
				}
			}
		}

		let cVisivel = 0;
		this.config.rolaCima.style.display = "none";
		this.config.rolaBaixo.style.display = "none";
		Array.from(this.config.eUL.children).forEach((li: any) => {
			let exibe = false;
			if (mkt.like(strInputado, li.innerHTML)) {
				exibe = true;
				cVisivel++;
			}
			if (exibe) {
				li.style.display = "";
			} else {
				li.style.display = "none";
			}
		});
		if (cVisivel >= 10) {
			this.config.rolaCima.style.display = "";
			this.config.rolaBaixo.style.display = "";
		}
		mkt.Reposicionar(this.config.eList, true);
	}

	async maisLinhas(inicio: number, total: number) {
		let linha = document.createElement("template");
		linha.innerHTML = "<li k='${0}'>${1}</li>"
		let hold = document.createElement("template");
		let ate = inicio + total;
		let dados = [...this.config._data];
		// A ideia era trazer pro início os já selecionados.
		// A CADA JÁ SELECIONADO
		if (this.config.name == "multiSelecionado" || this.config.name == "staPersonalizado") {
			this.config.selecionados.keys().forEach((k: string) => {
				// Se encontrar essa chave na array de dados
				let indexof = dados.findIndex(o => { return o[0] == k });
				if (indexof >= 0) {
					dados.unshift(dados.splice(indexof, 1)[0]);
				}
			})
		}
		//
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

	// Atualiza SelecionadosMap e Popula Lista do Zero (Total/Parcial)
	async aoPopularLista() {
		//if (this.config.name == "staSelecionado") mkt.w("Popular: ", this.config.name);
		// Atualizar o Map de Selecionados (Para exibir os selecionados no início)
		this.config.convertValueToMap();
		// Reseta populados atuais
		this.config.eUL.innerHTML = "";
		this.config.populado = 0;
		if (mkt.classof(this.config._data) == "Map") {
			// SE é pra popular parcialmente pelo scroll ou total.
			if (this.config.scrollcharge) {
				await this.maisLinhas(this.config.populado, 10);
			} else {
				// Carga Completa
				await this.maisLinhas(this.config.populado, this.config._data.size);
			}


		}
	}

	// Atravéz do evento KeyDown do Enter do teclado é selecionado.
	// Atravéz do evento de MouseDown, o evento é passado o selecionar.
	selecionar(ev: Event) {
		let li: any = ev.target;
		if (li) {
			let novoK = li.getAttribute("k")
			this.config.mecanicaSelecionar(novoK);

			if (mkt.classof(this.config.selapenas) == "Number") {
				if (this.config.selapenas != 1) {
					// Mantem foco no Display, pois pode selecionar mais de um
					this.config.eK.focus();
				}
			}

			// Atualizar selecionado
			this.aoAtualizaSelecionadosNaLista();
		} else {
			mkt.w("Evento sem Target: ", ev);
		}

	}

	// Itera Lista e marca ou desmarca o/os elementos do value.
	aoAtualizaSelecionadosNaLista() {
		// Atualiza as marcações dos selecionados atuais.
		if (this.config.selapenas == 1) {
			// Value é Unico
			Array.from(this.config.eUL.children).forEach((li: any) => {
				if (this.config.selecionados.has(li.getAttribute("k"))) {
					li.setAttribute("selecionado", "");
				} else {
					li.removeAttribute("selecionado");
				}
			});
		} else {
			// Value é Multi
			Array.from(this.config.eUL.children).forEach((li: any) => {
				if (this.config.selecionados.has(li.getAttribute("k"))) {
					li.setAttribute("selecionado", "");
				} else {
					li.removeAttribute("selecionado");
				}
			});
		}
	}

	// Atualiza o selecionado Atual procurando no Map
	atualizarDisplay = async () => {
		this.classList.remove("mkEfeitoPulsar");
		let display: string | null = " -- Selecione -- ";
		if (this.config.vazio) {
			display = this.config.vazio; // Display diferenciado quando vazio == ""
		}
		if (this.config.selecionados.size != 0) {
			if (this.config.selapenas == 1) {
				// Seletor Unico que VALUE vem antes do OPCOES, fica NULL no [1]
				if (this.getFirstSelecionado?.[1]) {
					display = this.getFirstSelecionado?.[1];
				} else {
					// O que exibir?
					// - É um seletor único, mas o item selecionado está nulo.
					// - E o item selecinoado não é vazio.
					if (this.getFirstSelecionado?.[0] !== "") {
						display = null; // <= Elementos Relacionados
						// Se colocar grupo, os Elementos relacionados podem ser testados aqui
						//mkt.w(this.config.name, "Estava: ", this.getFirstSelecionado?.[0], ",", this.getFirstSelecionado?.[1])
					}
				}
			} else {
				display = `${this.config.selecionados.size} selecionados`
			}
		} else {
			if (this.config.selapenas != 1) {
				// Nenhum selecionado em um Multi Seletor.
				display = `0 selecionados`;
			}
		};
		if (!display) {
			++this.config.fail;
			// Provaveis causas externas fizeram o seletor entrar aqui.
			display = " -- Erro -- ";
			this.classList.add("mkEfeitoPulsar");
			if (this.config.fail == 2) { // Tenta trocar opções
				// mkt.w(this.config.name, "mkSel - Opção Inexistente:", this.value, ". Iniciar Refill. Tentativa: ", this.config.fail);
				// display = " -- Carregando -- ";
				// await this.refill();
				// } else if (this.config.fail == 3) {
				mkt.w(this.config.name, "mkSel - Opção Inexistente:", this.value, ". Limpeza forçada. Tentativa: ", this.config.fail);
				this.removeAttribute("value");
				// } else if (this.config.fail == 4) {
				// 	mkt.w(this.config.name, "mkSel - Opção Inexistente:", this.value, ". Limpeza falhou. Tentativa: ", this.config.fail);
			}
			if (this.config.fail < 4) { // Recarrega
				mkt.wait(20).then(r => {
					this.forceUpdate();
				})
			}

		} else {
			this.config.fail = 0;
		};
		this.config.eK.value = display;

		if (this.config._data.size <= 0) {
			//mkt.l("Seletor " + this.config.name + ": Nenhuma opção disponível: ", this.config._data.size);
			//this.config.eUL.innerHTML = ' &#45;&#45; Sem Op&#231;&#245;es &#45;&#45; ';
		}
	};

	async refill(url = null) {
		let urlExecutar = this.config.url; // Padrão a do atributo
		if (url != null) { // Se informar url
			urlExecutar = urlExecutar + url; // Url entra atrás do URL informado manualmente no atributo
		}
		if (urlExecutar) { // Apenas URL não vazia
			let r = await mkt.get.json({ url: urlExecutar });
			if (r.retorno != null) {
				//mkt.l("Retorno Refill: ", r.retorno);
				this.setAttribute("opcoes", mkt.stringify(r.retorno));
				this.dispatchEvent(new CustomEvent("refill"));
			}
		} else {
			mkt.w("mkSelElement - Não foi possível fazer o refill: Sem URL setada: ", urlExecutar);
		}
	}

	geraListaAntesDoElemento() {
		let divLabelsSelecionadas = document.createElement("ul");
		divLabelsSelecionadas.setAttribute("class", "mkSelOutDisplay");
		divLabelsSelecionadas.innerHTML = [...this.selecionadosMap.values()].map((i) => "<li>" + i + "</li>").join("");
		this.before(divLabelsSelecionadas);
		mkt.Ao("input", this, (e: mkSel) => {
			e.updateListaAntesDoElemento(divLabelsSelecionadas);
		});
	}

	updateListaAntesDoElemento(e: HTMLUListElement) {
		e.innerHTML = [...this.selecionadosMap.values()].map((i) => "<li>" + i + "</li>").join("");
	}

	// Atributos modificados no elemento
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === "disabled") {
			this.config.eK.disabled = newValue !== null;
			this.config.eK.blur();
		} else if (name === "size") {
			this.config.eK.size = newValue;
		} else if (name === "name") {
			this.config.name = newValue;
		} else if (name === "value") {
			//mkt.l(this.config.name, " Set Value: ", newValue)
			if (this.config.value != newValue) {
				this.config.value = newValue;
				// Atualizar o Map de Selecionados
				this.config.convertValueToMap();
				this.atualizarDisplay()
			}
		} else if (name === "opcoes") {
			if (this.getAttribute("opcoes")) {
				this.opcoes = this.getAttribute("opcoes");
			}
			this.removeAttribute("opcoes"); // Mantem os dados em memória
		} else if (name === "url") {
			this.url = newValue;
		} else if (name === "pos") {
			if (mkt.classof(this.config.url) == "String") {
				this.config.eK.placeholder = "Pesquisar 🔍";
				this.config.vazio = "Pesquisar 🔍";
				this.atualizarDisplay();
			} else {
				mkt.w("mkSelElement - Seletor Pós precisam de uma URL para consulta: ", this.config.url);
				this.removeAttribute("pos");
			}
		} else if (name === "refill") {
			this.removeAttribute("refill");
			if (newValue == null) { // Se removeu executa
				this.refill();
			}
		} else if (name === "scrollbarwidth") {
			this.config.eList.style.scrollbarWidth = newValue;
		} else if (name === "scrollbarcolor") {
			this.config.eList.style.scrollbarColor = newValue;
		} else if (name === "selapenas") {
			this.config.selapenas = Number(newValue);
		} else if (name === "class") {
			if (this.classList.contains("atualizar")) {
				this.classList.remove("atualizar");
				this.event;
			}
		}
	}


	// Recuperar os Selecionados
	get getFirstSelecionado() { return [...this.selecionadosMap]?.[0] || null; }
	get selecionadosMap() { return this.config.selecionados; }
	get values() { return [...this.selecionadosMap.values()]; }
	get valuesOk() { return this.values.map(i => { if (i) { return mkt.removeEspecias(i).toLowerCase() } else { return ""; } }); }
	get keys() { return [...this.selecionadosMap.keys()]; }
	// Recuperar as opções
	get opcoes() { return this.config._data; }
	// Alterar as opções
	set opcoes(text) {
		//mkt.l("SET Opcões: ", text, " Old: ", this.config.opcoes);
		if (text) {
			//mkt.w("Opções: ", text);
			if (mkt.classof(text) == "String") {
				// Mantém o JSON do último opções recebido
				this.config.opcoes = text; // Guardar JSON de OPCOES
				this.forceUpdate();
				//this.config.opcoes = text;
			} else {
				if (mkt.classof(text) == "Map") {
					// Mantém o JSON do último opções recebido
					this.config.opcoes = mkt.stringify([...text]);
					this.forceUpdate();
				} else {
					mkt.w("mkSelElement - set opcoes() - Formato inválido: ", mkt.classof(text));
				}
			}
		}
	}

	get event() { return this.config.geraInputEvent(); }

	get url() { return this.config.url; }
	set url(text) { if (text != null) this.config.url = text; }

	get size() { return this.getAttribute("size"); }
	set size(value) { if (value) this.setAttribute("size", value); }
	get disabled() { return this.hasAttribute("disabled"); }
	set disabled(value) {
		if (value) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}
	get pos() { return this.hasAttribute("pos"); }
	set pos(value) {
		if (value) this.setAttribute("pos", "");
		else this.removeAttribute("pos");
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
	set name(text) { if (text) { this.setAttribute("name", text); } }
	get [Symbol.toStringTag]() { return "mkSelElement"; }

	// Atributos sendo observados no elemento.
	static observedAttributes: Array<string> = ["disabled", "size", "value", "name", "opcoes", "url", "scrollbarwidth", "scrollbarcolor", "selapenas", "refill", "pos", "class"];
}
customElements.define("mk-sel", mkSel);

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//  Web Component MkBot - Botao PDF \\
//___________________________________\\
class mkBot extends HTMLElement {
	config: any = {
		dados: null,
		area: null,
		sobreposto: null,
		clicavel: false,
		exibirbarra: false,
	}
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
		// GET / SETS Iniciais
		this.shadowRoot?.append(template.content);
		this.config.area = this.shadowRoot?.querySelector(".area");
		this.config.sobreposto = this.shadowRoot?.querySelector(".sobreposto");

		// GET Atributos
		this.config.name = this.getAttribute("name");
		this.config.inicial = this.getAttribute("inicial");
		this.removeAttribute("inicial");
		this.config.dados = this.getAttribute("value");
		this.removeAttribute("value");
		this.config.clicavel = this.hasAttribute("clicavel");
		this.removeAttribute("clicavel");
		this.config.exibirbarra = this.hasAttribute("exibirbarra");
		this.removeAttribute("exibirbarra");
		if (this.config.inicial == null) this.config.inicial = "";
		if (this.config.dados == null) this.config.dados = "";
		this.editou("#BUILD");

	} // Fim Construtor mkBotaoValue

	editou(from: string) {
		//mkt.l("Editou " + this.name + " From: ", from)
		if (this.config.dados == "") {
			// Se editar para vazio, volta a exibir inicial
			if (this.config.inicial == "") {
				// Quando ambos estão vazio, exibe um svg
				this.config.area.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' class='imagem' part='imagem' viewBox='0 0 24 24' fill='none'><path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 12v7a2 2 0 0 1-2 2h-3m5-9c-6.442 0-10.105 1.985-12.055 4.243M21 12v-1.5M3 16v3a2 2 0 0 0 2 2v0h11M3 16V5a2 2 0 0 1 2-2h8M3 16c1.403-.234 3.637-.293 5.945.243M16 21c-1.704-2.768-4.427-4.148-7.055-4.757M8.5 7C8 7 7 7.3 7 8.5S8 10 8.5 10 10 9.7 10 8.5 9 7 8.5 7zM19 2v3m0 3V5m0 0h3m-3 0h-3'/></svg>";
			} else {
				// Se não exibe o inicial num src
				this.config.area.innerHTML = "<img class='imagem' part='imagem' src='" + this.config.inicial + "'>";
			}
		} else {
			let tipo = null;
			let retornar = "";
			let terminacao = this.config.dados.slice(this.config.dados.length - 3, this.config.dados.length).toString().toLowerCase();
			//mkt.l("mkBot - Terminação Arquivo: ", terminacao);
			// Verificar aqui se trata-se de um link ou de uma base64 direto no elemento.					
			// - Verifica se terminacao do arquivo é PDF ou OUTRO,
			if ((this.config.dados.includes("application/pdf")) || (terminacao == "pdf")) {
				tipo = "pdf";
			}

			// FORMATOS DE ARQUIVO
			if (tipo == "pdf") {
				retornar += `<embed type="application/pdf" class="imagem" part="imagem" src="${this.config.dados}`;
				if (!this.config.exibirbarra) {
					retornar += `#toolbar=0`;
				}
				retornar += `">`;
			} else {
				// Exibe um picture evitando o erro de carregamento
				retornar = `<img src="${this.config.dados}" class="imagem" alt="Imagem" onerror="this.onerror=null;this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktaW1hZ2UtYWx0IiB2aWV3Qm94PSIwIDAgMTYgMTYiPg0KICA8cGF0aCBkPSJNNyAyLjVhMi41IDIuNSAwIDEgMS01IDAgMi41IDIuNSAwIDAgMSA1IDBtNC4yMjUgNC4wNTNhLjUuNSAwIDAgMC0uNTc3LjA5M2wtMy43MSA0LjcxLTIuNjYtMi43NzJhLjUuNSAwIDAgMC0uNjMuMDYyTC4wMDIgMTN2MmExIDEgMCAwIDAgMSAxaDE0YTEgMSAwIDAgMCAxLTF2LTQuNXoiLz4NCjwvc3ZnPg==';" />`
			}
			if (!this.config.clicavel) {
				// Se entrar aquim é pra clica no botão em vez do elemento
				this.config.sobreposto.style.display = "";
			}
			// Display
			this.config.area.innerHTML = retornar;
		}
	}

	// JS Get Set
	get [Symbol.toStringTag]() { return "mk-bot"; }
	get value() {
		if (this.config.dados == null) return "";
		return this.config.dados;
	}
	set value(text) {
		if (text != null) {
			this.config.dados = text;
			this.editou("#VALUE");
			//mkt.l(this.name + " SET VALUE TO: " + text);
			this.dispatchEvent(new Event("input"));
			this.dispatchEvent(new Event("change"));
			this.classList.add("changed");
		};
	}
	get name() { return this.getAttribute("name"); }
	set name(text) { if (text) { this.setAttribute("name", text); } }
	get disabled() { return this.hasAttribute("disabled"); }
	set disabled(value) {
		if (value) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}
	// Atualizar config do Inicial
	get inicial() {
		if (this.config.inicial == null) return "";
		return this.config.inicial;
	}
	set inicial(text) {
		if (text != null) {
			this.config.inicial = text;
		}
	}

	// HTML Set
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === "value") {
			if (newValue != "" && newValue != null) {
				if (this.config.dados != newValue) {
					//mkt.l(this.config.name, " Set Value: ", newValue)
					this.value = newValue;
				}
				this.removeAttribute("value");
			}
		} else if (name === "name") {
			this.config.name = newValue;
		} else if (name === "inicial") {
			if (this.config.inicial != newValue) {
				this.config.inicial = newValue;
			}
		}
	}

	// Atributos sendo observados no elemento.
	static observedAttributes: Array<string> = ["disabled", "value", "name", "inicial"];
}
customElements.define("mk-bot", mkBot);

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   Auto Inicializar               \\
//___________________________________\\
mkt.Inicializar();



