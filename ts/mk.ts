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
	J = "application/json", // Header Json
	H = "text/html", // Header HTML
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
			buttonCarregadorMkTopoDireito.setAttribute("onClick", "Mk.CarregarOFF()");
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
		sucesso: any = null,
		objeto: any = null,
		carregador: boolean = false
	) => {
		const mkaft: HTMLInputElement = document.getElementsByName(
			"__RequestVerificationToken"
		)[0] as HTMLInputElement;
		let h = {
			method: metodo!,
			headers: {
				"Content-Type": tipo!,
				"MKANTI-FORGERY-TOKEN": mkaft ? mkaft.value : "",
			},
			body: null,
		};
		if (objeto) h.body = objeto;
		if (carregador) {
			this.CarregarON();
		}
		console.groupCollapsed(h.method + ": " + url);
		console.time(url);
		console.info(">> TYPE: " + h.headers["Content-Type"]);
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
			return false;
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
		if (sucesso != null) sucesso(corpo);
		return true;
	};
}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			TEST												\\
//___________________________________\\
let json = mk.http("./Teste.json", t.G, t.J, null, null, true);
json.then((r) => {
	console.assert(r, "GET Json Falhou");
});

let html = mk.http("./index.html", t.G, t.H, null, null, true);
html.then((r) => {
	console.assert(r, "GET Html Falhou");
});

let post = mk.http("./index2.html", t.P, t.J, null, null, true);
post.then((r) => {
	console.assert(r, "POST Json Falhou");
});
