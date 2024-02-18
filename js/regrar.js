mkt.Ao("click", ".btnTestarValidar", async (e) => {
	if (await mkt.estaValido("#regrarTeste")) {
		console.log("Validou");
	} else {
		console.log("Não validou");
	}
});

mkt.Ao("click", ".btnTestarValidarAll", async (e) => {
	if (await mkt.estaValido("body")) {
		console.log("Validou");
	} else {
		console.log("Não validou");
	}
});

mkt.Ao("click", ".btnClearValidar", async (e) => {
	mkt.regraClear("#regrarTeste");
});

mkt.Ao("click", ".btnClearValidarAll", async (e) => {
	mkt.regraClear();
});

// REGRAR
mkt.regrar(".exemploRegrar", "nomPessoa", { k: "obrigatorio" });
mkt.regrar(".exemploRegrar", "numIdade", { k: "apenasNumeros" });
mkt.regrar(".exemploRegrar2", "nomCompleto", { k: "obrigatorio" });
mkt.regrar(".exemploRegrar2", "nomCompleto", { k: "some", v: [/\s/, /[0-9]/], vm: ["Espaço", "Número"] });