const menuAbrir = async (t) => {
	if (!t) {
		t = "zone";
	}
	let e = mkt.Q("#" + t);
	let destino = e.dataset["go"];
	if (destino != null) {
		let urlInstalada = window.location.href + "html/";
		let pac = await mkt.get.html(urlInstalada + destino + "?" + mkt.uuid());
		if (pac.retorno != null) {
			mkt.Q(".conteudo").innerHTML = pac.retorno;
			mkt.nodeToScript(mkt.Q(".conteudo"));
		} else {
			console.log("Falhou ao coletar dados");
		}
	} else {
		console.log("Destino Nulo");
	}
	setCookie("ultima", t, 30);
};
menuAbrir(getCookie("ultima"));

/**Confirmar */
const aoIncrementar = async (e) => {
	function edit(alvo, novoValor) {
		alvo.value = novoValor.toString();
		return novoValor;
	}
	let alvo = e?.previousElementSibling;
	mkt.mkConfirma("Aumentar 1 unidade. Tem Certeza?").then((r) => {
		r ? edit(alvo, Number(alvo?.value) + 1) : console.log("Você não confirmou");
	});
};


/* Cookies */
function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
function eraseCookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}