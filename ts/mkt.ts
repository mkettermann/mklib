//
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   Master Key Tools               \\
//___________________________________\\
// Recriando a partir da mk para:
// - Tornar um construtor unico. (Estava ficando difícel de manter organizado no outro formato)
// - Separar as tarefas de contrução e ordenamento em um worker.
// - Implementação de banco de dados indexavel.
// - Implementação de Design de colunas.
// - Tentar tornar as funções de sobreescrever em Event Based.



// CLASSE DE CONFIG (Construtor único)
class mkt_config {
	url: string | null = new URL("GetList", window.location.href.split("?")[0]).href; // Requer a URL para o fetch dos dados. Se não tiver, passar os dados no parametros dados e tornar esse null.
	dados: any[] | null = null; // Caso a tela já tenha os dados, podem ser passador por aqui, se não deixar 
	container: string = ".divListagemContainer"; // Classe / Id de onde será buscada uma tabela para ser populada.
	idmodelo: string = "#modelo"; // Classe / Id do template/script contendo o formato de exibição de cada registro da lista.
	design: mkt_design | null = null; // Lista de Configuração de coluna, como Label, Formato do conteudo, Classes padrões...
	filtros: string | null = ".iConsultas"; // Busca por esta classe para filtrar campos por nome do input.
	container_importar: boolean = false; // No container, executa importar dados baseados no atributo.
	filtroExtra: Function | null = null; // modificaFiltro Retorna um booleano que permite um filtro configurado externamente do processoFiltragem.
}

// Event Based:
// - aoConcluirDownload
// - aoConcluirFiltragem
// - aoConcluirExibicao

// CLASSE Do Design das colunas para formar o mkt.
class mkt_design {

}

// CLASSE INSTANCIAVEL
class mkt {
	c: mkt_config;
	constructor(mktconfig: mkt_config) {
		this.c = mktconfig;
		if (mktconfig.url) {

		}
	}

}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\\
//   Util Estático                  \\
//___________________________________\\
class mkutil {
	// Obten-se o
	static classof(o: any) {
		return Object.prototype.toString.call(o).slice(8, -1);
	}
}