const menuAbrir = async (e: Element) => {
	let destino = mk.QdataGet(e as any, "go");
	if (destino != null) {
		let retorno = await mk.http("/html/" + destino, mk.t.G, mk.t.H);
		if (retorno != null) {
			mk.Q(".conteudo").innerHTML = retorno;
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
	function edit(alvo: any, novoValor: any) {
		alvo.value = novoValor.toString();
		return novoValor;
	}
	let alvo = e?.previousElementSibling;
	mk.mkConfirma("Você aumentá o incremento em 1 unidade. Tem Certeza?").then(
		(r) => {
			r
				? edit(alvo, Number(alvo?.value) + 1)
				: console.log("Você não confirmou");
		}
	);
};
