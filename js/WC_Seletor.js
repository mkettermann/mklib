mkt.Ao("input", "mk-sel[name='nomLetra']", (e) => {
	mkt.l("Você Modificou 'Quando Seleciona Aqui' para: ", e.value);
	if (e.value == "A") {
		mkt.Q("mk-sel[name='nomLetraEstado']").opcoes = '[["1","Acre "],["2","Alagoas"],["3","Amapá "],["4","Amazonas "]]';
	} else if (e.value == "B") {
		mkt.Q("mk-sel[name='nomLetraEstado']").opcoes = '[["5","Bahia"]]';
	}
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