"use strict";
const menuAbrir = async (e) => {
    let destino = mk.QdataGet(e, "go");
    if (destino != null) {
        let retorno = await mk.http("/html/" + destino, mk.t.G, mk.t.H);
        if (retorno != null) {
            mk.Q(".conteudo").innerHTML = retorno;
            mk.mkNoteToScript(mk.Q(".conteudo"));
        }
        else {
            console.log("Falhou ao coletar dados");
        }
    }
    else {
        console.log("Destino Nulo");
    }
};
menuAbrir(mk.Q(".MenuLink.inicio"));
