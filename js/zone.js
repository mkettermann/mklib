var w = mk.mkWorker();
w.postMessage({ c: "MSG", d: ["Dados Enviados"] });
w.onmessage = (ev) => {
	console.log("A Recebido> C: ", ev.data.c, " D: ", ev.data.d);
}
w.onerror = (ev) => {
	console.log("A> Erro: ", ev);
	ev.preventDefault();
}
