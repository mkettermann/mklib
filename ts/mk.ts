// Transformar para uma unidade em TS:
// - $ JQuery Framework JS
// - $ Load
// - $ Mask
// - $ Print
// - $ Unobtrutive Validate (Está vinculado ao Data Annotation do C#)
// - $ LoadTemplate
// - Bootstrap Toast
// - Bootstrap Dropdown
// - Bootstrap Modal
var mkt2; // Variavel de Testes;

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			GLOBAL VARS | CONST					\\
//___________________________________\\
declare const appPath: any;

class mk {
	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			ATRIBUTOS										\\
	//___________________________________\\
	static fullDados: object[] = [];
	static exibeDados: object[] = [];
	static exibePaginado: object[] = [];
	static sortDir = "d";
	static sortBy = "";
	static paginationAtual = 1;
	static objFiltro: any = [];
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

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			TITULOS CONSTANTES					\\
	//___________________________________\\
	static t = {
		G: "GET", // Api Method GET
		P: "POST", // Api Method POST
		J: "application/json", // ContentType JSON
		H: "text/html", // ContentType HTML
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
	//			MK UTIL											\\
	//___________________________________\\

	/*----------------------------------/
	\       FUNCOES UTEIS (UTIL)       /
	/--------------------------------*/
	// Atalho para QuerySelector que retorna apenas o primeiro elemento da query.
	static Q = (query: HTMLElement | string = "body") => {
		if (query instanceof HTMLElement) return query;
		return document.querySelector(query)!;
	};

	// Atalho para QuerySelectorAll. List []
	static QAll = (query: string = "body"): Element[] => {
		return Array.from(document.querySelectorAll(query));
	};

	// Atalho para AddEventListener
	static Ao = (tipoEvento: string = "click", query: string, executar: any) => {
		// CONVERTER PARA QUERY SELECTALL pois, tem o Pesquisar que pega todos os .iConsultas
		mk.QAll(query).forEach((e) => {
			e.addEventListener(tipoEvento, () => {
				executar(e);
			});
		});
	};

	static isJson = (s: any): boolean => {
		try {
			JSON.parse(s);
		} catch (e) {
			return false;
		}
		return true;
	};

	// Verifica se ARRAY ou OBJETO e executa a função FUNC a cada objeto dentro de OA.
	static mkExecutaNoObj = (
		oa: object | object[],
		func: any
	): object | object[] => {
		if (Array.isArray(oa)) {
			for (let i = 0; i < oa.length; i++) {
				func(oa[i]);
			}
		} else {
			func(oa);
		}
		return oa;
	};

	// Converter (OBJ / ARRAY) Limpar Nulos e Vazios
	static mkLimparOA = (oa: object | object[]) => {
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
		return mk.mkExecutaNoObj(oa, mkLimparOA_Execute);
	};

	// Gerar Objeto a partir de um Form Entries
	static mkGerarObjeto = (este: any) => {
		let form: HTMLFormElement = este;
		if (typeof este != "object") {
			form = mk.Q(este) as HTMLFormElement;
		}
		let rObjeto = mk.mkLimparOA(
			Object.fromEntries(new FormData(form).entries())
		);
		console.groupCollapsed("Objeto Gerado: ");
		console.info(rObjeto);
		console.groupEnd();
		return rObjeto;
	};

	static QSet = (query: HTMLElement | string = "body", valor: any = null) => {
		if (valor != null) {
			(mk.Q(query) as HTMLInputElement).value = valor;
		} else {
			(mk.Q(query) as HTMLInputElement).value = "";
		}
		return mk.Q(query);
	};

	// Seta todos os query com os valores das propriedades informadas nos campos.
	// O nome da propriedade precisa ser compatível com o PROPNAME do query.
	static QSetAll = (
		query: string = "input[name='#PROP#']",
		o: object | null = null
	) => {
		let eAfetados = [];
		if (o != null) {
			if (typeof o == "object" && !Array.isArray(o)) {
				for (let p in o) {
					let eDynamicQuery = mk.Q(
						query.replace("#PROP#", p)
					) as HTMLInputElement;
					if (eDynamicQuery) {
						if (o[p as keyof typeof o]) {
							eDynamicQuery.value = o[p as keyof typeof o];
							eDynamicQuery.classList.add("atualizar");
							eAfetados.push(eDynamicQuery);
						}
					}
				}
			} else console.warn("QSetAll - Precisa receber um objeto: " + o);
		} else console.warn("QSetAll - Objeto não pode ser nulo: " + o);
		return eAfetados;
	};

	static Qon = (query: HTMLElement | string = "body") => {
		let temp = mk.Q(query);
		(temp as HTMLButtonElement).disabled = false;
		temp.classList.remove("disabled");
		return temp;
	};

	static Qoff = (query: HTMLElement | string = "body") => {
		let temp = mk.Q(query);
		(temp as HTMLButtonElement).disabled = true;
		temp.classList.add("disabled");
		return temp;
	};

	static QverOn = (query: HTMLElement | string = "body") => {
		let temp = mk.Q(query);
		temp.classList.remove("oculto");
		return temp;
	};

	static QverOff = (query: HTMLElement | string = "body") => {
		let temp = mk.Q(query);
		temp.classList.add("oculto");
		return temp;
	};

	static QdataGet = (
		query: HTMLElement | string = "body",
		atributoNome: string
	) => {
		return mk.Q(query).getAttribute("data-" + atributoNome);
	};

	static QdataSet = (
		query: HTMLElement | string = "body",
		atributoNome: string,
		atributoValor: string
	) => {
		return mk.Q(query).setAttribute("data-" + atributoNome, atributoValor);
	};

	// static QaSet = (query = "body", atributoNome, atributoValor) => {
	// 	return Mk.Q(query).setAttribute(atributoNome, atributoValor);
	// };

	// static QaGet = (query = "body", atributoNome) => {
	// 	return Mk.Q(query).getAttribute(atributoNome);
	// };

	static GetParam = (name = null) => {
		if (name != null) {
			return new URL(document.location.toString()).searchParams.get(name);
		} else {
			return new URL(document.location.toString()).searchParams;
		}
	};

	static isVisible = (e: HTMLElement) => {
		return (
			e.offsetWidth > 0 || e.offsetHeight > 0 || e.getClientRects().length > 0
		);
	};

	static isFloat = (x: any): boolean => {
		if (!isNaN(x)) {
			if (parseInt(x) != parseFloat(x)) {
				return true;
			}
		}
		return false;
	};

	static mkSelDlRefill = async (eName: string, cod = null): Promise<void> => {
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
			} else {
				console.error("Resultado não é um JSON. (mkSelDlRefill)");
			}
		}
	};

	// Get Server On
	static getServerOn = async (url: string) => {
		let retorno = await mk.http(url, mk.t.G, mk.t.J);
		// Vem nulo caso falhe
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
			buttonOfflineBlock.setAttribute(
				"onClick",
				"Mk.detectedServerOff_display()"
			);
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

	// Eventos HTML5
	// Bloqueio de teclas especificas onKeyDown
	static mkOnlyFloatKeys = (ev: KeyboardEvent) => {
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
				//console.log(permitido[i] + " == " + ev.key.toString());
				isNegado = false;
			}
		}

		//=> Teclas especiais
		ev.key == "ArrowLeft" ? (isNegado = false) : null; // Liberar Setinha pra Esquerda
		ev.key == "ArrowRight" ? (isNegado = false) : null; // Liberar Setinha pra Direita
		ev.key == "Backspace" ? (isNegado = false) : null; // Liberar Backspace
		ev.key == "Delete" ? (isNegado = false) : null; // Liberar Deletar
		ev.key == "Tab" ? (isNegado = false) : null; // Liberar Deletar
		isNegado ? ev.preventDefault() : null;
	};
	// Bloqueios de eventos especificos (varios, exemplo: onContextMenu)
	static mkEventBlock = (ev: Event) => {
		console.error("Negado");
		ev.preventDefault();
	};

	// Imprimir e Exportar de ListaPrecos
	static mkTrocaPontoPorVirgula = (query: string): void => {
		mk.QAll(query).forEach((e) => {
			e.innerHTML = e.innerHTML.replaceAll(".", ",");
		});
	};

	// Seleciona texto do elemento
	static mkSelecionarInner = (e: HTMLElement) => {
		if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(e);
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	};

	static mkInputFormatarValor = (e: HTMLInputElement): void => {
		// 123,45 (2 casas pos conversao float)
		e.value = mk.mkDuasCasas(mk.mkFloat(e.value));
	};

	static mkMedia = (menor: string | number, maior: string | number): string => {
		return mk.mkDuasCasas((mk.mkFloat(menor) + mk.mkFloat(maior)) / 2);
	};

	static mkFloat = (num: any): number => {
		let ret: number;
		if (typeof num != "number") {
			ret = parseFloat(num.toString().replaceAll(".", "").replaceAll(",", "."));
		} else {
			ret = num;
		}
		if (isNaN(ret)) {
			ret = 0;
		}
		return ret;
	};

	static mkDuasCasas = (num: number): string => {
		return mk.mkFloat(num).toFixed(2).replaceAll(".", ","); // 2000,00
		//        .toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // 2.000,00
	};

	static mkEmReais = (num: number): string => {
		return mk.mkFloat(num).toLocaleString("pt-br", {
			style: "currency",
			currency: "BRL",
		}); // R$ 12.123,45
	};

	static mkBase64 = (arquivo: any, tagImg: string, tagHidden: string): void => {
		// Verificar se esta nulo
		let leitor = new FileReader();
		leitor.onload = () => {
			(mk.Q(tagImg) as HTMLImageElement).src = leitor.result as string;
			(mk.Q(tagHidden) as HTMLInputElement).value = leitor.result as string;
		};
		leitor.readAsDataURL(arquivo);
	};

	// Clona tanto uma array quanto um objeto ao ser enviado por parametro. (map não clonou)
	static mkClonarOA = (oa: object | object[]): object | object[] => {
		if (Array.isArray(oa)) {
			let temp: object[] = [];
			oa.forEach((o) => {
				let novoO: any = {};
				for (let p in o) {
					novoO[p] = o[p as keyof typeof o];
				}
				temp.push(novoO);
			});
			return temp;
		} else {
			let novoO: object = {};
			if (typeof oa === "object") {
				for (let p in oa) {
					novoO[p as keyof typeof oa] = oa[p as keyof typeof oa];
				}
			}
			return novoO;
		}
	};

	// Sobe os elementos até encontrar o form pertencente a este elemento. (Se limita ao BODY)
	static getFormFrom = (e: any) => {
		let eForm = e;
		while (eForm.tagName != "FORM") {
			eForm = eForm.parentElement;
			if (eForm.tagName == "BODY") {
				console.error(
					"Não foi possível encontrar o elemento FORM na busca getFormFrom()"
				);
				break;
			}
		}
		return eForm;
	};

	// Retorna uma array utilizando um template do que deve ser preenchido.
	static encheArray = (
		arrTemplate: any[],
		inicio = 1,
		total: number | null
	): any[] => {
		let novaArray: any[] = [];
		if (Array.isArray(arrTemplate)) {
			if (arrTemplate.length > 0) {
				if (arrTemplate.length < inicio) {
					console.error(
						"O arrTemplate tem menos itens do que o informado para o inicio"
					);
					return novaArray;
				}
			} else {
				console.error(
					"Função encheArray precisa receber ao menos 1 item em arrTemplate."
				);
				return novaArray;
			}
		} else {
			console.error(
				"Função encheArray precisa receber uma array com dados em arrTemplate."
			);
			return novaArray;
		}
		if (inicio <= 0) {
			console.error("O inicio precisa ser maior que zero.");
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
	};

	// Retorna uma array dos últimos
	static encheArrayUltimos = (
		arrTemplate: any[],
		fim = 1,
		total: number | null
	): any[] => {
		let novaArray: any[] = [];
		if (Array.isArray(arrTemplate)) {
			if (arrTemplate.length > 0) {
				if (arrTemplate.length < fim) {
					console.error(
						"O arrTemplate tem menos itens do que o informado para o fim."
					);
					return novaArray;
				}
			} else {
				console.error(
					"Função encheArrayUltimos precisa receber ao menos 1 item em arrTemplate."
				);
				return novaArray;
			}
		} else {
			console.error(
				"Função encheArrayUltimos precisa receber uma array com dados em arrTemplate."
			);
			return novaArray;
		}
		if (fim <= 0) {
			console.error("O fim precisa ser maior que zero.");
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
	};

	// Retorna Milisegundos da data no formato Javascript
	static getMs = (dataYYYYMMDD: string | null = null): number => {
		if (dataYYYYMMDD != null) {
			let dataCortada = dataYYYYMMDD.split("-");
			let oDia: number = Number(dataCortada[2]);
			let oMes: number = Number(dataCortada[1]) - 1;
			let oAno: number = Number(dataCortada[0]);
			return new Date(oAno, oMes, oDia).getTime();
		} else return new Date().getTime();
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
			return (
				new Date(ms).getFullYear() +
				"-" +
				(new Date(ms).getMonth() + 1) +
				"-" +
				new Date(ms).getDate()
			);
		else
			return (
				new Date().getFullYear() +
				"-" +
				(new Date().getMonth() + 1) +
				"-" +
				new Date().getDate()
			);
	};

	static getDia = (ms = null) => {
		if (ms != null) return Number(mk.getFullData(ms).split("-")[2]);
		else return Number(mk.getFullData().split("-")[2]);
	};
	static getMes = (ms = null) => {
		if (ms != null) return Number(mk.getFullData(ms).split("-")[1]);
		else return Number(mk.getFullData().split("-")[1]);
	};
	static getAno = (ms = null) => {
		if (ms != null) return Number(mk.getFullData(ms).split("-")[0]);
		else return Number(mk.getFullData().split("-")[0]);
	};

	static getDiasDiferenca = (msOld: number, msNew: number | null = null) => {
		if (msNew == null) msNew = mk.getMs();
		return mk.transMsEmDias(msNew! - msOld);
	};
	// Para transformar uma diferenca de datas em Mes ou Ano,
	// precisa de auxilio de um calendário,
	// pois os dias não são sempre 24 horas.
	// Ao comparar meses de diferenca,
	// ocorrerá um erro na conta quando houver meses com 31 dias
	// E anos bissexto geram erros nos meses de fevereiro sem um calendario

	static transMsEmSegundos = (ms: number) => {
		return Math.trunc(ms / 1000); // 1000 ms == 1s
	};
	static transMsEmMinutos = (ms: number) => {
		return Math.trunc(ms / 60000); // 1000 * 60
	};
	static transMsEmHoras = (ms: number) => {
		return Math.trunc(ms / 3600000); // 1000 * 3600
	};
	static transMsEmDias = (ms: number) => {
		// 1000 * 3600 * 24 Considerando todo dia tiver 24 horas (~23h 56m 4.1s)
		// (360º translacao / 86400000) = ~4.1
		// Então o erro de 1 dia ocorre 1x ao ano (Dia represeta 1436min).
		return Math.trunc(ms / 86400000);
	};

	static transSegundosEmMs = (s: number) => {
		return s * 1000;
	};
	static transMinutosEmMs = (m: number) => {
		return m * 60000;
	};
	static transHorasEmMs = (h: number) => {
		return h * 3600000;
	};
	static transDiasEmMs = (d: number) => {
		return d * 86400000;
	};

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			Conversores									\\
	//___________________________________\\

	// Converter de YYYY-MM-DD para DD/MM/YYYY
	static mkYYYYMMDDtoDDMMYYYY = (dataYYYYMMDD: string): string => {
		let arrayData = dataYYYYMMDD.split("-");
		let stringRetorno = "";
		if (arrayData.length >= 3) {
			// Tenta evitar bug de conversao
			stringRetorno = arrayData[2] + "/" + arrayData[1] + "/" + arrayData[0];
		} else {
			stringRetorno = dataYYYYMMDD;
		}
		return stringRetorno;
	};

	// Converter (OBJ / ARRAY) Formato Booleano em Sim/Não
	static mkFormatarDataOA = (oa: object | object[]) => {
		function mkFormatarDataOA_Execute(o: any) {
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
	static mkBoolToSimNaoOA = (oa: object | object[]) => {
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
		return mk.mkExecutaNoObj(oa, mkBoolToSimNaoOA_Execute);
	};

	// Converter (OBJ / ARRAY) Formatar para normalizar com a exibicao ao usuario.
	static mkFormatarOA = (oa: object | object[]) => {
		return mk.mkBoolToSimNaoOA(mk.mkFormatarDataOA(mk.mkLimparOA(oa)));
	};

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			Carregador									\\
	//___________________________________\\

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

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			HTTP												\\
	//___________________________________\\

	// Método principal de chamada Http. tanto GET quanto POST
	static http = async (
		url: string,
		metodo: string = mk.t.G,
		tipo: string = mk.t.J,
		dados: any = null,
		carregador: boolean = false
	): Promise<any> => {
		const mkaft: HTMLInputElement = document.getElementsByName(
			"__RequestVerificationToken"
		)[0] as HTMLInputElement;
		let body: string | null = null;
		if (dados) {
			if (tipo == mk.t.J) {
				body = JSON.stringify(dados);
			} else if (tipo == mk.t.F) {
				body = dados;
			}
		}
		let h = {
			method: metodo!,
			headers: {
				"Content-Type": tipo!,
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
		if (metodo == mk.t.P) {
			console.groupCollapsed(">> Objeto Enviado");
			console.info(dados);
			console.info(body?.toString());
			console.groupEnd();
		}
		console.groupEnd();
		const pacoteHttp = await fetch(url, h);
		if (!pacoteHttp.ok) {
			console.groupCollapsed(
				"HTTP RETURN: " + pacoteHttp.status + " " + pacoteHttp.statusText
			);
			console.error("HTTP RETURN: Não retornou 200.");
			console.info(await pacoteHttp.text()); // Exibir o erro no console;
			console.groupEnd();
			if (carregador) {
				this.CarregarOFF();
			}
			return null;
		}
		let corpo: any = null;
		if (tipo == mk.t.J) {
			corpo = await pacoteHttp.json();
		} else {
			corpo = await pacoteHttp.text();
		}
		if (carregador) {
			this.CarregarOFF();
		}
		console.groupCollapsed(
			"RET " + h.method + " " + tipo.toUpperCase().split("/")[1] + ":"
		);
		console.timeEnd(url);
		console.info(corpo);
		console.groupEnd();
		//if (sucesso != null) sucesso(corpo);
		return corpo;
	};

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			LISTAGEM										\\
	//___________________________________\\

	// GET OBJ - Retorna O objeto de uma Lista
	static getObjetoFromId = (
		nomeKey: any,
		valorKey: any,
		listaDados: object[]
	): object | null => {
		let temp: object | null = null;
		if (Array.isArray(listaDados)) {
			listaDados.forEach((o) => {
				if (o[nomeKey as keyof typeof o] == valorKey) {
					temp = o;
				}
			});
		}
		return temp;
	};

	// GET OBJ - Retorna O objeto de uma Lista
	static setObjetoFromId = (
		nomeKey: any,
		valorKey: any,
		itemModificado: object,
		listaDados: object[]
	): object[] | null => {
		if (Array.isArray(listaDados)) {
			listaDados.forEach((o) => {
				if (o[nomeKey as keyof typeof o] == valorKey) {
					o = itemModificado;
				}
			});
		}
		return listaDados;
	};

	// DEL OBJ - Retorna a lista sem o objeto informado
	static delObjetoFromId = (
		nomeKey: any,
		valorKey: any,
		listaDados: object[]
	): object[] => {
		let temp: object[] = [];
		if (Array.isArray(listaDados)) {
			listaDados.forEach((o) => {
				if (o[nomeKey as keyof typeof o] == valorKey) {
					temp.push(o);
				}
			});
		} else {
			temp = listaDados;
		}
		return temp;
	};

	static aposModalFullAberto = () => {};

	// Metodo que eh executado ao completar a exibicao (PODE SOBREESCREVER NA VIEW)
	static aoCompletarExibicao = () => {};

	// Metodo que eh executado antes de exibir (PODE SOBREESCREVER NA VIEW)
	static antesDePopularTabela = () => {};

	static atualizarStatusLista = () => {
		if (mk.Q("input[name='tablePorPagina']") == null) {
			mk.status.pagPorPagina = 5;
		} else {
			mk.status.pagPorPagina = Number(
				(mk.Q("input[name='tablePorPagina']") as HTMLInputElement).value
			);
		}
		mk.status.totalFull = this.fullDados.length;
		mk.status.totalFiltrado = this.exibeDados.length;
		mk.status.totalPorPagina = this.exibePaginado.length;
		mk.status.pagItensIni =
			(this.paginationAtual - 1) * mk.status.pagPorPagina + 1; // Calculo Pagination
		mk.status.pagItensFim =
			mk.status.pagItensIni + (mk.status.pagPorPagina - 1); // Calculo genérico do último
		if (mk.status.pagItensFim > mk.status.totalFiltrado) {
			mk.status.pagItensFim = mk.status.totalFiltrado; // Na última página não pode exibir o valor genérico.
		}

		// Arredondar pra cima, pois a última página pode exibir conteúdo sem preencher o PorPagina
		mk.status.totalPaginas = Math.ceil(
			this.exibeDados.length / mk.status.pagPorPagina
		);
	};

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

	// Monta os botoes de numero de pagina
	static filtraPagination = () => {
		// Status
		mk.Q(".tableResultado .tableIni").innerHTML =
			mk.status.pagItensIni.toString();
		mk.Q(".tableResultado .tableFim").innerHTML =
			mk.status.pagItensFim.toString();
		// Links
		mk.Q(".tablePaginacao .paginate_Ultima a").innerHTML =
			mk.status.totalPaginas.toString();

		if (this.paginationAtual == 1) {
			mk.Q(".tablePaginacao .pagBack").classList.add("disabled");
		} else {
			mk.Q(".tablePaginacao .pagBack").classList.remove("disabled");
		}
		if (this.paginationAtual >= mk.status.totalPaginas) {
			mk.Q(".tablePaginacao .pagNext").classList.add("disabled");
		} else {
			mk.Q(".tablePaginacao .pagNext").classList.remove("disabled");
		}
		if (mk.status.totalPaginas > 2) {
			mk.Q(".tablePaginacao .pageCod2").classList.remove("oculto");
		} else {
			mk.Q(".tablePaginacao .pageCod2").classList.add("oculto");
		}
		if (mk.status.totalPaginas > 3) {
			mk.Q(".tablePaginacao .pageCod3").classList.remove("oculto");
		} else {
			mk.Q(".tablePaginacao .pageCod3").classList.add("oculto");
		}
		if (mk.status.totalPaginas > 4) {
			mk.Q(".tablePaginacao .pageCod4").classList.remove("oculto");
		} else {
			mk.Q(".tablePaginacao .pageCod4").classList.add("oculto");
		}
		if (mk.status.totalPaginas > 5) {
			mk.Q(".tablePaginacao .pageCod5").classList.remove("oculto");
		} else {
			mk.Q(".tablePaginacao .pageCod5").classList.add("oculto");
		}
		if (mk.status.totalPaginas > 6) {
			mk.Q(".tablePaginacao .pageCod6").classList.remove("oculto");
		} else {
			mk.Q(".tablePaginacao .pageCod6").classList.add("oculto");
		}
		if (this.paginationAtual < 5) {
			// INI
			mk.Q(".tablePaginacao .pageCod2").classList.remove("disabled");
			mk.Q(".tablePaginacao .pageCod2 a").innerHTML = "2";
			mk.Q(".tablePaginacao .pageCod3 a").innerHTML = "3";
			mk.Q(".tablePaginacao .pageCod4 a").innerHTML = "4";
			mk.Q(".tablePaginacao .pageCod5 a").innerHTML = "5";
			mk.Q(".tablePaginacao .pageCod6 a").innerHTML = "...";
			mk.Q(".tablePaginacao .pageCod6").classList.add("disabled");
		} else {
			// END
			if (mk.status.totalPaginas - this.paginationAtual < 4) {
				mk.Q(".tablePaginacao .pageCod2").classList.add("disabled");
				mk.Q(".tablePaginacao .pageCod2 a").innerHTML = "...";
				mk.Q(".tablePaginacao .pageCod3 a").innerHTML = (
					mk.status.totalPaginas - 4
				).toString();
				mk.Q(".tablePaginacao .pageCod4 a").innerHTML = (
					mk.status.totalPaginas - 3
				).toString();
				mk.Q(".tablePaginacao .pageCod5 a").innerHTML = (
					mk.status.totalPaginas - 2
				).toString();
				mk.Q(".tablePaginacao .pageCod6 a").innerHTML = (
					mk.status.totalPaginas - 1
				).toString();
				mk.Q(".tablePaginacao .pageCod6").classList.remove("disabled");
			} else {
				// MID
				mk.Q(".tablePaginacao .pageCod2").classList.add("disabled");
				mk.Q(".tablePaginacao .pageCod2 a").innerHTML = "...";
				mk.Q(".tablePaginacao .pageCod3 a").innerHTML = (
					this.paginationAtual - 1
				).toString();
				mk.Q(".tablePaginacao .pageCod4 a").innerHTML =
					this.paginationAtual.toString();
				mk.Q(".tablePaginacao .pageCod5 a").innerHTML = (
					this.paginationAtual + 1
				).toString();
				mk.Q(".tablePaginacao .pageCod6 a").innerHTML = "...";
				mk.Q(".tablePaginacao .pageCod6").classList.add("disabled");
			}
		}
		mk.ativaPaginaAtual();
		this.exibePaginado = [];
		// Clonagem de Paginado
		this.exibeDados.forEach((item, i) => {
			if (i + 1 >= mk.status.pagItensIni && i + 1 <= mk.status.pagItensFim) {
				let objItem = new Object();
				let o = item;
				for (var propName in o) {
					// Se converter toString aqui, tratar Objetos de forma diferente
					objItem[propName as keyof typeof o] = o[propName as keyof typeof o];
				}
				this.exibePaginado.push(objItem);
			}
		});
	};

	/**
	 * FullFiltroFull
	 * Busca as mesmas propriedades no filtro e nos itens de fullDados;
	 * Uma lista exibeDados eh formada por referencia de memoria a partir dos resultados encontrados apos filtro.
	 * //Mk.fullDados.filter(o => {return o.codPessoa < 5}).map(o => {return o.codPessoa + " - " + o.nomPessoa}).join("<br>");
	 * //Não é possível utilizar o filter em array, pois nesse caso estamos girando 2 filter ao mesmo tempo e comparando os parametros.
	 */
	static mkFiltragemDados = () => {
		if (Array.isArray(this.fullDados)) {
			let temp: any[] = [];
			this.fullDados.forEach((o) => {
				let podeExibir = true; // Verificara cada prop, logica de remocao seletiva.
				for (let propFiltro in mk.objFiltro) {
					// Cada Propriedade de Cada Item da Array
					if (o[propFiltro as keyof typeof o] != null) {
						// Cruzar referencia com objFiltro e se so avancar se realmente for um objeto
						let m: any = o[propFiltro as keyof typeof o]; // m representa o dado do item
						let k: any = this.objFiltro[propFiltro]; // k representa a config do filtro para essa propriedade
						// console.log(
						// 	propFiltro +
						// 		"(" +
						// 		typeof Mk.objFiltro[propFiltro] +
						// 		"): " +
						// 		m +
						// 		" >> " +
						// 		k.formato +
						// 		": " +
						// 		k.conteudo
						// );
						if (k.formato === "string") {
							// Filtro por string (Tipo Like)
							k.conteudo = k.conteudo.toString().toLowerCase();
							if (
								!m.toString().toLowerCase().match(k.conteudo) &&
								k.conteudo !== "0"
							) {
								// LIKE
								podeExibir = false;
							}
						} else if (k.formato === "stringNumerosVirgula") {
							// Filtro por numero exado. Conteudo tem um array de numeros.
							let filtroInvertido = false;
							let numerosMDaString = m.toString().split(","); // String de Numeros em Array de Strings
							if (this.isJson(k.conteudo)) {
								//let numerosKDaString = k.conteudo.toString().split(","); // Transformar em Array tambem.
								JSON.parse(k.conteudo).map((numeroK: any) => {
									// A cada numero encontrado pos split na string do item verificado
									filtroInvertido = numerosMDaString.some((numeroM: any) => {
										// Encontrar ao menos 1 true no array interno. (Resolve o XOR)
										return Number(numeroM) == Number(numeroK);
									});
									if (!filtroInvertido) {
										podeExibir = false;
									}
								});
							} else console.warn("Não é um JSON");
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
					if (this.objFiltro["mkFullFiltro"]) {
						// Se houver pesquisa generica no filtro
						let k = this.objFiltro["mkFullFiltro"]["conteudo"]
							.toString()
							.toLowerCase(); // k = Dado que estamos procurando
						podeExibir = false; // Inverter para verificar se alguma prop do item possui a caracteristica
						for (var propNameItem in o) {
							let m: any = o[propNameItem as keyof typeof o];
							//console.log(m + " FILTRO: " + k);
							if (m != null) {
								// <= Nao pode tentar filtrar em itens nulos
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
		} else {
			this.exibeDados = [];
		}
	};

	/**
	 * ATUALIZA a listagem com os dados ja ordenados de fullDados;
	 * Executa a filtragem dos dados;
	 * POPULA a lista atravez de uma nova lista: exibePaginado;
	 */
	static atualizarLista = () => {
		let tablePaginacao = mk.Q(".tablePaginacao");
		// Apenas executa a atualização e filtro, se a tablePaginacao estiver presente na página.
		if (tablePaginacao) {
			mk.mkFiltragemDados(); // Popular exibeDados

			mk.atualizarStatusLista();
			// Atualizar os Status
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
			} else {
				mk.Q(".tablePaginacao").setAttribute("hidden", "");
			}
			if (this.exibeDados.length == 0) {
				mk.Q(".tableInicioFim").setAttribute("hidden", "");
				mk.Q(".tableExibePorPagina").setAttribute("hidden", "");
				mk.Q(".listBody").setAttribute("hidden", "");
				this.exibePaginado = [];
			} else {
				mk.Q(".tableInicioFim").removeAttribute("hidden");
				mk.Q(".tableExibePorPagina").removeAttribute("hidden");
				mk.Q(".listBody").removeAttribute("hidden");

				mk.filtraPagination();
				mk.antesDePopularTabela();

				// XXX RESOLVER: Criar Funções de geração de template em javascript.
				$(".tableListagem tbody.listBody").loadTemplate(
					mk.Q("#template"),
					mk.exibePaginado,
					{
						complete: mk.aoCompletarExibicao,
					}
				);
			}
		}
	};

	// Gatilho para trocar a pagina
	static mudaPagina = (e: string | HTMLElement) => {
		// vem o this do evento / 'next' / 'back'
		if (typeof e == "string") {
			if (e == "next") {
				this.paginationAtual += 1;
			} else if (e == "back") {
				this.paginationAtual -= 1;
			}
		} else {
			this.paginationAtual = Number(e.innerHTML);
		}
		mk.atualizarLista();
	};

	// Retorna a pagina 1 e atualiza
	static atualizarPorPagina = () => {
		this.paginationAtual = 1;
		mk.atualizarLista();
	};

	// Gerar Filtro baseado nos atributos do MKF gerados no campo.
	static mkGerarFiltro = (e: HTMLInputElement | HTMLSelectElement) => {
		// Para ignorar filtro: data-mkfignore="true" (Ou nao colocar o atributo mkfformato no elemento)
		if (e.value != null && e.getAttribute("data-mkfignore") != "true") {
			mk.objFiltro[e.name] = {
				formato: e.getAttribute("data-mkfformato"),
				operador: e.getAttribute("data-mkfoperador"),
				conteudo: e.value,
			};
		}
		// Limpar filtro caso o usuario limpe o campo
		if (
			this.objFiltro[e.name]["conteudo"] == "" ||
			this.objFiltro[e.name]["conteudo"] == "0" ||
			this.objFiltro[e.name]["conteudo"] == 0 ||
			this.objFiltro[e.name]["conteudo"] === null
		) {
			delete this.objFiltro[e.name];
		}
		mk.atualizarPorPagina();
	};

	// Force Update Filtro ()
	static mkUpdateFiltro = () => {
		this.objFiltro = {};
		mk.QAll("input.iConsultas").forEach((e) => {
			mk.mkGerarFiltro(e as HTMLInputElement);
		});
		mk.QAll("select.iConsultas").forEach((e) => {
			mk.mkGerarFiltro(e as HTMLSelectElement);
		});
		mk.atualizarPorPagina();
	};

	// Metodo que eh executado sempre que um dado for recebido. (PODE SOBREESCREVER NA VIEW)
	static aoReceberDados = (data: object): object => {
		return data;
	};

	// LER (cRud) Metodo que inicia a coleta.
	static iniciarGetList = async (url: string): Promise<void> => {
		mk.Ao("input", "input[name='tablePorPagina']", () => {
			mk.atualizarPorPagina();
		});
		let retorno = await mk.http(url, mk.t.G, mk.t.J);
		if (retorno != null) {
			mk.mkLimparOA(retorno);
			mk.mkExecutaNoObj(retorno, mk.aoReceberDados);
			this.fullDados = this.exibeDados = retorno;
			mk.ordenarDados();
			mk.mkUpdateFiltro(); // Se remover aqui, verificar objFiltro em PlacasFixas
		}
	};

	static adicionarDados = (objDados: object) => {
		this.fullDados.push(mk.aoReceberDados(objDados));
		mk.ordenarDados();
		mk.atualizarLista();
	};

	static editarDados = (objDados: object, nomeKey: any, valorKey: any) => {
		// Implementar setObjetoFromId
		this.fullDados = mk.delObjetoFromId(nomeKey, valorKey, this.fullDados);
		this.fullDados.push(mk.aoReceberDados(objDados));
		mk.ordenarDados();
		mk.atualizarLista();
	};

	static excluirDados = (nomeKey: any, valorKey: any) => {
		this.fullDados = mk.delObjetoFromId(nomeKey, valorKey, this.fullDados);
		mk.ordenarDados();
		mk.atualizarLista();
	};

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			FILTRO											\\
	//___________________________________\\

	// Gatilho FILTRO
	static mkSetFiltroListener = () => {
		mk.QAll("input.iConsultas").forEach((e) => {
			e.addEventListener("input", () => {
				mk.mkGerarFiltro(e as HTMLInputElement);
			});
		});
		mk.QAll("select.iConsultas").forEach((e) => {
			e.addEventListener("change", () => {
				mk.mkGerarFiltro(e as HTMLSelectElement);
			});
		});
	};

	// LIMPAR FILTRO  LimparFiltro("#consulta_form"); //Passar o form que contem os SELECT/INPUT de filtro (search).
	static LimparFiltro = (form: string = "#consulta_form") => {
		this.objFiltro = {};
		// RESET Form (Limpar seria "0" / "") (Set e.defaultValue)
		let eForm = mk.Q(form) as HTMLFormElement;
		eForm.reset();

		// Solicita Atualizacao de todos mkSel
		mk.QAll("#consulta_form .mkSel").forEach((mkSel) => {
			mkSel.classList.add("atualizar");
		});
	};

	// LIMPAR FILTRO  LimparFiltro("#consulta_form"); //Passar o form que contem os SELECT/INPUT de filtro (search).
	static LimparFiltroUpdate = (form: string = "#consulta_form") => {
		mk.LimparFiltro(form);
		mk.atualizarLista();
	};

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			ORDER LIST									\\
	//___________________________________\\

	// Funcão de ordenamento ao inverter a lista
	static ordenar = (
		array: object[] = this.fullDados,
		nomeProp: string = this.sortBy,
		reverse: boolean | number = false
	) => {
		array.sort((oA, oB) => {
			if (oA[nomeProp as keyof typeof oA] !== oB[nomeProp as keyof typeof oB]) {
				if (oA[nomeProp as keyof typeof oA] > oB[nomeProp as keyof typeof oB])
					return 1;
				if (oA[nomeProp as keyof typeof oA] < oB[nomeProp as keyof typeof oB])
					return -1;
			}
			return 0;
		});
		this.contaOrdena++;
		if (reverse == true) {
			array = array.reverse();
		} else if (reverse == 2) {
			// toogle
			if (this.contaOrdena % 2 == 0) {
				array = array.reverse();
			}
		}
		return array;
	};

	// Funcao que ordena os dados
	static ordenarDados = () => {
		// Array é ordenada
		this.fullDados.sort((oA, oB) => {
			if (
				oA[mk.sortBy as keyof typeof oA] !== oB[mk.sortBy as keyof typeof oB]
			) {
				if (oA[mk.sortBy as keyof typeof oA] > oB[mk.sortBy as keyof typeof oB])
					return 1;
				if (oA[mk.sortBy as keyof typeof oA] < oB[mk.sortBy as keyof typeof oB])
					return -1;
			}
			return 0;
		});
		if (this.sortDir == "d") {
			this.fullDados = this.fullDados.reverse();
		}
		// Limpa mkSorting
		let thsAll = mk.QAll("th");
		if (thsAll.length != 0) {
			thsAll.forEach((th) => {
				th.classList.remove("mkEfeitoDesce");
				th.classList.remove("mkEfeitoSobe");
			});
		}
		// Busca elemento que está sendo ordenado
		//console.log("Ordenando: " + this.sortBy + " EM: " + this.sortDir);
		let thsSort = mk.QAll(".sort-" + this.sortBy);
		if (thsSort.length != 0) {
			thsSort.forEach((thSort) => {
				if (this.sortDir == "a") {
					thSort.classList.add("mkEfeitoDesce");
				} else {
					thSort.classList.add("mkEfeitoSobe");
				}
			});
		}
	};

	// Funcao que inverte a direcao, reordena e atualiza
	static inverteDir = (ordenar: string | null = null) => {
		if (ordenar != null) {
			if (ordenar != this.sortBy) {
				this.sortDir = "a";
			} else {
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
				// Verifica se contém sort- no inicio da class
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

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			VALIDADOR										\\
	//___________________________________\\

	// Funcao tipo isPendente para validacao para mkValida. Aqui valida Pendente apenas.
	static mkAindaPendente = (form: string) => {
		let temPendencia = false;
		mk.QAll(form + " input").forEach((e) => {
			if (mk.isVisible(e as HTMLElement)) {
				if (e.classList.contains("pending")) {
					temPendencia = true;
					e.classList.remove("valid");
					e.classList.add("input-validation-error");
				}
			}
		});
		return temPendencia;
	};

	// $ Unobtrusive: form = atualForm
	static verificarCampos = (form: string) => {
		// Ignorara os campos com classe ignore
		$.data($(form)[0], "validator").settings.ignore = ":hidden";
		$.validator.unobtrusive.parse(form);
		var resultado = $(form).data("unobtrusiveValidation").validate();
		console.info("ModelState é Valido? " + resultado);
		return resultado;
	};

	// mkValidaFull(atualForm, trocaFaseLiberado, destinoFase)
	// Funcao Recursiva: Executa mkAindaPendente ate a resposta do HTTP retornar.
	// Parametro(formulario)        Formulario para validar
	// Parametro(fUIValidou)        Funcao a ser executada apos a validacao ser aprovada e recebida
	// Parametro(varRepassaA)       Variavel/Objeto que pode ser passada da solicitacao ate a resposta.
	static mkValidaFull = (
		form: string,
		fUIValidou: any,
		varRepassaA: any = null
	) => {
		mk.mkCountValidate++;
		if (mk.verificarCampos(form)) {
			let liberado = false;
			if (mk.mkAindaPendente(form)) {
				if (mk.mkCountValidate < 250) {
					mk.CarregarON();
					setTimeout(() => {
						mk.mkValidaFull(form, fUIValidou, varRepassaA);
					}, 10);
				} else {
					mk.CarregarOFF();
					console.error(
						"&nbsp; Um ou mais campos do formul&aacute;rio n&atilde;o puderam ser validados por falta de resposta do servidor."
					);
				}
				return false;
			} else {
				liberado = true;
			}
			if (liberado) {
				mk.CarregarOFF();
				fUIValidou(varRepassaA);
			}
		} else {
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
	static fUIFaseUpdateView = (obj: object) => {
		for (
			var i = 1;
			i <= Number(mk.Q(".mkUlFase").getAttribute("data-totalfases"));
			i++
		) {
			mk.Q(".modalFase" + i).classList.add("oculto");
		}
		this.mkFaseAtual = obj["destinoFase" as keyof typeof obj];
		mk.Q(".modalFase" + this.mkFaseAtual).classList.remove("oculto");
		mk.Q(".btnVoltar").classList.add("disabled");
		if (this.mkFaseAtual > 1) {
			mk.Q(".btnVoltar").classList.remove("disabled");
		}
		mk.Q(".btnAvancar").classList.remove("oculto");
		mk.Q(".btnEnviar").classList.add("oculto");
		if (
			this.mkFaseAtual >=
			Number(mk.Q(".mkUlFase").getAttribute("data-totalfases"))
		) {
			mk.Q(".btnAvancar").classList.add("oculto");
			mk.Q(".btnEnviar").classList.remove("oculto");
		}
		mk.fUIFaseUpdateLinkFase();
	};

	// (OnClick BOTAO) FUNCAO VOLTAR A FASE
	static fUIFaseVoltar = (esteForm: string) => {
		let obj = {
			destinoFase: this.mkFaseAtual - 1,
			form: esteForm,
		};
		mk.fUIFaseUpdateView(obj);
	};

	// (OnClick BOTAO) FUNCAO AVANCAR A FASE
	static fUIFaseAvancar = (esteForm: string) => {
		let obj = {
			destinoFase: this.mkFaseAtual + 1,
			form: esteForm,
		};
		mk.mkValidaFull(obj.form, mk.fUIFaseLiberarView, obj);
	};

	// (OnClick BOTAO) FUNCAO LINK PARA FASE ESPECIFICA
	static fUIFaseEspecifica = (e: HTMLElement) => {
		let obj = {
			destinoFase: Number(e.getAttribute("data-pag")),
			form: mk.getFormFrom(e),
		};
		if (
			obj.destinoFase < this.mkFaseAtual ||
			e.getAttribute("data-libera") == "true"
		) {
			mk.mkValidaFull(obj.form, mk.fUIFaseLiberarView, obj);
		}
	};

	static fUIFaseLiberarView = (obj: object) => {
		this.sendObjFull = mk.mkGerarObjeto(obj["form" as keyof typeof obj]);
		mk.fUIFaseUpdateView(obj);
	};

	// Metodo de controle de grupos de abas.
	static mkClicarNaAba = (este: HTMLElement) => {
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
	};

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			MODAL												\\
	//___________________________________\\

	static mkModalBuild = async () => {
		return await Promise.resolve(() => {
			console.log("mkModalBuild() Ini");
			let divmkModalBloco = document.createElement("div");
			divmkModalBloco.className = "mkModalBloco";
			let divmkModalConteudo = document.createElement("div");
			divmkModalConteudo.className = "mkModalConteudo";
			let divmkModalCarregando = document.createElement("div");
			divmkModalCarregando.className = "text-center";
			let buttonmkBtnInv = document.createElement("button");
			buttonmkBtnInv.className = "mkBtnInv absolutoTopoDireito mkEfeitoDodge";
			buttonmkBtnInv.setAttribute("type", "button");
			buttonmkBtnInv.setAttribute("onClick", "Mk.mkAbrirModalFull_Hide()");
			let iModalMk = document.createElement("i");
			iModalMk.className = "bi bi-x-lg";
			buttonmkBtnInv.appendChild(iModalMk);
			divmkModalConteudo.appendChild(divmkModalCarregando);
			divmkModalBloco.appendChild(divmkModalConteudo);
			divmkModalBloco.appendChild(buttonmkBtnInv);
			document.body.appendChild(divmkModalBloco);
			console.log("mkModalBuild() Fim");
		});
	};

	static mkModalClear() {
		mk.Q(".mkModalBloco .mkModalConteudo").innerHTML = "";
	}

	static mkAModal = async (
		url: string | null = null,
		modelo: string | null = null,
		conteudo: object | null = null
	) => {
		if (mk.Q("body .mkModalBloco") == null) {
			console.log("mkAModal() Build precisa construir");
			await mk.mkModalBuild();
			console.log("mkAModal() Após Build");
		}
		mk.mkModalClear();

		// POPULA MODAL com CONTEUDO
		if (conteudo != null) {
			if (modelo != null) {
				// Criar LoadTemplate com promise e colocar um await aqui quando terminar de popular o template.
				$(".mkModalBloco .mkModalConteudo").loadTemplate($(modelo), conteudo, {
					complete: function () {
						mk.mkExibirModalFull(url, modelo);
					},
				});
			} else {
				console.error("MODELO NULO");
			}
		} else {
			console.error("CONTEUDO NULO");
		}
		return console.log("ok");
	};

	static mkExibirModalFull = async (
		url: string | null = null,
		modelo: string
	) => {
		mk.Q("body .mkModalBloco").classList.remove("oculto");
		mk.Q("body").classList.add("mkSemScrollY");
		if (url != null) {
			await mk.mkAtualizarModalFull(url, modelo);
		} else {
			console.info("URL NULA! Usando dados já previamente armazenados.");
		}
		mk.aposModalFullAberto();
	};

	static mkAbrirModalFull_Hide = () => {
		mk.Q("body .mkModalBloco").classList.add("oculto");
		mk.Q("body").classList.remove("mkSemScrollY");
	};

	static mkAtualizarModalFull = async (url: string, modelo: string) => {
		let retorno = await mk.http(url, mk.t.G, mk.t.J);
		if (retorno != null) {
			// objetoSelecionado fica disponivel durante a tela Detail
			mk.objetoSelecionado = mk.mkFormatarOA(mk.aoReceberDados(retorno)); // <= Ao Receber Dados
			console.group("MODAL: Set Selecionado: ");
			console.info(mk.objetoSelecionado);
			console.groupEnd();
			$(".mkModalBloco .mkModalConteudo").loadTemplate(
				$(modelo),
				mk.objetoSelecionado,
				{
					complete: function () {
						console.info("Modelo Atualizado com sucesso. (Fim)");
					},
				}
			);
		} else {
			console.info("URL Atualizar o modal retornou falha.");
		}
	};
}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			OBJETOS CONSTANTES					\\
//___________________________________\\
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

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			TEST												\\
//___________________________________\\
//mk.iniciarGetList("./Teste.json");

// mk.http("./Teste.json", t.G, t.J, null, true);
// mk.http("./index.html", t.G, t.H, null, true);
// mk.http("./index.html?post=json", t.P, t.J, { a: "teste" }, true);
// let fd = new FormData();
// fd.append("bb", "testeb");
// mk.http("./index.html?post=form", t.P, t.F, fd, true);
