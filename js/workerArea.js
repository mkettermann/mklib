
const l = (...args) => {
	console.log("W> ", ...args);
}
onmessage = (ev) => {
	l(ev);
	if (ev?.data?.c) {
		switch (ev.data.c) {
			case "MSG":
				l("C: ", ev.data.c, " D: ", ev.data.d);
				break;
			case "PUT_MKDATA":

				break;
			default:
		}
	}
	// Ao receber um comando, executar um Job.
	//postMessage({ c: "MSG", d: ["Show"] });
}