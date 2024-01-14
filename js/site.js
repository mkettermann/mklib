const menuAbrir = async (e) => {
	let destino = mk.QdataGet(e, "go");
	if (destino != null) {
		let pac = await mk.get.html("./html/" + destino);
		if (pac.retorno != null) {
			mk.Q(".conteudo").innerHTML = pac.retorno;
			mk.mkNodeToScript(mk.Q(".conteudo"));
		} else {
			console.log("Falhou ao coletar dados");
		}
	} else {
		console.log("Destino Nulo");
	}
};
menuAbrir(mk.Q(".MenuLink.inicio"));

/**Confirmar */
const aoIncrementar = async (e) => {
	function edit(alvo, novoValor) {
		alvo.value = novoValor.toString();
		return novoValor;
	}
	let alvo = e?.previousElementSibling;
	mk.mkConfirma("Aumentar 1 unidade. Tem Certeza?").then((r) => {
		r ? edit(alvo, Number(alvo?.value) + 1) : console.log("Você não confirmou");
	});
};
