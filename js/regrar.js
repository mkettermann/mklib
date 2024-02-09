mkt.Ao("click", ".btnTestarValidar", async (e) => {
	if (await mkt.estaValido("#regrarTeste")) {
		console.log("Validou");
	} else {
		console.log("Não validou");
	}
});

// REGRAR
mkt.regrar(".exemploRegrar", "nomPessoa", { k: "obrigatorio" });