
const l = (...args) => {
	console.log("W> ", ...args);
}
onmessage = (ev) => {
	l("Ev Data: ", ev.data);
	if (ev?.data?.c) {
		switch (ev.data.c) {
			case "MSG":
				l("c: ", ev.data.c, " d: ", ev.data.d);
				break;
			case "MKT_LIST_GO":
				postMessage({ c: "MKT_LIST_BACK", d: ["Show"] });
				break;
			default:
		}
	}
	// Ao receber um comando, executar um Job.
	//postMessage({ c: "MSG", d: ["Show"] });
}