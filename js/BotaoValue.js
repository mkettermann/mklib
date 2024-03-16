"use strict";
function trocarValor() {
	let era = mkt.Q("*[name='mkico']").value;

	mkt.Q("*[name='mkico']").value = "./img/mkico.jpg";

	let ficou = mkt.Q("*[name='mkico']").value;
	mkt.l("Era: ", era, " Ficou: ", ficou)
}