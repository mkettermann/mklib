"use strict";
var modeloList1 = [
	new mktm({ k: "mNome", l: "Usuários", pk: true }),
	new mktm({ k: "mDataCadastro", l: "Data Cadastro" }),
	new mktm({ k: "mDataUltimoAcesso", l: "Último Acesso" }),
	new mktm({ k: "mTotalAcessos.a.b", l: "Total Acessos" }),
	new mktm({ k: "mStatus", l: "Status" }),
]

var lista_mkt = new mktc();
lista_mkt.model = modeloList1;
lista_mkt.nomeTabela = "Listagem1";
var lista = new mkt(lista_mkt);

// A lista 2 inicia com 0, e também busca na url.
var lista_mkt2 = new mktc();
lista_mkt2.dados = [];
lista_mkt2.url = "http://127.0.0.1:5501/GetList";
lista_mkt2.nomeTabela = "Listagem2";
lista_mkt2.container = "#tabela2";
lista_mkt2.idmodelo = "#modelo2";
lista_mkt2.model = modeloList1;
var lista2 = new mkt(lista_mkt2);


//var lista = new Mk("/data/usersExemplo.json", ".tabela1", "#modelo");

//Aqui foi utilizado um container manual das listas instanciadas.
//Basta a funcão enviar o id correto para o Set ser na lista correta.
var listas = [lista, lista2]; //(Lista 3 está na posicao 2)

// Aqui modificamos a exibicao de um campo por outro formato
lista.antesDePopularTabela = (l) => {
	// Aplicar em Dados Exibidos,
	// pois esta array é apenas a que o usuário vê,
	// então preserva os dados originais.
	l.dadosExibidos.forEach((o) => {
		if (o.mDataUltimoAcesso) {
			o.mDataUltimoAcesso = mkt.mkYYYYMMDDtoDDMMYYYY(o.mDataUltimoAcesso);
		}
	});
};

// CRUD LISTAGEM 1
var uiGetADD = async (listId, strListagem) => {
	mkt.QverOn(".operacaoContainer");
	mkt.QScrollTo("#Acao");
	mkt.Q(".operacaoTitulo").innerHTML = "Adicionar na " + strListagem;
	mkt.Q(".operacaoAcao").innerHTML = "Adicionar na " + strListagem;
	mkt.Q(".operacaoAcao").setAttribute("onclick", "uiSetADD(" + listId + ")");
	await mkt.mkMoldeOA(
		listas[listId].getUsedKeys(true),
		"#modeloOperacao",
		".operacaoCampos"
	);
	mkt.QSet(
		".operacaoCampos input[name='" + listas[listId].c.pk + "']",
		listas[listId].getNewPK()
	);
};

var uiGetEDIT = async (tr, listId) => {
	let k = listas[listId].c.pk;
	let v = tr.getAttribute("id");
	mkt.QverOn(".operacaoContainer");
	mkt.QScrollTo("#Acao");
	mkt.Q(".operacaoTitulo").innerHTML = "Editar";
	mkt.Q(".operacaoAcao").innerHTML = "Editar";
	mkt.Q(".operacaoAcao").setAttribute(
		"onclick",
		"uiSetEDIT('" + k + "','" + v + "', " + listId + ")"
	);
	let objeto = listas[listId].dadosFull.find((o) => o[k] == v);
	//console.log("Editando: [k:" + k + ",v:" + v + "]", objeto);
	await mkt.mkMoldeOA(
		listas[listId].getKVLR(objeto),
		"#modeloOperacao",
		".operacaoCampos"
	);
};

var uiGetDEL = async (tr, listId) => {
	let k = listas[listId].c.pk;
	let v = tr.getAttribute("id");
	mkt.mkConfirma("Você está prestes a deletar esta linha. Confirma?").then(
		(r) => {
			if (r) uiSetDEL(k, v, listId);
		}
	);
};

// ACOES
var uiSetADD = async (listId) => {
	let obj = mkt.mkGerarObjeto(".operacaoCampos");
	// Método de ADICIONAR da biblioteca:
	listas[listId].add(obj);
	mkt.QverOff(".operacaoContainer");
};
var uiSetEDIT = async (k, v, listId) => {
	let obj = mkt.mkGerarObjeto(".operacaoCampos");
	// Método de EDITAR da biblioteca:
	listas[listId].edit(obj, k, v);
	mkt.QverOff(".operacaoContainer");
};
var uiSetDEL = async (k, v, listId) => {
	// Método de DELETAR da biblioteca:
	listas[listId].del(k, v);
	mkt.QverOff(".operacaoContainer");
};
var uiClearFiltro = async (listId) => {
	// Método de LIMPAR FILTRO da biblioteca:
	listas[listId].clearFiltroUpdate();
	mkt.QverOff(".operacaoContainer");
};
