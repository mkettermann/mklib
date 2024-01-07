mk.Ao("click", ".btnTestarValidar", async (e) => {
	if (await mk.estaValido("#regrarTeste")) {
		console.log("Validou");
	} else {
		console.log("Não validou");
	}
});

// REGRAR
mk.regrar(".exemploRegrar", "nomPessoa", { k: "obrigatorio" });