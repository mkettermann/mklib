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

enum t {
	G = "GET", // Api Method GET
	P = "POST", // Api Method POST
	J = "application/json", // ContentType JSON
	H = "text/html", // ContentType HTML
	F = "multipart/form-data", // ContentType FORM
}

class mk {
	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			ATRIBUTOS										\\
	//___________________________________\\
	static fullDados = [];
	static exibeDados = [];
	static exibePaginado = [];
	static sortDir = "d";
	static sortBy = "";
	static paginationAtual = 1;
	static objFiltro = {};
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
	//			MK UTIL											\\
	//___________________________________\\

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

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			LISTAGEM										\\
	//___________________________________\\

	// Retorna a pagina 1 e atualiza
	static atualizarPorPagina = () => {
		this.paginationAtual = 1;
		mk.atualizarLista();
	};

	// LER (cRud) Metodo que inicia a coleta.
	static iniciarGetList = async (url: string): Promise<void> => {
		mk.Ao("input", "input[name='tablePorPagina']", () => {
			mk.atualizarPorPagina();
		});
		let retorno = await mk.http(url, t.G, t.J).then();
		if (retorno != null) {
			mk.mkBoolToStringOA(mk.mkLimparOA(retorno));
			if (Array.isArray(retorno)) {
				for (let i = 0; i < retorno.length; i++) {
					mk.aoReceberDados(retorno[i]);
				}
			} else {
				if (typeof retorno == "object") {
					mk.aoReceberDados(retorno);
				}
			}
			this.fullDados = this.exibeDados = retorno;
			mk.mkUpdateFiltro(); // Se remover aqui, verificar objFiltro em PlacasFixas
		}
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
		metodo: string = t.G,
		tipo: string = t.J,
		dados: any = null,
		carregador: boolean = false
	): Promise<object | null> => {
		const mkaft: HTMLInputElement = document.getElementsByName(
			"__RequestVerificationToken"
		)[0] as HTMLInputElement;
		let body: string | null = null;
		if (dados) {
			if (tipo == t.J) {
				body = JSON.stringify(dados);
			} else if (tipo == t.F) {
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
		console.groupCollapsed(">> Objeto Enviado");
		console.info(dados);
		console.info(body?.toString());
		console.groupEnd();
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
		if (tipo == t.J) {
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
}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			TEST												\\
//___________________________________\\
mk.iniciarGetList("./Teste.json");
// mk.http("./Teste.json", t.G, t.J, null, true).then((r) => {
// 	console.assert(r != null, "GET Json Falhou");
// });

// mk.http("./index.html", t.G, t.H, null, true).then((r) => {
// 	console.assert(r != null, "GET Html Falhou");
// });

// mk.http("./index.html?post=json", t.P, t.J, { a: "teste" }, true).then((r) => {
// 	console.assert(r != null, "Post JSON Falhou");
// });

// let fd = new FormData();
// fd.append("bb", "testeb");
// mk.http("./index.html?post=form", t.P, t.F, fd, true).then((r) => {
// 	console.assert(r != null, "Post FORM Falhou");
// });
