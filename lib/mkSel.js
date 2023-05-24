/* CRIA O DROPDOWN por FOCUS */
const mkSelRenderizar = () => {
	document.querySelectorAll("input.mkSel").forEach((e) => {
		// Transforma elemento se ele ainda não foi transformado
		if (!e.parentElement.classList.contains("mkSelBloco")) {
			// COLETA
			let ePai = e.parentElement;
			let ePos = Array.from(ePai.children).indexOf(e);
			//let eMarca = e.getAttribute("data-refill"); //<interrompido
			// ELEMENTO no BLOCO
			let divMkSeletorBloco = document.createElement("div");
			let divMkSeletorPesquisa = document.createElement("div");
			let divMkSeletorInputExibe = document.createElement("input");
			//let divMkSelInputExibeMarca = document.createElement("div");
			let divMkSeletorInputExibeArrow = document.createElement("div");
			let divMkSeletorList = document.createElement("div");
			// Nomeando Classes
			divMkSeletorBloco.className = "mkSelBloco";
			divMkSeletorPesquisa.className = "mkSelPesquisa";
			divMkSeletorInputExibe.className = "mkSelInputExibe";
			//divMkSelInputExibeMarca.className = "mkSelInputExibeMarca";
			divMkSeletorInputExibeArrow.className = "mkSelInputExibeArrow";
			divMkSeletorList.className = "mkSelList";
			// ORDEM no DOM
			ePai.insertBefore(divMkSeletorBloco, ePai.children[ePos]);
			divMkSeletorBloco.appendChild(e);
			divMkSeletorBloco.appendChild(divMkSeletorPesquisa);
			divMkSeletorBloco.appendChild(divMkSeletorList);
			divMkSeletorPesquisa.appendChild(divMkSeletorInputExibe);
			//divMkSeletorPesquisa.appendChild(divMkSelInputExibeMarca);
			divMkSeletorPesquisa.appendChild(divMkSeletorInputExibeArrow);
			// Seta atributos e Getilhos
			divMkSeletorBloco.setAttribute("style", e.getAttribute("style"));
			e.removeAttribute("style");
			e.setAttribute("readonly", "true");
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

			// Deixar Elemento de forma visivel, mas inacessivel.
			e.classList.add("mkSecreto");
		} else {
			// Atualiza a lista com base na classe "atualizar"
			if (e.classList.contains("atualizar")) {
				e.classList.remove("atualizar");
				mkSelPopularLista(e);
				mkSelUpdate(e);
				// Executa evento, em todos atualizar.
				e.dispatchEvent(new Event("input"));
				e.dispatchEvent(new Event("change"));
			}
			// Atualiza posição com a mesma frequencia que pesquisa os elementos.
			mkSelReposicionar(e.parentElement.children[2]);
		}
	});
};
/* Ao Tentar Selecionar um novo item */
const mkSelSelecionar = (eItem) => {
	let ePrincipal = eItem.parentElement.parentElement.firstElementChild;
	let KV = mkSelGetKV(ePrincipal);
	// Obtem limite de seleções
	let selLimit = Number(ePrincipal.getAttribute("data-selapenas"));
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
		let jaSelecionado = 0;
		// Forma um array caso ainda não seja, pois pode seleconar mais de um.
		let arraySelecionado = [];
		// Verifica se algum KV.k é o K clicado. (Para saber se vai adicionar ou remover)
		KV.forEach((ObjKV) => {
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
			if (item == "")
				arraySelecionado.splice(arraySelecionado.indexOf(item), 1);
		});
		// Quando estiver vazio, reseta o campo.
		// Seta o valor no campo de input
		if (arraySelecionado.length == 0) {
			ePrincipal.value = ePrincipal.defaultValue;
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
	// Evento change apos terminar a atualizacao
	ePrincipal.dispatchEvent(new Event("change"));
};

const mkSelPopularLista = (e) => {
	// GERA CADA ITEM DA LISTA COM BASE NO JSON
	if (e.getAttribute("data-selarray") != "") {
		let eList = e.nextElementSibling.nextElementSibling;
		eList.innerHTML = "";
		try {
			let seletorArray = JSON.parse(e.getAttribute("data-selarray"));
			if (seletorArray != null) {
				let c = 0;
				/* ITENS */
				seletorArray.forEach((o) => {
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
							"mkSelSelecionar(this)"
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
					let divMkSelCima = document.createElement("div");
					divMkSelCima.className = "mkSelItemDeCima";
					divMkSelCima.setAttribute("onmousemove", "mkSelMoveCima(this);");
					divMkSelCima.innerHTML = "Subir";
					eList.insertBefore(divMkSelCima, eList.firstElementChild);

					let divMkSelBaixo = document.createElement("div");
					divMkSelBaixo.className = "mkSelItemDeBaixo";
					divMkSelBaixo.setAttribute("onmousemove", "mkSelMoveBaixo(this);");
					divMkSelBaixo.innerHTML = "Descer";
					eList.appendChild(divMkSelBaixo);
				}
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
	// Atualiza Itens Selecionados, caso houve mudança sem atualizar.
	mkSelUpdate(e.parentElement.previousElementSibling);
	// Limpa o Display
	e.value = "";
	// Limpa o resultado do filtro anterior
	let eList = e.parentElement.nextElementSibling;
	Array.from(eList.children).forEach((el) => {
		el.style.display = "";
	});

	// Atualizar posição da Lista.
	mkSelReposicionar(e.parentElement.nextElementSibling);
};

const mkSelReposicionar = (eList) => {
	eRef = eList.previousElementSibling;
	// Posiciona E Redimenciona a lista.
	eList.style.minWidth = eRef.offsetWidth + "px";
	// Lado esquerdo baseado na posicao, mas em mobile fica full.
	let wLargura = window.innerWidth;
	if (wLargura < 768) {
		eList.style.top = 35 + "px";
		eList.style.left = 35 + "px";
	} else {
		// Primeiramente seta a posição ref ao input fixo.
		eList.style.top = eRef.offsetTop + eRef.offsetHeight + 1 + "px";

		eList.style.left = eRef.offsetLeft + "px";
		// Depois, verifica se saiu da tela
		let posXCantoOpostoRef = eRef.offsetLeft + eRef.offsetWidth;
		let posXCantoOpostoList = eList.offsetLeft + eList.offsetWidth;
		if (posXCantoOpostoList > mk.Q("body").offsetWidth) {
			eList.style.left = posXCantoOpostoRef - eList.offsetWidth - 1 + "px";
		}
	}
};

/* EVENTO de Pesquisa (BLUR) */
const mkSelPesquisaBlur = (e) => {
	mkSelUpdate(e.parentElement.previousElementSibling);
};
/* EVENTO de Pesquisa (INPUT) */
const mkSelPesquisaInput = (e) => {
	let cVisivel = 0;
	let eList = e.parentElement.nextElementSibling;
	Array.from(eList.children).forEach((el) => {
		let exibe = false;

		if (el.classList.contains("mkSelItem")) {
			if (
				el.firstElementChild.innerHTML
					.toLowerCase()
					.match(e.value.toLowerCase())
			) {
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
	console.log("Visiveis: " + cVisivel);
};

const mkSelMoveCima = (e) => {
	e.parentElement.scrollTop = e.parentElement.scrollTop - 5;
};
const mkSelMoveBaixo = (e) => {
	e.parentElement.scrollTop = e.parentElement.scrollTop + 5;
};

/* ATUALIZA Display e Selecionados*/
const mkSelUpdate = (e, KV = null) => {
	if (KV == null) {
		KV = mkSelGetKV(e);
	}
	// Desmarcar todos mkSelItem pra 0
	Array.from(e.nextElementSibling.nextElementSibling.children).forEach((el) => {
		el.setAttribute("data-s", "0");
	});
	KV.forEach((o) => {
		/* Marcar mkSelItem pra 1 onde tem K selecionado */
		Array.from(e.nextElementSibling.nextElementSibling.children).forEach(
			(item) => {
				if (item.getAttribute("data-k") == o.k) {
					item.setAttribute("data-s", "1");
				}
			}
		);
	});
	// Seta Valor do display
	mkSelSetDisplay(e, KV);
};

// Retorna o Objeto em formato KV dos itens selecionados do elemento E
const mkSelGetKV = (e) => {
	let kSels;
	let kOpcoes;
	// Lista de Selecoes vira K do KV
	if (mkIsJson(e.value)) {
		kSels = JSON.parse(e.value);
		if (!Array.isArray(kSels)) {
			kSels = [{ k: kSels }];
		} else {
			kSels = [];
			JSON.parse(e.value).forEach((kSel) => {
				kSels.push({ k: kSel });
			});
		}
	} else kSels = [{ k: e.value }];
	// Prepara lista de Opções para iterar
	if (mkIsJson(e.getAttribute("data-selarray"))) {
		kOpcoes = JSON.parse(e.getAttribute("data-selarray"));
		if (!Array.isArray(kOpcoes)) {
			kOpcoes = [{ k: kOpcoes, v: "\u{2209} Opções" }];
		}
	} else kOpcoes = null;
	if (kOpcoes != null) {
		// Acrescentar V ao KV
		kSels.forEach((objKv) => {
			kOpcoes.forEach((opcao) => {
				if (opcao.k == objKv.k) {
					objKv.v = opcao.v;
				}
			});
		});
	}
	return kSels;
};

const mkSelSetDisplay = (e, KV) => {
	if (KV.length <= 0) {
		console.warn("Não foi possível encontrar os itens selecionados.");
		e.nextElementSibling.firstElementChild.value = "Opções \u{2209}";
	} else {
		if (KV.length == 1) {
			let display = "-- Selecione --";
			if (KV[0].v != null) {
				display = KV[0].v;
			}
			e.nextElementSibling.firstElementChild.value = display;
		} else if (KV.length > 1) {
			e.nextElementSibling.firstElementChild.value =
				"[" + KV.length + "] Selecionados";
		}
	}
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
- Colocar botao Mover pra cima.
*/
