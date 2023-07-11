//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//			CLASSE Mk Instanciavel			\\
//___________________________________\\

class Mk {
	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			PROPRIEDADES								\\
	//___________________________________\\
	dadosFull = [];
	dadosFiltrado = [];
	dadosExibidos = [];
	divTabela; // Class do container da tabela
	urlOrigem; // URL de origem dos dados a serem populados
	divResumo; // Class do container do resumo da tabela (paginacao)

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			CONSTRUTOR									\\
	//___________________________________\\
	constructor(urlOrigem, divTabela, divResumo = null) {
		this.divTabela = divTabela;
		this.urlOrigem = urlOrigem;
		this.divResumo = divResumo;
		this.iniciarGetList();
	}

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			LISTAGEM										\\
	//___________________________________\\
	// Metodo que prepara a listagem e inicia a coleta.
	iniciarGetList = async () => {
		if (this.divResumo != null) {
			await this.importar();
			mk.Ao("input", "input[name='tablePorPagina']", async () => {
				mk.atualizarPorPagina();
			});
		}

		let retorno = await mk.http(this.urlOrigem, mk.t.G, mk.t.J);
		if (retorno != null) {
			mk.mkLimparOA(retorno);
			mk.mkExecutaNoObj(retorno, mk.aoReceberDados);
			this.dadosFull = this.dadosFiltrado = retorno;
			mk.ordenarDados();
			mk.mkUpdateFiltro();
		}
	};

	//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
	//			Importar										\\
	//___________________________________\\
	importar = async () => {
		return new Promise((r) => {
			mk.QAll("body *").forEach(async (e) => {
				let destino = e.getAttribute("mkImportar");
				if (destino != null) {
					//console.log("Incluindo: " + destino);
					let retorno = await mk.http(destino, mk.t.G, mk.t.H);
					if (retorno != null) {
						e.innerHTML = retorno;
						//mk.mkNodeToScript(mk.Q(".conteudo"));
					} else {
						console.log("Falhou ao coletar dados");
					}
					r(retorno);
				}
			});
		});
	};
}
