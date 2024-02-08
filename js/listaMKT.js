"use strict";

// DESIGN DA TABELA (Precisa de uma PK(Primary Key) para qualquer funcionalidade a mais da biblioteca)
// Este exemplo representa uma tabela de estatística de usuário e cada campo é informado aqui cada característica disponível. (Verifique a classe mktm para saber mais)
var modeloList1 = [
	new mktm({ k: "mId", l: "ID", pk: true, f: false }),
	new mktm({ k: "mNome", l: "Nome" }),
	new mktm({ k: "mDataCadastro", l: "Data Cadastro" }),
	new mktm({ k: "mDataUltimoAcesso", l: "Último Acesso" }),
	new mktm({ k: "mTotalAcessos.a.b", l: "Total Acessos" }),
	new mktm({ k: "mStatus", l: "Status" }),
]

// CONFIGURAÇÃO Para iniciar a construção
var lista_mkt = new mktc(modeloList1);
lista_mkt.nomeTabela = " Listagem 1 !";
lista_mkt.container = "#tabela1";
lista_mkt.idmodelo = "#modelo1";
lista_mkt.container_importar = true;
lista_mkt.aoAntesDePopularTabela = (x) => { // Aqui modificamos a exibicao de um campo por outro formato
	x.forEach((o) => {
		if (o.mDataUltimoAcesso) {
			o.mDataUltimoAcesso = mkt.mkYYYYMMDDtoDDMMYYYY(o.mDataUltimoAcesso);
		}
	});
};

// CONSTRUÇÃO DA LISTAGEM
var lista = new mkt(lista_mkt);

// A lista 2 inicia com 0, e também busca na url.
var lista_mkt2 = new mktc(modeloList1);
lista_mkt2.dados = [];
lista_mkt2.url = "http://127.0.0.1:5501/GetList2";
lista_mkt2.nomeTabela = "Listagem2";
lista_mkt2.container = "#tabela2";
lista_mkt2.idmodelo = "#modelo2";
lista_mkt2.container_importar = true;
var lista2 = new mkt(lista_mkt2);

//Aqui foi utilizado um container manual das listas instanciadas.
// permitindo achar a instancia correta baseado na ordem de contrução
var listas = [lista, lista2];




// CRUD LISTAGEM 1
var uiGetADD = async (listId, strListagem) => {
	mkt.QverOn(".operacaoContainer");
	mkt.QScrollTo("#Acao");
	mkt.Q(".operacaoTitulo").innerHTML = "Adicionar na " + strListagem + " (Dinâmico)";
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

var uiGetEDIT = async (e, listId) => {
	let k = listas[listId].c.pk;
	let v = e.closest("TR")?.id
	mkt.QverOn(".operacaoContainer");
	mkt.QScrollTo("#Acao");
	mkt.Q(".operacaoTitulo").innerHTML = "Editar (Dinâmico)";
	mkt.Q(".operacaoAcao").innerHTML = "Editar";
	mkt.Q(".operacaoAcao").setAttribute(
		"onclick",
		"uiSetEDIT('" + k + "','" + v + "', " + listId + ")"
	);
	//let objeto = listas[listId].dadosFull.find((o) => o[k] == v);
	let objeto = listas[listId].getObj(v); //
	//console.log("Editando: [k:" + k + ",v:" + v + "]", objeto);
	await mkt.mkMoldeOA(
		listas[listId].getKVLR(objeto),
		"#modeloOperacao",
		".operacaoCampos"
	);
};

var uiGetDEL = async (e, listId) => {
	let k = listas[listId].c.pk;
	let v = e.closest("TR")?.id
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
	mkt.l("DELETAR: ", k, v, listId);
	// Método de DELETAR da biblioteca:
	listas[listId].del(k, v);
	mkt.QverOff(".operacaoContainer");
};
var uiClearFiltro = async (listId) => {
	// Método de LIMPAR FILTRO da biblioteca:
	listas[listId].clearFiltroUpdate();
	mkt.QverOff(".operacaoContainer");
};
