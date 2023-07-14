"use strict";

// mk.aoReceberDados = (data) => {
// 	console.log("oi");
// };
var lista = new Mk(undefined, undefined, undefined, "mId");
//var lista = new Mk("/data/usersExemplo.json", ".tabela1", "#modelo");

var uiGetADD = async () => {
	mk.Q(".operacaoTitulo").innerHTML = "Adicionar";
	mk.Q(".operacaoAcao").innerHTML = "Adicionar";
	mk.Q(".operacaoAcao").setAttribute("onclick", "uiSetADD(this)");
	await mk.mkMoldeOA(lista.getKeys(), "#modeloOperacao", ".operacaoCampos");
	mk.QSet(".operacaoCampos input[name='" + lista.c.pk + "']", lista.getNewPK());
};

var uiGetEDIT = async (tr) => {
	let k = tr.getAttribute("k");
	let v = tr.getAttribute("id");
	mk.Q(".operacaoTitulo").innerHTML = "Editar";
	mk.Q(".operacaoAcao").innerHTML = "Editar";
	mk.Q(".operacaoAcao").setAttribute("onclick", "uiSetEDIT(this)");
	let objeto = lista.dadosFull.find((o) => o[k] == v);
	await mk.mkMoldeOA(lista.getKV(objeto), "#modeloOperacao", ".operacaoCampos");
};
