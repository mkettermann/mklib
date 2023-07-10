"use strict";

let urlDados = "/data/usersExemplo.json";
let divTabela = ".divListagem";

let lista = new Mk(urlDados, divTabela);

// mk.iniciarGetList("/data/usersExemplo.json", true);
// mk.GerarAoSort();
// mk.antesDePopularTabela = () => {
//     mk.exibePaginado.forEach((o) => {
//         o["mDataUltimoAcesso"]
//             ? (o["mDataUltimoAcesso"] = mk.mkYYYYMMDDtoDDMMYYYY(o["mDataUltimoAcesso"]))
//             : null;
//     });
// };
