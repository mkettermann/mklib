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

async function refillUrl() {
	let e = mkt.Q("mk-sel[name='codAreaRefillUrl']");
	let re = await mkt.get.json(e.dataset.url);
	if (re) {
		let map = new Map(re.retorno.map(i => { return [i[1], `${i[2]} ${i[1]} ${i[3]}`]; }))
		let opcoes = map;
		mkz = opcoes;
		e.opcoes = JSON.stringify([...opcoes]);
	}

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
async function seletorOnOff(btn) {
	let e = "mk-sel[name='staDesabilitado']";
	if (mkt.Qison(e)) {
		mkt.Qoff(e);
		btn.innerHTML = "Ativar";
	} else {
		mkt.Qon(e);
		btn.innerHTML = "Desativar";
	}
}

/**
 * Gatilho: Ao Receber dados com CPF, da SET All, o Ao vai exibir ou ocultar o campo
 */
function receberDados(tipo) {
	let objRecebido = {};
	if (tipo == "cpf") {
		objRecebido.receberDadosCPF = "111.111.111-11";
		objRecebido.tipoPessoa = "1";
	} else if (tipo == "cnpj") {
		objRecebido.receberDadosCNPJ = "50.746.339/0001-00";
		objRecebido.tipoPessoa = "2";
	}
	mkt.l("TipoPessoa: ", objRecebido);
	mkt.QSetAll(".areaReceber *[name='#PROP#']", objRecebido, true);
}

mkt.Ao("input", ".areaReceber *[name='tipoPessoa']", (e) => {
	if (e.value == "1") {
		mkt.l("Exibir apenas CPF");
		mkt.QverOn("*[name='receberDadosCPF']");
		mkt.QverOff("*[name='receberDadosCNPJ']");
	} else if (e.value == "2") {
		mkt.l("Exibir apenas CNPJ");
		mkt.QverOff("*[name='receberDadosCPF']");
		mkt.QverOn("*[name='receberDadosCNPJ']");
	}
});