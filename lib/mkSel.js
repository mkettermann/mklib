/* CRIA O DROPDOWN por FOCUS */
const mkSelRenderizar = () => {
	document.querySelectorAll("input.mkSel").forEach((e) => {
		// Transforma elemento se ele ainda não foi transformado
		if (!e.parentElement.classList.contains("mkSelBloco")) {
			// COLETA
			let ePai = e.parentElement;
			let ePos = Array.from(ePai.children).indexOf(e);
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
			ePai.insertBefore(divMkSeletorBloco, ePai.children[ePos]);
			divMkSeletorBloco.appendChild(e);
			divMkSeletorBloco.appendChild(divMkSeletorPesquisa);
			divMkSeletorBloco.appendChild(divMkSeletorList);
			divMkSeletorPesquisa.appendChild(divMkSeletorInputExibe);
			divMkSeletorPesquisa.appendChild(divMkSeletorInputExibeArrow);
			// Seta atributos e Getilhos
			divMkSeletorInputExibe.setAttribute("placeholder", "Filtro \u{1F50D}");
			divMkSeletorInputExibe.setAttribute(
				"onfocus",
				"mkSelPesquisaFocus(this)"
			);
			divMkSeletorInputExibe.setAttribute("onblur", "mkSelPesquisaBlur(this)");
			divMkSeletorInputExibe.setAttribute(
				"oninput",
				"mkSelPesquisaInput(this)"
			);
			// Popular Lista
			mkSelPopularLista(e);
			// Seleciona baseado no value do input
			mkSelUpdate(e);

			// TAMANHOS E POSICOES DA LISTA
			e.classList.add("mkSecreto");
		} else {
			// Atualiza a lista com base na classe "atualizar"
			if (e.classList.contains("atualizar")) {
				e.classList.remove("atualizar");
				e.value = "";
				mkSelPopularLista(e);
				mkSelUpdate(e);
			}
		}
	});
};
/* Ao Tentar Selecionar um novo item */
const mkSelSelecionar = (eItem) => {
	let ePrincipal = eItem.parentElement.parentElement.firstElementChild;
	// Obtem limite de seleções
	let selLimit = Number(ePrincipal.getAttribute("data-selapenas"));
	// Obtem seleções
	let selecoes = ePrincipal.value;
	if (mkIsJson(selecoes)) {
		selecoes = JSON.parse(selecoes);
	}
	// QUANDO O LIMITE é 1
	if (selLimit == 1) {
		// Muda valor do input pelo clicado e Gera o evento
		ePrincipal.value = eItem.getAttribute("data-k");
		ePrincipal.dispatchEvent(new Event("input"));
		// Transfere valor para o Display (Exibe)
		eItem.parentElement.previousElementSibling.firstElementChild.value =
			eItem.innerHTML;
	} else if (selLimit > 1 || selLimit < 0) {
		let itemK = eItem.getAttribute("data-k");
		// Verifica se já tem o item clicado, para saber se vai adicionar / remover
		let jaSelecionado = 0;
		// Forma um array caso ainda não seja, pois pode seleconar mais de um.
		let arraySelecionado = [];
		if (Array.isArray(selecoes)) {
			selecoes.forEach((itemS) => {
				arraySelecionado.push(itemS);
				if (itemS == itemK) jaSelecionado++;
			});
		} else {
			arraySelecionado.push(selecoes);
			if (selecoes == itemK) jaSelecionado++;
		}
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
			if (item == "")
				arraySelecionado.splice(arraySelecionado.indexOf(item), 1);
		});
		// Quando estiver vazio, limpa o campo.
		// Seta o valor no campo de input
		if (arraySelecionado.length == 0) {
			ePrincipal.value = "";
		} else {
			ePrincipal.value = JSON.stringify(arraySelecionado);
		}
		// Gera o Evento
		ePrincipal.dispatchEvent(new Event("input"));

		// Mantem foco no Display, pois pode selecionar mais de um
		setTimeout(() => {
			eItem.parentElement.previousElementSibling.firstElementChild.focus();
		}, 1);
	}
	mkSelUpdate(ePrincipal);
};

const mkSelPopularLista = (e) => {
	// GERA CADA ITEM DA LISTA COM BASE NO JSON
	if (e.getAttribute("data-selarray") != "") {
		e.nextElementSibling.nextElementSibling.innerHTML = "";
		try {
			let seletorArray = JSON.parse(e.getAttribute("data-selarray"));
			if (seletorArray != null) {
				seletorArray.forEach((o) => {
					let divMkSeletorItem = document.createElement("div");
					let divMkSeletorItemTexto = document.createElement("span");
					let divMkSeletorItemArrow = document.createElement("div");
					divMkSeletorItem.className = "mkSelItem";
					divMkSeletorItemArrow.className = "mkSelItemArrow";
					divMkSeletorItem.setAttribute("data-k", o.k);
					divMkSeletorItem.setAttribute("onmousedown", "mkSelSelecionar(this)");
					divMkSeletorItemTexto.innerHTML = o.v;
					divMkSeletorItem.appendChild(divMkSeletorItemTexto);
					divMkSeletorItem.appendChild(divMkSeletorItemArrow);
					e.nextElementSibling.nextElementSibling.appendChild(divMkSeletorItem);
				});
			}
		} catch {
			console.error(
				"Erro durante conversao para Json:" + e.getAttribute("data-selarray")
			);
		}
	}
};

/* EVENTO de Pesquisa (FOCUS) */
const mkSelPesquisaFocus = (e) => {
	mkt = e.parentElement.previousElementSibling;
	// Limpa Campo de Exibição
	e.value = "";
	// Limpa o resultado do filtro anterior
	let eList = e.parentElement.nextElementSibling;
	Array.from(eList.children).forEach((el) => {
		el.style.display = "";
	});
	// Posiciona E Redimenciona a lista.
	eList.style.top =
		e.parentElement.offsetTop + e.parentElement.offsetHeight + 1 + "px";
	eList.style.left = e.parentElement.offsetLeft + "px";
	eList.style.minWidth = e.parentElement.offsetWidth + "px";
};

/* EVENTO de Pesquisa (BLUR) */
const mkSelPesquisaBlur = (e) => {
	mkSelUpdate(e.parentElement.parentElement.firstElementChild);
};
/* EVENTO de Pesquisa (INPUT) */
const mkSelPesquisaInput = (e) => {
	Array.from(e.parentElement.nextElementSibling.children).forEach((el) => {
		let exibe = false;
		if (
			el.firstElementChild.innerHTML.toLowerCase().match(e.value.toLowerCase())
		) {
			exibe = true;
		}
		if (exibe) {
			el.style.display = "";
		} else {
			el.style.display = "none";
		}
	});
};

/* ATUALIZA Display e Selecionados*/
const mkSelUpdate = (e) => {
	let totAchou = 0;
	// let selApenas = e.getAttribute("data-selapenas");
	let seletorArray = e.getAttribute("data-selarray");
	if (e.getAttribute("data-selarray") != "") {
		try {
			let selecoes = e.value;
			if (mkIsJson(selecoes)) {
				selecoes = JSON.parse(selecoes);
			}
			if (mkIsJson(seletorArray)) {
				seletorArray = JSON.parse(seletorArray);
			}
			if (selecoes != null && seletorArray != null) {
				/* Desmarcar todos mkSelItem pra 0 */
				Array.from(e.nextElementSibling.nextElementSibling.children).forEach(
					(el) => {
						el.setAttribute("data-s", "0");
					}
				);
				// [{"k":"0","v":"Nao"},{"k":"1","v":"Sim"}]
				if (Array.isArray(seletorArray)) {
					seletorArray.forEach((o) => {
						if (Array.isArray(selecoes)) {
							selecoes.forEach((vSelecionado) => {
								if (vSelecionado == o.k) {
									mkSelSet(e, o);
									totAchou++;
								}
							});
						} else {
							if (selecoes == o.k) {
								mkSelSet(e, o);
								totAchou++;
							}
						}
					});
				}
			}
		} catch {
			console.error(
				"Erro ao converter Json! Valor: " +
					e.value +
					" - Lista:" +
					e.getAttribute("data-selarray")
			);
		}
	}
	if (totAchou <= 0) {
		console.log("Não Achou o item selecionado na array de opções.");
		e.nextElementSibling.firstElementChild.value = "\u{2209}";
	} else if (totAchou > 1) {
		e.nextElementSibling.firstElementChild.value =
			"[" + totAchou + "] Selecionados";
	}
};

const mkSelSet = (e, o) => {
	// Seta Valor do display
	e.nextElementSibling.firstElementChild.value = o.v;
	/* Marcar mkSelItem pra 1 onde encontrou */
	Array.from(e.nextElementSibling.nextElementSibling.children).forEach(
		(item) => {
			if (item.getAttribute("data-k") == o.k) {
				item.setAttribute("data-s", "1");
			}
		}
	);
};

const mkIsJson = (s) => {
	try {
		JSON.parse(s);
	} catch (e) {
		return false;
	}
	return true;
};

/* INICIALIZA e GERA TIMER de busca por novos elementos */
mkSelRenderizar();
setInterval(() => {
	mkSelRenderizar();
}, 300);

/* Faltando:
- Criar mecânica de Marcar Todos e Desmarcar Todos.
- Ao reposionar, não deixar a Lista ficar pra fora da tela.
- Transferir style do input pro div.mkSelBloco
*/
