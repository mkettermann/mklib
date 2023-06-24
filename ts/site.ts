const menuAbrir = async (e: Element) => {
	let destino = "/html/" + mk.QdataGet(e, "go");
	if (destino != null) {
		let retorno = await mk.http(destino, mk.t.G, mk.t.H);
		if (retorno != null) {
			mk.Q("main").innerHTML = retorno;
		} else {
			console.log("Falhou ao coletar dados");
		}
	} else {
		console.log("Destino Nulo");
	}
};
menuAbrir(mk.Q(".MenuLink.inicio"));
