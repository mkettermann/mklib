mkt.Ao("input", "mk-sel[name='nomLetra']", (e) => {
	mkt.l("Você Modificou 'Quando Seleciona Aqui' para: ", e.value);
	if (e.value == "A") {
		mkt.Q("mk-sel[name='nomLetraEstado']").opcoes = '[["1","Acre "],["2","Alagoas"],["3","Amapá "],["4","Amazonas "]]';
	} else if (e.value == "B") {
		mkt.Q("mk-sel[name='nomLetraEstado']").opcoes = '[["5","Bahia"]]';
	}
})

// Visualizando Inputs Totais
mkt.Ao("input", "mk-sel[name='multiSelecionado']", (e) => {
	mkt.l("Input: (" + e.name + ") ", e.value);
})

function removerUltimo() {
	let novoMap = mkt.Q("mk-sel[name='staRemover']").opcoes;

	let chaves = [...novoMap.keys()];
	novoMap.delete(chaves[chaves.length - 1]);
	mkt.l("Opções: ", novoMap);
	mkt.Q("mk-sel[name='staRemover']").opcoes = novoMap;
}

function fazerRefill() {
	mkt.Q("mk-sel[name='staRefill']").setAttribute("refill", "");
}

async function validarSeletor() {
	await mkt.regrasValidas(".testeForm");
}
mkt.regrar(".testeForm", "staRegrado", { k: "obrigatorio" });

// AO INPUT Primeiro Seletor Teste
mkt.Ao("input", "mk-sel[name='staAtivo']", (e) => {
	let msg = "Input: (" + e.name + ") = " + e.value;
	mkt.l(msg);
	alert(msg);
})

// DESABILITAR
async function desabilitarSeletor() {
	mkt.Qoff("mk-sel[name='staDesabilitado']");
}