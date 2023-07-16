"use strict";

// mk.aoReceberDados = (data) => {
// 	console.log("oi");
// };
var lista = new mk("/GetList", "#tabela1", undefined, undefined, "mId");
var lista2 = new mk("/GetList2", "#tabela2", "#modelo2", ".fTabela2", "mId");
//var lista = new Mk("/data/usersExemplo.json", ".tabela1", "#modelo");

/* Aqui foi utilizado um container manual das listas instanciadas.
 Basta a funcão enviar o id correto para o Set ser na lista correta.
 Fazendo isso, os metodos não precisam ser individuais por lista,
  mas no template precisa saber a lista.*/
var listas = [lista, lista2];

// CRUD LISTAGEM 1
var uiGetADD = async (listId) => {
	mk.QverOn(".operacaoContainer");
	mk.QScrollTo("#Acao");
	mk.Q(".operacaoTitulo").innerHTML = "Adicionar";
	mk.Q(".operacaoAcao").innerHTML = "Adicionar";
	mk.Q(".operacaoAcao").setAttribute("onclick", "uiSetADD(" + listId + ")");
	await mk.mkMoldeOA(
		listas[listId].getKeys(),
		"#modeloOperacao",
		".operacaoCampos"
	);
	mk.QSet(
		".operacaoCampos input[name='" + listas[listId].c.pk + "']",
		listas[listId].getNewPK()
	);
};

var uiGetEDIT = async (tr, listId) => {
	let k = tr.getAttribute("k");
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
	await mk.mkMoldeOA(
		listas[listId].getKV(objeto),
		"#modeloOperacao",
		".operacaoCampos"
	);
};

var uiGetDEL = async (tr, listId) => {
	let k = tr.getAttribute("k");
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
	listas[listId].add(obj);
	mk.QverOff(".operacaoContainer");
};
var uiSetEDIT = async (k, v, listId) => {
	let obj = mk.mkGerarObjeto(".operacaoCampos");
	listas[listId].edit(obj, k, v);
	mk.QverOff(".operacaoContainer");
};
var uiSetDEL = async (k, v, listId) => {
	listas[listId].del(k, v);
	mk.QverOff(".operacaoContainer");
};
var uiClearFiltro = async (listId) => {
	listas[listId].clearFiltro();
	mk.QverOff(".operacaoContainer");
};
