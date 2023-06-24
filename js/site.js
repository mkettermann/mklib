"use strict";
const menuAbrir = async (e) => {
    console.log(mk.QdataGet(e, "go"));
    let destino = mk.QdataGet(e, "go");
    if (destino != null) {
        let html;
        let retorno = await mk.http(destino, mk.t.G, mk.t.H);
        if (retorno != null) {
            console.log("ok");
            mk.Q("main").innerHTML = retorno;
        }
        else {
            console.log("ERRO");
        }
    }
    else {
        console.log("Destino Nulo");
    }
};
