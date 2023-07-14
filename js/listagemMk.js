"use strict";

// mk.aoReceberDados = (data) => {
// 	console.log("oi");
// };
var lista = new Mk();
//var lista = new Mk("/data/usersExemplo.json", ".tabela1", "#modelo");

var uiGetAdicionar = async () => {
	mk.Q(".operacaoTitulo").innerHtml = "Adicionar";
	await mk.mkMoldeOA(lista.getKeys(), "#modeloOperacao", ".operacaoCampos");
};

var uiGetEditar = async (tr) => {
	let k = tr.getAttribute("k");
	let v = tr.getAttribute("id");
	mk.Q(".operacaoTitulo").innerHtml = "Editar";
	let objeto = lista.dadosFull.find((o) => o[k] == v);
	console.log(objeto);
	mkt = lista.getKV(objeto);
	await mk.mkMoldeOA(mkt, "#modeloOperacao", ".operacaoCampos");
};
