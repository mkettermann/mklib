mk.iniciarGetList("/data/usersExemplo.json", true);
mk.GerarAoSort();

mk.antesDePopularTabela = () => {
	mk.exibePaginado.forEach((o: any) => {
		o["mDataUltimoAcesso"]
			? (o["mDataUltimoAcesso"] = mk.mkYYYYMMDDtoDDMMYYYY(
					o["mDataUltimoAcesso"]
			  ))
			: null;
	});
};
