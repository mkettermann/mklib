var dados = [
	{ nome: "Marcos", sobrenome: "K" },
	{ nome: "Zé", data: { d: "31", m: "12", a: "2023" } },
];
dados.push({
	nome: "Fulano",
	sobrenome: "dos Santos Silva",
	data: { d: 31 },
});
mk.mkMoldeOA(dados, "#modelo333", "#exibir");


var objeto = {
	nome: "Seu Zé",
	temp: { temp: "Show" },
	o: {
		a: {
			b: {
				c: "InternoMulti",
			},
		},
	},
};

function aoModificarInput(e) {
	objeto[e.name] = e.value;
	mk.mkMoldeOA(objeto, "#modelo", ".resultado");
}

function aoModificarObjeto(e) {
	// Aqui já ocorre um problema de get encadeado
	objeto.temp.temp = e.value;
	mk.mkMoldeOA(objeto, "#modelo", ".resultado");
}

function aoModificarMulti(e) {
	// Aqui já ocorre um problema de get encadeado
	objeto.o.a.b.c = e.value;
	mk.mkMoldeOA(objeto, "#modelo", ".resultado");
}

// Inicia executando
aoModificarInput(mk.Q("#inputTeste"));