// A: Worker Básico para implantar na listagem.
var urlBlob = window.URL.createObjectURL(new Blob([document.querySelector('#mkWorker').textContent], { type: "text/javascript" }));
var w = new Worker(urlBlob);
w.postMessage({ c: "Msg", d: ["a"] });
w.onmessage = (ev) => {
	console.log("A> C: ", ev.data.c, " D: ", ev.data.d);
}
w.onerror = (ev) => {
	console.log("A> Erro: ", ev);
	ev.preventDefault();
}
