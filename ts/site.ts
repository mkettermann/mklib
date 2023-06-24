const menuAbrir = (e: HTMLElement) => {
	console.log(mk.QdataGet(e, "go"));
	window.location = "/" + mk.QdataGet(e, "go");
};
