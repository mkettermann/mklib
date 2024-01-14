const menuAbrir = async (t) => {
	let e = mk.Q("#" + t);
	let destino = mk.QdataGet(e, "go");
	if (destino != null) {
		let pac = await mk.get.html("./html/" + destino);
		if (pac.retorno != null) {
			mk.Q(".conteudo").innerHTML = pac.retorno;
			mk.mkNodeToScript(mk.Q(".conteudo"));
		} else {
			console.log("Falhou ao coletar dados");
		}
	} else {
		console.log("Destino Nulo");
	}
	setCookie("ultima", t);
};
let ultima = getCookie("ultima");
if (ultima == "") {
	ultima = "zone"
	setCookie("ultima", ultima);
}
menuAbrir(ultima);

/**Confirmar */
const aoIncrementar = async (e) => {
	function edit(alvo, novoValor) {
		alvo.value = novoValor.toString();
		return novoValor;
	}
	let alvo = e?.previousElementSibling;
	mk.mkConfirma("Aumentar 1 unidade. Tem Certeza?").then((r) => {
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