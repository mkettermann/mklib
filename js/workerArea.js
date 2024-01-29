
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
			case "Exclusivos":
				let chaves = new Set();
				job.v.forEach((o) => {
					Object.keys(o).forEach((p) => {
						chaves.add(p);
					});
				});
				let campos = {};
				let virouJson = {};
				chaves.forEach((k) => {
					let tempSet = new Set();
					let tempJson = new Set();
					job.v.forEach((o) => {
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
				postMessage({ k: "Exclusivos", v: campos });
				break;
			case "ChavesRepetidas":
				let resultado = new Set();
				let jaTem = new Set();
				job.v.forEach(o => {
					if (jaTem.has(o[job.target])) {
						resultado.add(o[job.target]);
					}
					jaTem.add(o[job.target]);
				})
				postMessage({ k: "ChavesRepetidas", v: [...resultado] });
				break;
			default:
		}
	}
}