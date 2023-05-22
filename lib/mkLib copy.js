class Mk {
	/*----------------------------------/
	\      MK VALIDADOR de FORMS       /
	/--------------------------------*/

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
