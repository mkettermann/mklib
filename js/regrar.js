mkt.Ao("click", ".btnTestarValidar", async (e) => {
	if (await mkt.regrasValidas("#regrarTeste")) {
		console.log("Validou");
	} else {
		console.log("Não validou");
	}
});

mkt.Ao("click", ".btnTestarValidarAll", async (e, ev) => {
	if (await mkt.regrasValidas("body", ev)) {
		console.log("Validou");
	} else {
		console.log("Não validou");
	}
});

mkt.Ao("click", ".btnClearValidar", async (e) => {
	mkt.regraOcultar("#regrarTeste");
});

mkt.Ao("click", ".btnClearValidarAll", async (e) => {
	mkt.regraOcultar();
});

mkt.Ao("change", "input[name='file']", async (e) => {
	mkt.l("Change");
});

// REGRAR
mkt.regrar(".exemploRegrar", "nomPessoa", { k: "obrigatorio" });
mkt.regrar(".exemploRegrar", "numIdade", { k: "apenasNumeros" });
mkt.regrar(".exemploRegrar2", "nomCompleto", { k: "obrigatorio" });
mkt.regrar(".exemploRegrar2", "nomCompleto", { k: "some", v: [/\s/, /[0-9]/], vm: ["Espaço", "Número"] });

mkt.regrar(".exemploRegrar2", "file", { k: "obrigatorio" });