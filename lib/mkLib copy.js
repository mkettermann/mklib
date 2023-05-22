class Mk {
	/*----------------------------------/
	\              MODAL               /
	/--------------------------------*/
}

/*------------------------------------/
\       OBJETOS CONSTANTES		     /
/----------------------------------*/
Object.defineProperty(Mk, "GetJson", {
	writable: false,
});
Object.defineProperty(Mk, "GetText", {
	writable: false,
});
Object.defineProperty(Mk, "CFG", {
	writable: false,
});

/*------------------------------------/
\       INIT					     /
/----------------------------------*/
Mk.mkClicarNaAba(Mk.Q(".mkAbas a.active"), 0); // Inicia no ativo
