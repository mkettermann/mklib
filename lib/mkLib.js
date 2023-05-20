// Dependencias a retirar:
// - $ JQuery Framework JS
// - $ Load
// - $ Mask
// - $ Print
// - $ Unobtrutive Validate (Está vinculado ao Data Annotation do C#)
// - $ LoadTemplate
// - Bootstrap Toast
// - Bootstrap Dropdown
// - Bootstrap Modal
var mkt1; // Variavel de Testes;
class Mk {
	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			VARIAVEIS GLOBAIS						\\
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

	/*----------------------------------/
	\			MK REQUEST (REST API)					\
	/----------------------------------*/
	static GetJson = (
		UrlRequest,
		exeSuccess,
		exeError = Mk.fHttpCatchError,
		cfgHeader = null,
		boolCarregador = false
	) => {
		cfgHeader == null ? (cfgHeader = Mk.getJson()) : null;
		if (boolCarregador) {
			Mk.CarregarON();
		}
		console.info(">> URL: " + UrlRequest);
		fetch(UrlRequest, cfgHeader)
			.then((response) => Mk.fJsonReturn(response))
			.then((data) => exeSuccess(Mk.fResposta(data, boolCarregador)))
			.catch((err) => exeError(Mk.fResposta(err, boolCarregador)));
	};

	static GetText = (
		query,
		UrlDownload,
		exeSuccess = Mk.TextToInner,
		exeError = Mk.fHttpCatchError,
		cfgHeader = null,
		boolCarregador = false
	) => {
		cfgHeader == null ? (cfgHeader = Mk.getHtml()) : null;
		if (boolCarregador) {
			Mk.CarregarON();
		}
		console.info(">> URL: " + UrlDownload);
		fetch(UrlDownload, cfgHeader)
			.then((response) => Mk.fHttpReturn(response))
			.then((html) => exeSuccess(query, Mk.fResposta(html, boolCarregador)))
			.catch((err) => exeError(Mk.fResposta(err, boolCarregador)));
	};

	/*----------------------------------/
	\			HTTP METHOD	(HEADER)					\
	/----------------------------------*/
	static getJson = () => {
		// MASTER SEE GET JSON
		//console.info("GET JSON");
		return {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"MKANTI-FORGERY-TOKEN": document.getElementsByName(
					"__RequestVerificationToken"
				)[0]
					? document.getElementsByName("__RequestVerificationToken")[0]["value"]
					: null,
			},
		};
	};

	static getHtml = () => {
		// MASTER SEE GET HTML
		console.info("GET HTML");
		return {
			method: "GET",
			headers: {
				"Content-Type": "text/html",
				"MKANTI-FORGERY-TOKEN": document.getElementsByName(
					"__RequestVerificationToken"
				)[0]
					? document.getElementsByName("__RequestVerificationToken")[0]["value"]
					: null,
			},
		};
	};

	static postForm = (formdata) => {
		// MASTER SEE UPLOAD FORM
		console.groupCollapsed("POST - FORM:");
		console.info(formdata);
		console.groupEnd();
		return {
			method: "POST",
			headers: {
				"MKANTI-FORGERY-TOKEN": document.getElementsByName(
					"__RequestVerificationToken"
				)[0]
					? document.getElementsByName("__RequestVerificationToken")[0]["value"]
					: null,
			},
			body: formdata,
		};
	};

	static postJson = (data) => {
		// MASTER SEE UPLOAD JSON
		console.groupCollapsed("POST - JSON:");
		console.info(data);
		console.groupEnd();
		return {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"MKANTI-FORGERY-TOKEN": document.getElementsByName(
					"__RequestVerificationToken"
				)[0]["value"],
			},
			body: data,
		};
	};

	// HTTP INFO
	static fJsonReturn = (response) => {
		if (!response.ok) {
			console.groupCollapsed("HTTP INFO: " + response.status);
			console.info(
				response.status + " " + response.statusText + " => " + response.url
			);
			console.info(response.text()); // Exibir o erro no console;
			console.trace();
			console.groupEnd();
			throw new Error(
				response.status + " " + response.statusText + " (" + response.url + ")"
			);
		}
		return response.json();
	};

	static fHttpReturn = (response) => {
		if (!response.ok) {
			console.groupCollapsed("HTTP INFO: " + response.status);
			console.info(
				response.status + " " + response.statusText + " => " + response.url
			);
			console.info(response.text()); // Exibir o erro no console;
			console.trace();
			console.groupEnd();
			throw new Error(response.status);
		}
		return response.text();
	};

	// Ao passar pela resposta (Funcao de Ligacao) (A resposta pode conter dados, vazio ou erros)
	static fResposta = (resposta, exeCarregador) => {
		if (exeCarregador) {
			Mk.CarregarOFF();
		}
		// MASTER SEE HTTP RETURN
		console.groupCollapsed("GET - Resposta:");
		console.info(resposta);
		console.groupEnd();
		return resposta; // Vira o ParsedData
	};

	// HTTP UI FAIL PADRAO
	static fHttpCatchError = (parsedData) => {
		// console.groupCollapsed("HTTP CATCH: ");
		// console.info(parsedData);
		// console.groupEnd();
	};

	// HTTP UI HTML GET
	static TextToInner = function (query, html) {
		let e = Mk.Q(query);
		e.innerHTML = html;
	};

	/*----------------------------------/
	\       LISTAGEM DE DADOS - BASE   /
	/--------------------------------*/

	// LER (cRud) Metodo que inicia a coleta.
	static iniciarGetList = (urlDoGetList) => {
		Mk.Q("input[name='tablePorPagina']").addEventListener("input", () => {
			Mk.atualizarPorPagina();
		});
		Mk.GetJson(urlDoGetList, Mk.fIniciarDistribuir);
	};

	// Preeenchimento das variaveis e Gatilhos de correcao de lista.
	static fIniciarDistribuir = (retornou) => {
		Mk.mkBoolToStringOA(Mk.mkLimparOA(retornou));
		if (Array.isArray(retornou)) {
			for (let i = 0; i < retornou.length; i++) {
				Mk.aoReceberDados(retornou[i]);
			}
		} else {
			if (typeof retornou == "object") {
				Mk.aoReceberDados(retornou);
			}
		}
		this.fullDados = this.exibeDados = retornou;
		Mk.mkUpdateFiltro(); // Se remover aqui, verificar objFiltro em PlacasFixas
	};

	// GET OBJ - Retorna O objeto de uma Lista
	static getObjetoFromId = (nomeKey, valorKey, listaDados) => {
		let temp = {};
		if (Array.isArray(listaDados)) {
			for (let i = 0; i < listaDados.length; i++) {
				if (listaDados[i][nomeKey] == valorKey) {
					temp = listaDados[i];
					break;
				}
			}
		} else {
			temp = null;
		}
		return temp;
	};

	// SET OBJ - Retorna a lista com o objeto modificado
	static setObjetoFromId = (
		nomeKey,
		valorKey,
		itemModificado,
		listaDados
	) => {};

	// DEL OBJ - Retorna a lista sem o objeto informado
	static delObjetoFromId = (nomeKey, valorKey, listaDados) => {
		let temp = [];
		if (Array.isArray(listaDados)) {
			for (let i = 0; i < listaDados.length; i++) {
				if (listaDados[i][nomeKey] != valorKey) {
					temp.push(listaDados[i]);
				}
			}
		} else {
			temp = listaDados;
		}
		return temp;
	};

	// Metodo que eh executado sempre que um dado for recebido. (PODE SOBREESCREVER NA VIEW)
	static aoReceberDados = (data) => {
		return data;
	};

	static aposModalFullAberto = () => {};

	// Metodo que eh executado ao completar a exibicao (PODE SOBREESCREVER NA VIEW)
	static aoCompletarExibicao = () => {};

	// Metodo que eh executado antes de exibir (PODE SOBREESCREVER NA VIEW)
	static antesDePopularTabela = () => {};

	// Atualiza as variáveis de status, para exibir e calcular baseado nelas
	static atualizarStatusLista = () => {
		if (Mk.Q("input[name='tablePorPagina']") == null) {
			Mk.status.pagPorPagina = 5;
		} else {
			Mk.status.pagPorPagina = Number(
				Mk.Q("input[name='tablePorPagina']").value
			);
		}
		Mk.status.totalFull = this.fullDados.length;
		Mk.status.totalFiltrado = this.exibeDados.length;
		Mk.status.totalPorPagina = this.exibePaginado.length;
		Mk.status.pagItensIni =
			(this.paginationAtual - 1) * Mk.status.pagPorPagina + 1; // Calculo Pagination
		Mk.status.pagItensFim =
			Mk.status.pagItensIni + (Mk.status.pagPorPagina - 1); // Calculo genérico do último
		if (Mk.status.pagItensFim > Mk.status.totalFiltrado) {
			Mk.status.pagItensFim = Mk.status.totalFiltrado; // Na última página não pode exibir o valor genérico.
		}

		// Arredondar pra cima, pois a última página pode exibir conteúdo sem preencher o PorPagina
		Mk.status.totalPaginas = Math.ceil(
			this.exibeDados.length / Mk.status.pagPorPagina
		);
	};

	/**
	 * ATUALIZA a listagem com os dados ja ordenados de fullDados;
	 * Executa a filtragem dos dados;
	 * POPULA a lista atravez de uma nova lista: exibePaginado;
	 */
	static atualizarLista = () => {
		let tablePaginacao = Mk.Q(".tablePaginacao");
		// Apenas executa a atualização e filtro, se a tablePaginacao estiver presente na página.
		if (tablePaginacao) {
			Mk.mkFiltragemDados(); // Popular exibeDados

			Mk.atualizarStatusLista();
			// Atualizar os Status
			let labelTotal = Mk.Q(".tableResultado .tableTotal");
			if (labelTotal != null) {
				labelTotal.innerHTML = Mk.status.totalFull.toString();
			}
			let labelFiltrado = Mk.Q(".tableResultado .tableFiltrado");
			if (labelFiltrado != null) {
				labelFiltrado.innerHTML = Mk.status.totalFiltrado.toString();
			}
			let labelInicio = Mk.Q(".tableResultado .tableIni");
			if (labelInicio != null) {
				labelInicio.innerHTML = Mk.status.pagItensIni.toString();
			}
			let labelFinal = Mk.Q(".tableResultado .tableFim");
			if (labelFinal != null) {
				labelFinal.innerHTML = Mk.status.pagItensFim.toString();
			}

			if (this.exibeDados.length > Mk.status.pagPorPagina) {
				Mk.Q(".tablePaginacao").removeAttribute("hidden");
			} else {
				Mk.Q(".tablePaginacao").setAttribute("hidden", "");
			}
			if (this.exibeDados.length == 0) {
				Mk.Q(".tableInicioFim").setAttribute("hidden", "");
				Mk.Q(".tableExibePorPagina").setAttribute("hidden", "");
				Mk.Q(".listBody").setAttribute("hidden", "");
				this.exibePaginado = [];
			} else {
				Mk.Q(".tableInicioFim").removeAttribute("hidden");
				Mk.Q(".tableExibePorPagina").removeAttribute("hidden");
				Mk.Q(".listBody").removeAttribute("hidden");

				Mk.filtraPagination();
				Mk.antesDePopularTabela();

				// RESOLVER: Criar Funções de geração de template em javascript.
				$(
					"div.boxMain div.boxTable table.tableListagem tbody.listBody"
				).loadTemplate(Mk.Q("#template"), Mk.exibePaginado, {
					complete: Mk.aoCompletarExibicao,
				});
			}
		}
	};

	static adicionarDados = (objDados) => {
		this.fullDados.push(Mk.mkBoolToStringOA(Mk.aoReceberDados(objDados)));
		Mk.ordenarDados();
		Mk.atualizarLista();
	};

	static editarDados = (objDados, nomeKey, valorKey) => {
		// Implementar setObjetoFromId
		this.fullDados = Mk.delObjetoFromId(nomeKey, valorKey, this.fullDados);
		this.fullDados.push(Mk.mkBoolToStringOA(Mk.aoReceberDados(objDados)));
		Mk.ordenarDados();
		Mk.atualizarLista();
	};

	static excluirDados = (nomeKey, valorKey) => {
		this.fullDados = Mk.delObjetoFromId(nomeKey, valorKey, this.fullDados);
		Mk.ordenarDados();
		Mk.atualizarLista();
	};

	/*----------------------------------/
	\       LISTAGEM - PAGINACAO       /
	/--------------------------------*/

	// Retorna a pagina 1 e atualiza
	static atualizarPorPagina = () => {
		this.paginationAtual = 1;
		Mk.atualizarLista();
	};

	// Gatilho para trocar a pagina
	static mudaPagina = (e) => {
		// vem o this do evento / 'next' / 'back'
		if (e == "next") {
			this.paginationAtual += 1;
		} else if (e == "back") {
			this.paginationAtual -= 1;
		} else {
			this.paginationAtual = Number(e.innerHTML);
		}
		Mk.atualizarLista();
	};

	// Torna ativo o botao que se refere ao paginationAtual
	static ativaPaginaAtual = () => {
		Mk.QAll(".paginate_button").forEach((item) => {
			item.classList.remove("active");
		});
		Mk.QAll(".paginate_button .page-link").forEach((item) => {
			if (this.paginationAtual == Number(item.innerHTML)) {
				item.parentElement.classList.add("active");
			}
		});
	}; // Desativa e ativa botao correto

	// Monta os botoes de numero de pagina
	static filtraPagination = () => {
		// Status
		Mk.Q(".tableResultado .tableIni").innerHTML =
			Mk.status.pagItensIni.toString();
		Mk.Q(".tableResultado .tableFim").innerHTML =
			Mk.status.pagItensFim.toString();
		// Links
		Mk.Q(".tablePaginacao .paginate_Ultima a").innerHTML =
			Mk.status.totalPaginas.toString();

		if (this.paginationAtual == 1) {
			Mk.Q(".tablePaginacao .pagBack").classList.add("disabled");
		} else {
			Mk.Q(".tablePaginacao .pagBack").classList.remove("disabled");
		}
		if (this.paginationAtual >= Mk.status.totalPaginas) {
			Mk.Q(".tablePaginacao .pagNext").classList.add("disabled");
		} else {
			Mk.Q(".tablePaginacao .pagNext").classList.remove("disabled");
		}
		if (Mk.status.totalPaginas > 2) {
			Mk.Q(".tablePaginacao .pageCod2").classList.remove("oculto");
		} else {
			Mk.Q(".tablePaginacao .pageCod2").classList.add("oculto");
		}
		if (Mk.status.totalPaginas > 3) {
			Mk.Q(".tablePaginacao .pageCod3").classList.remove("oculto");
		} else {
			Mk.Q(".tablePaginacao .pageCod3").classList.add("oculto");
		}
		if (Mk.status.totalPaginas > 4) {
			Mk.Q(".tablePaginacao .pageCod4").classList.remove("oculto");
		} else {
			Mk.Q(".tablePaginacao .pageCod4").classList.add("oculto");
		}
		if (Mk.status.totalPaginas > 5) {
			Mk.Q(".tablePaginacao .pageCod5").classList.remove("oculto");
		} else {
			Mk.Q(".tablePaginacao .pageCod5").classList.add("oculto");
		}
		if (Mk.status.totalPaginas > 6) {
			Mk.Q(".tablePaginacao .pageCod6").classList.remove("oculto");
		} else {
			Mk.Q(".tablePaginacao .pageCod6").classList.add("oculto");
		}
		if (this.paginationAtual < 5) {
			// INI
			Mk.Q(".tablePaginacao .pageCod2").classList.remove("disabled");
			Mk.Q(".tablePaginacao .pageCod2 a").innerHTML = "2";
			Mk.Q(".tablePaginacao .pageCod3 a").innerHTML = "3";
			Mk.Q(".tablePaginacao .pageCod4 a").innerHTML = "4";
			Mk.Q(".tablePaginacao .pageCod5 a").innerHTML = "5";
			Mk.Q(".tablePaginacao .pageCod6 a").innerHTML = "...";
			Mk.Q(".tablePaginacao .pageCod6").classList.add("disabled");
		} else {
			// END
			if (Mk.status.totalPaginas - this.paginationAtual < 4) {
				Mk.Q(".tablePaginacao .pageCod2").classList.add("disabled");
				Mk.Q(".tablePaginacao .pageCod2 a").innerHTML = "...";
				Mk.Q(".tablePaginacao .pageCod3 a").innerHTML = (
					Mk.status.totalPaginas - 4
				).toString();
				Mk.Q(".tablePaginacao .pageCod4 a").innerHTML = (
					Mk.status.totalPaginas - 3
				).toString();
				Mk.Q(".tablePaginacao .pageCod5 a").innerHTML = (
					Mk.status.totalPaginas - 2
				).toString();
				Mk.Q(".tablePaginacao .pageCod6 a").innerHTML = (
					Mk.status.totalPaginas - 1
				).toString();
				Mk.Q(".tablePaginacao .pageCod6").classList.remove("disabled");
			} else {
				// MID
				Mk.Q(".tablePaginacao .pageCod2").classList.add("disabled");
				Mk.Q(".tablePaginacao .pageCod2 a").innerHTML = "...";
				Mk.Q(".tablePaginacao .pageCod3 a").innerHTML = (
					this.paginationAtual - 1
				).toString();
				Mk.Q(".tablePaginacao .pageCod4 a").innerHTML =
					this.paginationAtual.toString();
				Mk.Q(".tablePaginacao .pageCod5 a").innerHTML = (
					this.paginationAtual + 1
				).toString();
				Mk.Q(".tablePaginacao .pageCod6 a").innerHTML = "...";
				Mk.Q(".tablePaginacao .pageCod6").classList.add("disabled");
			}
		}
		Mk.ativaPaginaAtual();
		this.exibePaginado = [];
		// Clonagem de Paginado
		this.exibeDados.forEach((item, i) => {
			if (i + 1 >= Mk.status.pagItensIni && i + 1 <= Mk.status.pagItensFim) {
				let objItem = new Object();
				let o = item;
				for (var propName in o) {
					// Se converter toString aqui, tratar Objetos de forma diferente
					objItem[propName] = o[propName];
				}
				this.exibePaginado.push(objItem);
			}
		});
	};

	/*----------------------------------/
	\       ORDENAMENTO (SORT)         /
	/--------------------------------*/

	static GerarAoSort = (trHeadPai = "table.tableListagem thead tr") => {
		let eTrHeadPai = Mk.Q(trHeadPai);
		Array.from(eTrHeadPai.children).forEach((th) => {
			th.classList.forEach((classe) => {
				// Verifica se contém sort- no inicio da class
				if (classe.indexOf("sort-") == 0) {
					let campo = classe.replace("sort-", "");
					if (campo != "") {
						Mk.Ao("click", "thead tr .sort-" + campo, () => {
							Mk.inverteDir(campo);
						});
					}
				}
			});
		});
	};

	// Funcao que inverte a direcao, reordena e atualiza
	static inverteDir = (ordenar = null) => {
		if (ordenar != null) {
			if (ordenar != this.sortBy) {
				this.sortDir = "a";
			} else {
				this.sortDir == "a" ? (this.sortDir = "d") : (this.sortDir = "a");
			}
			this.sortBy = ordenar;
		}
		Mk.ordenarDados();
		Mk.atualizarLista();
	};

	// Funcao que ordena os dados
	static ordenarDados = () => {
		// Array é ordenada
		this.fullDados.sort((oA, oB) => {
			if (oA[this.sortBy] !== oB[this.sortBy]) {
				if (oA[this.sortBy] > oB[this.sortBy]) return 1;
				if (oA[this.sortBy] < oB[this.sortBy]) return -1;
			}
			return 0;
		});
		if (this.sortDir == "d") {
			this.fullDados = this.fullDados.reverse();
		}
		// Limpa mkSorting
		let thsAll = Mk.QAll("th");
		if (thsAll.length != 0) {
			thsAll.forEach((th) => {
				th.classList.remove("mkEfeitoDesce");
				th.classList.remove("mkEfeitoSobe");
			});
		}
		// Busca elemento que está sendo ordenado
		//console.log("Ordenando: " + this.sortBy + " EM: " + this.sortDir);
		let thsSort = Mk.QAll(".sort-" + this.sortBy);
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

	static ordenar = (
		array = this.fullDados,
		nomeProp = this.sortBy,
		reverse = false
	) => {
		array.sort((oA, oB) => {
			if (oA[nomeProp] !== oB[nomeProp]) {
				if (oA[nomeProp] > oB[nomeProp]) return 1;
				if (oA[nomeProp] < oB[nomeProp]) return -1;
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

	/*----------------------------------/
	\           AREA FILTRO            /
	/--------------------------------*/

	// LIMPAR FILTRO  LimparFiltro("#consulta_form"); //Passar o form que contem os SELECT/INPUT de filtro (search).
	static LimparFiltroUpdate = (form = "#consulta_form") => {
		Mk.LimparFiltro(form);
		Mk.atualizarLista();
	};

	// LIMPAR FILTRO  LimparFiltro("#consulta_form"); //Passar o form que contem os SELECT/INPUT de filtro (search).
	static LimparFiltro = (form = "#consulta_form") => {
		this.objFiltro = {};
		// RESET Form (Limpar seria "0" / "") (Set e.defaultValue)
		Mk.Q(form).reset();

		// Solicita Atualizacao de todos mkSel
		Mk.QAll("#consulta_form .mkSel").forEach((mkSel) => {
			mkSel.classList.add("atualizar");
		});

		// Alguns lugares precisarão ser refatorados:
		// - Verificar nos lugares onde pegava ou alterava o SELECT.
		// Reverificar funcionamento destes lugares:
		// -- LimparFiltro, UpdateFiltro, GerarFiltro, GerarObjeto (com FromEntries)...
		// Verificar nos locais onde o electpicker dava reflesh, e possivelmente esses locais precisam gerar o evento de input nos input.iConsultas.

		// LIMPAR Erros Unobtrutive Validate deste Form (Comentei para deletar no futuro, pois não sei se ainda occore após alterar os gatilhos mkValida)
		//Mk.QAll(form + " .field-validation-error span").forEach((e) => {
		//	e.innerHTML = "";
		//});
	};

	// Force Update Filtro ()
	static mkUpdateFiltro = () => {
		this.objFiltro = {};
		Mk.QAll("input.iConsultas").forEach((e) => {
			Mk.mkGerarFiltro(e);
		});
		Mk.QAll("select.iConsultas").forEach((e) => {
			Mk.mkGerarFiltro(e);
		});
		Mk.atualizarPorPagina();
	};

	// Gatilho FILTRO 4.0
	static mkSetFiltroListener = () => {
		Mk.QAll("input.iConsultas").forEach((e) => {
			e.addEventListener("input", () => {
				Mk.mkGerarFiltro(e);
			});
		});
		Mk.QAll("select.iConsultas").forEach((e) => {
			e.addEventListener("change", () => {
				Mk.mkGerarFiltro(e);
			});
		});
	};

	// FILTRO 4.0
	static mkGerarFiltro = (e) => {
		// Para ignorar filtro: data-mkfignore="true" (Ou nao colocar o atributo mkfformato no elemento)
		if (e.value != null && e.getAttribute("data-mkfignore") != true) {
			Mk.objFiltro[e.name] = {
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
		Mk.atualizarPorPagina();
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
			let temp = [];
			this.fullDados.forEach((o) => {
				let podeExibir = true; // Verificara cada prop, logica de remocao seletiva.
				for (let propFiltro in Mk.objFiltro) {
					// Cada Propriedade de Cada Item da Array
					if (o[propFiltro] != null) {
						// Cruzar referencia com objFiltro e se so avancar se realmente for um objeto
						let m = o[propFiltro]; // m representa o dado do item
						let k = this.objFiltro[propFiltro]; // k representa a config do filtro para essa propriedade
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
								JSON.parse(k.conteudo).map((numeroK) => {
									// A cada numero encontrado pos split na string do item verificado
									filtroInvertido = numerosMDaString.some((numeroM) => {
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
							let m = o[propNameItem];
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

	/*----------------------------------/
	\      MK VALIDADOR de FORMS       /
	/--------------------------------*/

	// mkValidaFull(atualForm, trocaFaseLiberado, destinoFase)
	// Funcao Recursiva: Executa mkAindaPendente ate a resposta do HTTP retornar.
	// Parametro(formulario)        Formulario em jQuery para validar
	// Parametro(fUIValidou)        Funcao a ser executada apos a validacao ser aprovada e recebida
	// Parametro(varRepassaA)       Variavel/Objeto que pode ser passada da solicitacao ate a resposta.
	static mkValidaFull = (form, fUIValidou, varRepassaA = null) => {
		Mk.mkCountValidate++;
		if (Mk.verificarCampos(form)) {
			let liberado = false;
			if (Mk.mkAindaPendente(form)) {
				if (Mk.mkCountValidate < 250) {
					Mk.CarregarON();
					setTimeout(() => {
						Mk.mkValidaFull(form, fUIValidou, varRepassaA);
					}, 10);
				} else {
					Mk.CarregarOFF();
					gerarToastErro(
						"&nbsp; Um ou mais campos do formul&aacute;rio n&atilde;o puderam ser validados por falta de resposta do servidor."
					);
				}
				return false;
			} else {
				liberado = true;
			}
			if (liberado) {
				Mk.CarregarOFF();
				fUIValidou(varRepassaA);
			}
		} else {
			if (Mk.mkCountValidate < 2) {
				//Auto reexecutar pois o parse do unobtrutive se perde de primeira
				setTimeout(() => {
					// Validacaes assincronas exigem timer
					Mk.mkValidaFull(form, fUIValidou, varRepassaA);
				}, 10);
			}
			Mk.CarregarOFF(); // Loop infinito
		}
	};

	// $ Unobtrusive: form = atualForm
	static verificarCampos = (form) => {
		// Ignorara os campos com classe ignore
		$.data($(form)[0], "validator").settings.ignore = ":hidden";
		$.validator.unobtrusive.parse(form);
		var resultado = $(form).data("unobtrusiveValidation").validate();
		console.info("ModelState é Valido? " + resultado);
		return resultado;
	};

	// Funcao tipo isPendente para validacao para mkValida. Aqui valida Pendente apenas.
	static mkAindaPendente = (este) => {
		mkt1 = este;
		let form = este;
		if (typeof este != "object") {
			form = Mk.Q(este);
		}
		let temPendencia = false;
		form.querySelectorAll("input").forEach((e) => {
			if (Mk.isVisible(e)) {
				if (e.classList.contains("pending")) {
					temPendencia = true;
					e.classList.remove("valid");
					e.classList.add("input-validation-error");
				}
			}
		});
		return temPendencia;
	};

	/*----------------------------------/
	\           AREA FASEADO           /
	/--------------------------------*/

	// (OnClick BOTAO) FUNCAO VOLTAR A FASE
	static fUIFaseVoltar = (esteForm) => {
		let obj = {
			destinoFase: this.mkFaseAtual - 1,
			form: esteForm,
		};
		Mk.fUIFaseUpdateView(obj);
	};

	// (OnClick BOTAO) FUNCAO AVANCAR A FASE
	static fUIFaseAvancar = (esteForm) => {
		let obj = {
			destinoFase: this.mkFaseAtual + 1,
			form: esteForm,
		};
		Mk.mkValidaFull(obj.form, Mk.fUIFaseLiberarView, obj);
	};

	// (OnClick BOTAO) FUNCAO LINK PARA FASE ESPECIFICA
	static fUIFaseEspecifica = (e) => {
		let obj = {
			destinoFase: Number(e.getAttribute("data-pag")),
			form: Mk.getFormFrom(e),
		};
		if (
			obj.destinoFase < this.mkFaseAtual ||
			e.getAttribute("data-libera") == "true"
		) {
			Mk.mkValidaFull(obj.form, Mk.fUIFaseLiberarView, obj);
		}
	};

	static fUIFaseLiberarView = (obj) => {
		this.sendObjFull = Mk.mkGerarObjeto(obj.form);
		Mk.fUIFaseUpdateView(obj);
	};

	// FUNCAO PARA ATUALIZAR A TELINHA
	static fUIFaseUpdateView = (obj) => {
		for (
			var i = 1;
			i <= Number(Mk.Q(".mkUlFase").getAttribute("data-totalfases"));
			i++
		) {
			Mk.Q(".modalFase" + i).classList.add("oculto");
		}
		this.mkFaseAtual = obj.destinoFase;
		Mk.Q(".modalFase" + this.mkFaseAtual).classList.remove("oculto");
		Mk.Q(".btnVoltar").classList.add("disabled");
		if (this.mkFaseAtual > 1) {
			Mk.Q(".btnVoltar").classList.remove("disabled");
		}
		Mk.Q(".btnAvancar").classList.remove("oculto");
		Mk.Q(".btnEnviar").classList.add("oculto");
		if (
			this.mkFaseAtual >=
			Number(Mk.Q(".mkUlFase").getAttribute("data-totalfases"))
		) {
			Mk.Q(".btnAvancar").classList.add("oculto");
			Mk.Q(".btnEnviar").classList.remove("oculto");
		}
		Mk.fUIFaseUpdateLinkFase();
	};

	// FUNCAO PARA ATUALIZAR OS LINKS DE FASES
	static fUIFaseUpdateLinkFase = () => {
		Mk.QAll("ul.mkUlFase li a").forEach((e) => {
			e.parentElement.classList.remove("mkFaseBack");
			e.parentElement.classList.remove("mkFaseAtivo");
			e.parentElement.classList.remove("disabled");
			let eNumPag = Number(e.getAttribute("data-pag"));
			let bLibera = e.getAttribute("data-libera");
			if (this.mkFaseAtual > eNumPag) {
				e.parentElement.classList.add("mkFaseBack");
			}
			if (this.mkFaseAtual == eNumPag) {
				e.parentElement.classList.add("mkFaseAtivo");
			}
			if (bLibera == "false") {
				e.parentElement.classList.add("disabled");
			}
		});
	};

	/**
	 * Metodo de controle de grupos de abas.
	 * @param {any} este (Tag atual: this)
	 * @param {number} delay (Tempo em ms)
	 */
	static mkClicarNaAba = (este, delay) => {
		delay = 0;
		if (este != null) {
			let estaAba = Number(este.getAttribute("data-pag"));
			let listaAbas = este.parentElement.parentElement;
			listaAbas.querySelectorAll("a").forEach((e) => {
				e.classList.remove("active");
			});
			este.classList.add("active");
			for (let i = 1; i <= listaAbas.getAttribute("data-mkabas"); i++) {
				// Giro do 1 ao Total
				Mk.QAll(".mkAba" + i).forEach((e) => {
					if (i == estaAba) {
						e.classList.remove("oculto");
					} else {
						e.classList.add("oculto");
					}
				});
			}
		}
	};

	/*----------------------------------/
	\           CONVERSORES            /
	/--------------------------------*/

	// Converter de YYYY-MM-DD para DD/MM/YYYY
	static mkYYYYMMDDtoDDMMYYYY = (dataYYYYMMDD) => {
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
	static mkFormatarDataOA = (oa) => {
		function mkFormatarDataOA_Execute(o) {
			let busca = new RegExp("^[0-2][0-9]{3}[-][0-1][0-9][-][0-3][0-9]$"); // Entre 0000-00-00 a 2999-19-39
			for (var propName in o) {
				if (busca.test(o[propName])) {
					o[propName] = Mk.mkYYYYMMDDtoDDMMYYYY(o[propName]);
				}
			}
			return o;
		}
		return Mk.mkExecutaNoObj(oa, mkFormatarDataOA_Execute);
	};

	// Converter (OBJ / ARRAY) Formato Booleano em Sim/Não
	static mkBoolToSimNaoOA = (oa) => {
		function mkBoolToSimNaoOA_Execute(o) {
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
		return Mk.mkExecutaNoObj(oa, mkBoolToSimNaoOA_Execute);
	};

	// Converter (OBJ / ARRAY) Formato String em Booleano
	static mkStringToBoolOA = (oa) => {
		function mkStringToBoolOA_Execute(o) {
			for (var propName in o) {
				if (o[propName].toString().toLowerCase() === "true") {
					o[propName] = true;
				}
				if (o[propName].toString().toLowerCase() === "false") {
					o[propName] = false;
				}
			}
			return o;
		}
		return Mk.mkExecutaNoObj(oa, mkStringToBoolOA_Execute);
	};

	// Converter (OBJ / ARRAY) Formato Booleano em String
	static mkBoolToStringOA = (oa) => {
		function mkBoolToStringOA_Execute(o) {
			for (var propName in o) {
				if (o[propName] === true) {
					o[propName] = "true";
				}
				if (o[propName] === false) {
					o[propName] = "false";
				}
			}
			return o;
		}
		return Mk.mkExecutaNoObj(oa, mkBoolToStringOA_Execute);
	};

	// Converter (OBJ / ARRAY) Limpar Nulos e Vazios
	static mkLimparOA = (oa) => {
		function mkLimparOA_Execute(o) {
			for (var propName in o) {
				if (o[propName] === null || o[propName] === "") {
					delete o[propName];
				}
				if (Array.isArray(o[propName])) {
					if (o[propName].length <= 0) {
						delete o[propName];
					}
				}
			}
			return o;
		}
		return Mk.mkExecutaNoObj(oa, mkLimparOA_Execute);
	};

	// Converter (OBJ / ARRAY) Formatar para normalizar com a exibicao ao usuario.
	static mkFormatarOA = (oa) => {
		return Mk.mkBoolToSimNaoOA(Mk.mkFormatarDataOA(Mk.mkLimparOA(oa)));
	};

	/*----------------------------------/
	\       FUNCOES UTEIS (UTIL)       /
	/--------------------------------*/

	// Gerar Objeto a partir de um Form Entries
	static mkGerarObjeto = (este) => {
		let form = este;
		if (typeof este != "object") {
			form = Mk.Q(este);
		}
		let rObjeto = Mk.mkLimparOA(
			Object.fromEntries(new FormData(form).entries())
		);
		console.groupCollapsed("Objeto Gerado: ");
		console.info(rObjeto);
		console.groupEnd();
		return rObjeto;
	};

	/**
	 * Função que gera um Add Event Listener (Evento)
	 * @param {string} tipoEvento
	 * @param {string} query
	 * @param {any} executar
	 */
	static Ao = (tipoEvento = "click", query, executar) => {
		// CONVERTER PARA QUERY SELECTALL pois, tem o Pesquisar que pega todos os .iConsultas
		Mk.QAll(query).forEach((e) => {
			e.addEventListener(tipoEvento, () => {
				executar(e);
			});
		});
	};

	/**
	 * Atalho para QuerySelector que retorna apenas o primeiro elemento da query.
	 * @param {string} query
	 * @returns element
	 */
	static Q = (query = "body") => {
		if (query instanceof HTMLElement) return query;
		return document.querySelector(query);
	};

	/**
	 * Atalho para QuerySelectorAll. List []
	 * @param {string} query
	 * @returns element
	 */
	static QAll = (query = "body") => {
		if (query instanceof HTMLElement) return query;
		return document.querySelectorAll(query);
	};

	/**
	 *
	 * @param {string} query
	 * @param {any} valor
	 * @returns element
	 */
	static QSet = (query = "body", valor = null) => {
		if (valor != null) {
			Mk.Q(query).value = valor;
		} else {
			Mk.Q(query).value = "";
		}
		return Mk.Q(query);
	};

	/**
	 * Seta todos os query com os valores das propriedades informadas nos campos.
	 * O nome da propriedade precisa ser compatível com o PROPNAME do query.
	 * @param {string} query
	 * @param {object} obj
	 * @returns [elements] modificados
	 */
	static QSetAll = (query = "input[name='#PROP#']", obj = null) => {
		let eAfetados = [];
		if (typeof obj == "object" && !Array.isArray(obj)) {
			if (obj.length != 0) {
				for (let p in obj) {
					let eDynamicQuery = Mk.Q(query.replace("#PROP#", p));
					if (eDynamicQuery) {
						if (obj[p]) {
							eDynamicQuery.value = obj[p];
							eDynamicQuery.classList.add("atualizar");
							eAfetados.push(eDynamicQuery);
						}
					}
				}
			} else console.warn("QSetAll - Array Vazia");
		} else console.warn("QSetAll - Precisa receber um objeto");
		return eAfetados;
	};

	static Qon = (query = "body") => {
		let temp = Mk.Q(query);
		temp.disabled = null;
		temp.classList.remove("disabled");
		return temp;
	};

	static Qoff = (query = "body") => {
		let temp = Mk.Q(query);
		temp.disabled = true;
		temp.classList.add("disabled");
		return temp;
	};

	static QverOn = (query = "body") => {
		let temp = Mk.Q(query);
		temp.classList.remove("oculto");
		return temp;
	};

	static QverOff = (query = "body") => {
		let temp = Mk.Q(query);
		temp.classList.add("oculto");
		return temp;
	};

	static QdataGet = (query = "body", atributoNome) => {
		return Mk.Q(query).getAttribute("data-" + atributoNome);
	};

	static QdataSet = (query = "body", atributoNome, atributoValor) => {
		return Mk.Q(query).setAttribute("data-" + atributoNome, atributoValor);
	};

	// static QaSet = (query = "body", atributoNome, atributoValor) => {
	// 	return Mk.Q(query).setAttribute(atributoNome, atributoValor);
	// };

	// static QaGet = (query = "body", atributoNome) => {
	// 	return Mk.Q(query).getAttribute(atributoNome);
	// };

	static GetParam = (name = null) => {
		if (name != null) {
			return new URL(document.location).searchParams.get(name);
		} else {
			return new URL(document.location).searchParams;
		}
	};

	// Verifica se ARRAY ou OBJETO e executa a função FUNC a cada objeto dentro de OA.
	static mkExecutaNoObj = (oa, func) => {
		if (Array.isArray(oa)) {
			for (let i = 0; i < oa.length; i++) {
				func(oa[i]);
			}
		} else {
			func(oa);
		}
		return oa;
	};

	static isVisible = (e) => {
		return (
			e.offsetWidth > 0 || e.offsetHeight > 0 || e.getClientRects().length > 0
		);
	};

	static isFloat = (x) => {
		if (!isNaN(x)) {
			if (parseInt(x) != parseFloat(x)) {
				return true;
			}
		}
		return false;
	};

	static isJson = (s) => {
		try {
			JSON.parse(s);
		} catch (e) {
			return false;
		}
		return true;
	};

	/**
	 * Permite a atualização do JSON de um seletor mkSel por url
	 * @param {string} eName		Elemento JS
	 * @param {string} url	String URL de consulta
	 */
	static mkSelDlRefill = (eName, cod = null) => {
		let e = Mk.Q(eName);
		let urlColeta = appPath + e.getAttribute("data-refill");
		cod != null ? (urlColeta += cod) : null;
		Mk.GetJson(
			urlColeta,
			(parsedData) => {
				let kv = parsedData;
				if (typeof parsedData == "object") {
					kv = JSON.stringify(parsedData);
				}
				if (Mk.isJson(kv)) {
					e.setAttribute("data-selarray", kv);
					e.classList.add("atualizar");
				} else {
					console.error("Resultado não é um JSON. (mkSelDlRefill)");
				}
			},
			null
		);
	};

	// Get Server On
	static getServerOn = (urlDestino) => {
		Mk.GetJson(
			urlDestino,
			(parsedData) => {
				if (parsedData !== true) {
					Mk.detectedServerOff();
				}
			},
			Mk.detectedServerOff,
			this.getJson,
			false
		);
	};

	static detectedServerOff = () => {
		if (Mk.Q("body .offlineBlock") == null) {
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
		Mk.Q("body .offlineBlock").classList.remove("oculto");
	};
	static detectedServerOff_display = () => {
		Mk.Q("body .offlineBlock").classList.add("oculto");
	};

	// Eventos HTML5
	// Bloqueio de teclas especificas onKeyDown
	static mkOnlyFloatKeys = (e) => {
		// Input: UMA tecla QUALQUER
		let tecla = e.key;
		//=> Metodo filtrar: Bloquear apenas estes
		//let proibido = "0123456789";
		//let isNegado = false;
		//for (var item in proibido) {
		//    (item == tecla) ? isNegado = true : null;
		//}
		//=> Metodo filtrar: Liberar apenas estes
		let permitido = "0123456789,-";
		let isNegado = true;
		for (var i = 0; i < permitido.length; i++) {
			if (permitido[i] == tecla.toString()) {
				//console.log(permitido[i] + " == " + tecla.toString());
				isNegado = false;
			}
		}

		//=> Teclas especiais
		tecla == "ArrowLeft" ? (isNegado = false) : null; // Liberar Setinha pra Esquerda
		tecla == "ArrowRight" ? (isNegado = false) : null; // Liberar Setinha pra Direita
		tecla == "Backspace" ? (isNegado = false) : null; // Liberar Backspace
		tecla == "Delete" ? (isNegado = false) : null; // Liberar Deletar
		tecla == "Tab" ? (isNegado = false) : null; // Liberar Deletar
		isNegado ? e.preventDefault() : null;
	};
	// Bloqueios de eventos especificos (varios, exemplo: onContextMenu)
	static mkEventBlock = (e) => {
		console.error("Negado");
		e.preventDefault();
	};

	// Imprimir e Exportar de ListaPrecos
	static mkTrocaPontoPorVirgula = (query) => {
		Mk.QAll(query).forEach((e) => {
			e.innerHTML = e.innerHTML.replaceAll(".", ",");
		});
	};

	// Seleciona texto do elemento
	static mkSelecionarInner = (este) => {
		//if (document.body.createTextRange) {
		// let range = document.body.createTextRange();
		// range.moveToElementText($(".sort-vlrPrecoMinimo")[1]);
		// range.select();
		if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(este);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	};

	static mkInputFormatarValor = (e) => {
		// 123,45 (2 casas pos conversao float)
		e.value = Mk.mkDuasCasas(e.value);
	};

	static mkMedia = (menor, maior) => {
		return Mk.mkDuasCasas((Mk.mkFloat(menor) + Mk.mkFloat(maior)) / 2);
	};

	static mkFloat = (num) => {
		let ret = num;
		if (typeof num != "number") {
			ret = parseFloat(ret.toString().replaceAll(".", "").replaceAll(",", "."));
		}
		if (isNaN(ret)) {
			ret = 0;
		}
		return ret;
	};

	static mkDuasCasas = (num) => {
		return Mk.mkFloat(num).toFixed(2).replaceAll(".", ","); // 2000,00
		//        .toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // 2.000,00
	};

	static mkEmReais = (num) => {
		return Mk.mkFloat(num).toLocaleString("pt-br", {
			style: "currency",
			currency: "BRL",
		}); // R$ 12.123,45
	};

	static mkBase64 = (arquivo, tagImg, tagHidden) => {
		// Verificar se esta nulo
		let leitor = new FileReader();
		leitor.onload = () => {
			Mk.Q(tagImg).src = leitor.result;
			Mk.Q(tagHidden).value = leitor.result;
		};
		leitor.readAsDataURL(arquivo);
	};

	/*const mkBase64_Old = (arquivo, tagImg) => {
		let leitor = new FileReader();
		leitor.onload = () => {
			$(tagImg).val(leitor.result);
		}
		leitor.readAsDataURL(arquivo);
	}*/

	// Clona tanto uma array quanto um objeto ao ser enviado por parametro.
	static mkClonarOA = (oa) => {
		if (Array.isArray(oa)) {
			let temp = [];
			oa.forEach((oriItem, i) => {
				let desItem = {};
				for (var propName in oriItem) {
					desItem[propName] = oriItem[propName];
				}
				temp.push(desItem);
			});
			return temp;
		} else {
			if (typeof oa === "object") {
				let temp = {};
				for (var propName in oa) {
					temp[propName] = oa[propName];
				}
				return temp;
			}
		}
	};

	// Sobe os elementos até encontrar o form pertencente a este elemento. (Se limita ao BODY)
	static getFormFrom = (e) => {
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
	static encheArray = (arrTemplate, inicio = 1, total) => {
		let novaArray = [];
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
	static encheArrayUltimos = (arrTemplate, fim = 1, total) => {
		let novaArray = [];
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

	// Retorna a data de Hoje no formato: DD/MM/YYYY
	static hoje = () => {
		let mkFullData = Mk.hojeMkData() + " " + Mk.hojeMkHora();
		return mkFullData;
	};

	// Retorna Data do cliente de Hoje em:  DD/MM/YYYY
	static hojeMkData = () => {
		return new Date(Mk.getMs()).toLocaleDateString();
	};

	static hojeMkHora = () => {
		return new Date(Number(Mk.getMs())).toLocaleTimeString();
	};

	// Retorna Milisegundos da data no formato Javascript
	static getMs = (dataYYYYMMDD = null) => {
		if (dataYYYYMMDD != null) {
			let dataCortada = dataYYYYMMDD.split("-");
			let oDia = Number(dataCortada[2]);
			let oMes = Number(dataCortada[1] - 1);
			let oAno = Number(dataCortada[0]);
			return new Date(oAno, oMes, oDia) - 0;
		} else return new Date() - 0;
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
		if (ms != null) return Number(Mk.getFullData(ms).split("-")[2]);
		else return Number(Mk.getFullData().split("-")[2]);
	};
	static getMes = (ms = null) => {
		if (ms != null) return Number(Mk.getFullData(ms).split("-")[1]);
		else return Number(Mk.getFullData().split("-")[1]);
	};
	static getAno = (ms = null) => {
		if (ms != null) return Number(Mk.getFullData(ms).split("-")[0]);
		else return Number(Mk.getFullData().split("-")[0]);
	};

	static getDiasDiferenca = (msOld, msNew = null) => {
		if (msNew == null) msNew = Mk.getHojeMS();
		return Mk.transMsEmDias(msNew - msOld);
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
	static transMsEmHoras = (h) => {
		return h * 3600000;
	};
	static transDiasEmMs = (d) => {
		return d * 86400000;
	};

	/*----------------------------------/
	\           LOADING                /
	/--------------------------------*/

	static CarregarON = () => {
		if (Mk.Q("body .CarregadorMkBlock") == null) {
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
		Mk.Q("body .CarregadorMkBlock").classList.remove("oculto");
		Mk.Q("body").classList.add("CarregadorMkSemScrollY");
	};
	static CarregarOFF = () => {
		if (Mk.Q("body .CarregadorMkBlock") != null) {
			Mk.Q("body .CarregadorMkBlock").classList.add("oculto");
		}
		Mk.Q("body").classList.remove("CarregadorMkSemScrollY");
	};

	/*----------------------------------/
	\              MODAL               /
	/--------------------------------*/

	static mkModalBuild = () => {
		return Promise.resolve(
			setTimeout(() => {
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
			}, 4000)
		);
	};

	static mkModalClear() {
		Mk.Q(".mkModalBloco .mkModalConteudo").innerHTML = "";
	}

	static mkAModal = async (url = null, modelo = null, conteudo = null) => {
		if (Mk.Q("body .mkModalBloco") == null) {
			console.log("mkAModal() Build precisa construir");
			await Mk.mkModalBuild();
			console.log("mkAModal() Após Build");
		}
		return console.log("ok");
	};

	static mkAbrirModalFull = (url = null, modelo = null, conteudo = null) => {
		// PREPARA MODAL - BUILD
		if (Mk.Q("body .mkModalBloco") == null) {
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
		}
		// LIMPA MODAL
		Mk.Q(".mkModalBloco .mkModalConteudo").innerHTML = "";

		// POPULA MODAL com CONTEUDO
		if (conteudo != null) {
			if (modelo != null) {
				$(".mkModalBloco .mkModalConteudo").loadTemplate($(modelo), conteudo, {
					complete: function () {
						Mk.mkExibirModalFull(url, modelo);
					},
				});
			} else {
				console.error("MODELO NULO");
			}
		}
	};

	static mkExibirModalFull = (url, modelo) => {
		Mk.Q("body .mkModalBloco").classList.remove("oculto");
		Mk.Q("body").classList.add("mkSemScrollY");
		Mk.mkAtualizarModalFull(url, modelo);
		Mk.aposModalFullAberto();
	};

	static mkAbrirModalFull_Hide = () => {
		Mk.Q("body .mkModalBloco").classList.add("oculto");
		Mk.Q("body").classList.remove("mkSemScrollY");
	};

	static mkAtualizarModalFull = (url = null, modelo = null) => {
		if (url != null) {
			Mk.GetJson(
				url,
				(parsedData) => {
					// objetoSelecionado fica disponivel durante a tela Detail
					Mk.objetoSelecionado = Mk.mkFormatarOA(Mk.aoReceberDados(parsedData)); // <= Ao Receber Dados
					if (modelo != null) {
						console.group("MODAL: Selecionado: ");
						console.info(Mk.objetoSelecionado);
						console.groupEnd();
						$(".mkModalBloco .mkModalConteudo").loadTemplate(
							$(modelo),
							Mk.objetoSelecionado,
							{
								complete: function () {},
							}
						);
					} else {
						console.error("MODELO VEIO NULO");
					}
				},
				function () {},
				this.getJson,
				false
			);
		} else {
			console.info("URL NULA! Usando dados já previamente armazenados.");
			Mk.mkExibirModalFull();
		}
	};

	/*------------------------------------/
	\       TITULOS CONSTANTES		     /
	/----------------------------------*/

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
}

/*------------------------------------/
\       OBJETOS CONSTANTES		     /
/----------------------------------*/
Object.defineProperty(Mk, "GetJson", {
	writable: false,
});
Object.defineProperty(Mk, "GetText", {
	writable: false,
});
Object.defineProperty(Mk, "CFG", {
	writable: false,
});

/*------------------------------------/
\       INIT					     /
/----------------------------------*/
Mk.mkClicarNaAba(Mk.Q(".mkAbas a.active"), 0); // Inicia no ativo
