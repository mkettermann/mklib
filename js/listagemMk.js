"use strict";

var lista = new mk("./GetList", "#tabela1", "", "", {
	importar: true,
	m: [
		{
			pk: true,
			k: "mId",
			l: "ID",
			tag: "input",
			atr: "",
			cla: "",
		},
		{
			k: "mNome",
			l: "Usuário",
			tag: "input",
			atr: "",
			cla: "",
		},
		{
			k: "mDataCadastro",
			l: "Data de Cadastro",
			tag: "input",
			atr: "type='date'",
			cla: "",
		},
		{
			k: "mDataUltimoAcesso",
			l: "Último Acesso",
			tag: "input",
			atr: "type='date'",
			cla: "",
		},
		{
			k: "mTotalAcessos",
			l: "Total de Acessos",
			tag: "input",
			atr: "type='number'",
			cla: "",
		},
		{
			k: "mStatus",
			l: "Status",
			tag: "input",
			atr: "",
			cla: "",
		},
	]
});

var lista2 = new mk("./GetList2", "#tabela2", "#modelo2", ".fTabela2", {
	importar: true,
	tipoHead: "menu"
});
var lista3 = new mk("./GetList3", "#tabela3", "#modelo3", ".fTabela3");

//var lista = new Mk("/data/usersExemplo.json", ".tabela1", "#modelo");

//Aqui foi utilizado um container manual das listas instanciadas.
//Basta a funcão enviar o id correto para o Set ser na lista correta.
var listas = [lista, lista2, lista3]; //(Lista 3 está na posicao 2)

// Aqui modificamos a exibicao de um campo por outro formato
lista.antesDePopularTabela = (l) => {
	// Aplicar em Dados Exibidos,
	// pois esta array é apenas a que o usuário vê,
	// então preserva os dados originais.
	l.dadosExibidos.forEach((o) => {
		if (o.mDataUltimoAcesso) {
			o.mDataUltimoAcesso = mk.mkYYYYMMDDtoDDMMYYYY(o.mDataUltimoAcesso);
		}
	});
};

// CRUD LISTAGEM 1
var uiGetADD = async (listId, strListagem) => {
	mk.QverOn(".operacaoContainer");
	mk.QScrollTo("#Acao");
	mk.Q(".operacaoTitulo").innerHTML = "Adicionar na " + strListagem;
	mk.Q(".operacaoAcao").innerHTML = "Adicionar na " + strListagem;
	mk.Q(".operacaoAcao").setAttribute("onclick", "uiSetADD(" + listId + ")");
	await mk.mkMoldeOA(
		listas[listId].getUsedKeys(true),
		"#modeloOperacao",
		".operacaoCampos"
	);
	mk.QSet(
		".operacaoCampos input[name='" + listas[listId].c.pk + "']",
		listas[listId].getNewPK()
	);
};

var uiGetEDIT = async (tr, listId) => {
	let k = listas[listId].c.pk;
	let v = tr.getAttribute("id");
	mk.QverOn(".operacaoContainer");
	mk.QScrollTo("#Acao");
	mk.Q(".operacaoTitulo").innerHTML = "Editar";
	mk.Q(".operacaoAcao").innerHTML = "Editar";
	mk.Q(".operacaoAcao").setAttribute(
		"onclick",
		"uiSetEDIT('" + k + "','" + v + "', " + listId + ")"
	);
	let objeto = listas[listId].dadosFull.find((o) => o[k] == v);
	//console.log("Editando: [k:" + k + ",v:" + v + "]", objeto);
	await mk.mkMoldeOA(
		listas[listId].getKVLR(objeto),
		"#modeloOperacao",
		".operacaoCampos"
	);
};

var uiGetDEL = async (tr, listId) => {
	let k = listas[listId].c.pk;
	let v = tr.getAttribute("id");
	mk.mkConfirma("Você está prestes a deletar esta linha. Confirma?").then(
		(r) => {
			if (r) uiSetDEL(k, v, listId);
		}
	);
};

// ACOES
var uiSetADD = async (listId) => {
	let obj = mk.mkGerarObjeto(".operacaoCampos");
	// Método de ADICIONAR da biblioteca:
	listas[listId].add(obj);
	mk.QverOff(".operacaoContainer");
};
var uiSetEDIT = async (k, v, listId) => {
	let obj = mk.mkGerarObjeto(".operacaoCampos");
	// Método de EDITAR da biblioteca:
	listas[listId].edit(obj, k, v);
	mk.QverOff(".operacaoContainer");
};
var uiSetDEL = async (k, v, listId) => {
	// Método de DELETAR da biblioteca:
	listas[listId].del(k, v);
	mk.QverOff(".operacaoContainer");
};
var uiClearFiltro = async (listId) => {
	// Método de LIMPAR FILTRO da biblioteca:
	listas[listId].clearFiltroUpdate();
	mk.QverOff(".operacaoContainer");
};
