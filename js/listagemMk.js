"use strict";

// mk.aoReceberDados = (data) => {
// 	console.log("oi");
// };
var lista = new Mk(undefined, ".tabela1", undefined, "mId");
var lista2 = new Mk("/GetList", ".tabela2", undefined, "mId");
//var lista = new Mk("/data/usersExemplo.json", ".tabela1", "#modelo");

var uiGetADD = async () => {
	mk.QverOn(".operacaoContainer");
	mk.Q(".operacaoTitulo").innerHTML = "Adicionar";
	mk.Q(".operacaoAcao").innerHTML = "Adicionar";
	mk.Q(".operacaoAcao").setAttribute("onclick", "uiSetADD(this)");
	await mk.mkMoldeOA(lista.getKeys(), "#modeloOperacao", ".operacaoCampos");
	mk.QSet(".operacaoCampos input[name='" + lista.c.pk + "']", lista.getNewPK());
};

var uiGetEDIT = async (tr) => {
	let k = tr.getAttribute("k");
	let v = tr.getAttribute("id");
	mk.QverOn(".operacaoContainer");
	mk.Q(".operacaoTitulo").innerHTML = "Editar";
	mk.Q(".operacaoAcao").innerHTML = "Editar";
	mk.Q(".operacaoAcao").setAttribute(
		"onclick",
		"uiSetEDIT('" + k + "','" + v + "')"
	);
	let objeto = lista.dadosFull.find((o) => o[k] == v);
	await mk.mkMoldeOA(lista.getKV(objeto), "#modeloOperacao", ".operacaoCampos");
};

var uiGetDEL = async (tr) => {
	let k = tr.getAttribute("k");
	let v = tr.getAttribute("id");
	mk.mkConfirma("Você está prestes a deletar esta linha. Confirma?").then(
		(r) => {
			if (r) uiSetDEL(k, v);
		}
	);
};

var uiSetADD = async () => {
	let obj = mk.mkGerarObjeto(".operacaoCampos");
	lista.add(obj);
};

var uiSetEDIT = async (k, v) => {
	let obj = mk.mkGerarObjeto(".operacaoCampos");
	lista.edit(obj, k, v);
};
var uiSetDEL = async (k, v) => {
	lista.del(k, v);
};
