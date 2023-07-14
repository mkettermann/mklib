"use strict";
mk.iniciarGetList("/GetList", true);
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
