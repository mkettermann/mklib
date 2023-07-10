"use strict";
mk.iniciarGetList("/data/usersExemplo.json", true);
mk.GerarAoSort();
mk.antesDePopularTabela = () => {
	mk.exibePaginado.forEach((o) => {
		o["mDataUltimoAcesso"]
			? (o["mDataUltimoAcesso"] = mk.mkYYYYMMDDtoDDMMYYYY(
					o["mDataUltimoAcesso"]
			  ))
			: null;
	});
};
