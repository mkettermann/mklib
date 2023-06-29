const menuAbrir = async (e: Element) => {
	let destino = mk.QdataGet(e, "go");
	if (destino != null) {
		let retorno = await mk.http("/html/" + destino, mk.t.G, mk.t.H);
		if (retorno != null) {
			mk.Q(".conteudo").innerHTML = retorno;
			mk.mkNoteToScript(mk.Q(".conteudo"));
		} else {
			console.log("Falhou ao coletar dados");
		}
	} else {
		console.log("Destino Nulo");
	}
};
menuAbrir(mk.Q(".MenuLink.inicio"));

const aoIncrementar = async (e) => {
	function edit(alvo: HTMLInputElement, novoValor: number) {
		alvo.value = novoValor.toString();
		return novoValor;
	}
	let alvo = e?.previousElementSibling;
	let valorAtual = alvo?.value;
	let novoValor = Number(valorAtual) + 1;
	// console.log("Alvo: " + alvo);
	// console.log("Valor: " + valorAtual);
	// console.log("Novo Valor: " + novoValor);

	//edit(alvo, novoValor);

	mk.mkConfirma("Você aumentá o incremento em 1 unidade. Tem Certeza?").then(
		(r) => {
			r ? edit(alvo, novoValor) : console.log("Você não confirmou");
		}
	);
};
