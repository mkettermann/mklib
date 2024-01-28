
const classof = (o) => {
	let nomeClasse = Object.prototype.toString.call(o).slice(8, -1);
	// Exceção, apenas quando "Number" converter os NaN pra "NaN".
	if (nomeClasse == "Number") {
		if (o.toString() == "NaN") {
			nomeClasse = "NaN";
		}
	}
	return nomeClasse;
}
onmessage = (ev) => {
	console.log("W> ", ev.data);
	if (ev?.data?.k) {
		let job = ev.data;
		switch (job.k) { // COMANDOS RECEBIDOS
			case "MKT_INCLUDE":
				let resultado = job.v.includes(job.target);
				postMessage({ k: "MKT_INCLUDE", v: resultado });
				break;
			case "MKT_Exclusivos":
				let chaves = new Set();
				let a = job.v;
				a.forEach((o) => {
					Object.keys(o).forEach((p) => {
						chaves.add(p);
					});
				});
				let campos = {};
				let virouJson = {};
				chaves.forEach((k) => {
					let tempSet = new Set();
					let tempJson = new Set();
					a.forEach((o) => {
						let temp = o[k];
						let tipo = classof(o[k])
						if (tipo == "String") {
							temp = temp.trim();
						}
						if (tipo == "Object") {
							temp = JSON.stringify(temp);
							if (tempJson) tempJson.add(k);
						}
						if (temp) tempSet.add(temp.toString());
					});
					campos[k] = [...tempSet];
					virouJson[k] = [...tempJson];
					virouJson[k]?.forEach((kJson) => {
						for (let i = 0; i < campos[kJson].length; i++) {
							campos[kJson][i] = JSON.parse(campos[kJson][i]);
						};
					});
				});
				postMessage({ k: "MKT_Exclusivos", v: campos });
			default:
		}
	}
}