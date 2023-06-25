mk.iniciarGetList("/data/usersExemplo.json", true);
mk.GerarAoSort();

mk.antesDePopularTabela = () => {
	mk.mkFormatarDataOA(mk.exibePaginado);
};
