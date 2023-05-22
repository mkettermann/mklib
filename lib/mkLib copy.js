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

	// Converter (OBJ / ARRAY) Formatar para normalizar com a exibicao ao usuario.
	static mkFormatarOA = (oa) => {
		return Mk.mkBoolToSimNaoOA(Mk.mkFormatarDataOA(Mk.mkLimparOA(oa)));
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
