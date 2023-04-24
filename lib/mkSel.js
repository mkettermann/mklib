var mkt;

/* CRIA O DROPDOWN por FOCUS */
const mkSelRenderizar = () => {
	document.querySelectorAll("input.mkSel").forEach((e) => {
		if (!e.parentElement.classList.contains("mkSelBloco")) {
			// COLETA
			let ePai = e.parentElement;
			let ePos = Array.from(ePai.children).indexOf(e);
			let eLarguraInicial = e.offsetWidth;
			let eAlturaInicial = e.offsetHeight;
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
			// SET Tamanho COM BASE NA Coleta
			divMkSeletorPesquisa.style.width = eLarguraInicial + "px";
			divMkSeletorPesquisa.style.height = eAlturaInicial + "px";
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
			// GERA CADA ITEM DA LISTA COM BASE NO JSON
			let seletorArray = JSON.parse(e.getAttribute("data-selarray"));
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
				divMkSeletorList.appendChild(divMkSeletorItem);
			});
			// Seleciona baseado no value do input
			mkSelUpdate(e);

			// TAMANHOS E POSICOES DA LISTA
			e.classList.add("mkSecreto");
			let alturaLista =
				divMkSeletorPesquisa.offsetTop + divMkSeletorPesquisa.offsetHeight;
			divMkSeletorList.style.top = alturaLista + "px";
			divMkSeletorList.style.left = divMkSeletorPesquisa.offsetLeft - 1 + "px";
			divMkSeletorList.style.minWidth = divMkSeletorPesquisa.offsetWidth + "px";
		}
	});
};
/* Ao Tentar Selecionar um novo item */
const mkSelSelecionar = (eItem) => {
	let ePrincipal = eItem.parentElement.parentElement.firstElementChild;
	// Obtem limite de seleções
	let selLimit = Number(ePrincipal.getAttribute("data-selapenas"));
	// Obtem seleções
	let selecoes = ePrincipal.value.split(",");
	// QUANDO O LIMITE é 1
	if (selLimit == 1) {
		// Muda valor do input pelo clicado e Gera o evento
		ePrincipal.value = eItem.getAttribute("data-k");
		ePrincipal.dispatchEvent(new Event("input"));
		// Transfere valor para o Display (Exibe)
		eItem.parentElement.previousElementSibling.firstElementChild.value =
			eItem.innerHTML;
	} else if (selLimit > 1 || selLimit < 0) {
		itemK = eItem.getAttribute("data-k");
		// Verifica se já tem o item clicado, para saber se vai adicionar / remover
		let jaSelecionado = 0;
		selecoes.forEach((itemS) => {
			if (itemS == itemK) jaSelecionado++;
		});
		if (jaSelecionado > 0) {
			// Remove valor
			selecoes.splice(selecoes.indexOf(itemK), 1);
		} else {
			// Verifica se é possivel selecionar mais (Se estiver negativo, pode selecionar infinito)
			if (selecoes.length < selLimit || selLimit < 0) {
				// Acrescenta valor
				selecoes.push(itemK);
			}
		}
		// Limpar seleções vazias
		selecoes.forEach((item) => {
			if (item == "") selecoes.splice(selecoes.indexOf(item), 1);
		});

		// Seta o valor no campo de input e Gera o Evento
		ePrincipal.value = selecoes.toString();
		ePrincipal.dispatchEvent(new Event("input"));

		// Mantem foco no Display, pois pode selecionar mais de um
		setTimeout(() => {
			eItem.parentElement.previousElementSibling.firstElementChild.focus();
		}, 1);
	}
	mkSelUpdate(ePrincipal);
};

/* EVENTO de Pesquisa (FOCUS) */
const mkSelPesquisaFocus = (e) => {
	// Limpa Campo de Exibição
	e.value = "";
	// Limpa o resultado do filtro anterior
	let eList = e.parentElement.nextElementSibling;
	Array.from(eList.children).forEach((el) => {
		el.style.display = "";
	});
	// RE Posiciona lista para correta. (A posição anterior era na hora que deu build do elemento)
	eList.style.top =
		e.parentElement.offsetTop + e.parentElement.offsetHeight + "px";
	eList.style.left = e.parentElement.offsetLeft - 1 + "px";
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
	mkt = e;
	// Obtem seleções
	let selecoes = e.value.split(",");
	/* Desmarcar todos mkSelItem pra 0 */
	Array.from(e.nextElementSibling.nextElementSibling.children).forEach((el) => {
		el.setAttribute("data-s", "0");
	});
	let seletorArray = JSON.parse(e.getAttribute("data-selarray"));
	let totAchou = 0;
	selecoes.forEach((vSelecionado) => {
		seletorArray.forEach((o) => {
			if (vSelecionado == o.k) {
				// Seta Valor do display
				e.nextElementSibling.firstElementChild.value = o.v;
				totAchou++;
				/* Marcar mkSelItem pra 1 onde encontrou */
				Array.from(e.nextElementSibling.nextElementSibling.children).forEach(
					(item) => {
						if (item.getAttribute("data-k") == o.k) {
							item.setAttribute("data-s", "1");
						}
					}
				);
			}
		});
	});
	if (totAchou <= 0) {
		console.log("Não Achou o item selecionado na array de opções.");
		e.nextElementSibling.firstElementChild.value = "\u{2209}";
	} else if (totAchou > 1) {
		e.nextElementSibling.firstElementChild.value =
			"[" + totAchou + "] Selecionados";
	}
};

/* INICIALIZA e GERA TIMER de busca por novos elementos */
mkSelRenderizar();
setInterval(() => {
	mkSelRenderizar();
}, 2000);

/* Faltando:
- Criar mecânica de Marcar Todos e Desmarcar Todos.
 */
