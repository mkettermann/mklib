export declare class mktm {
    get [Symbol.toStringTag](): string;
    pk: boolean;
    k: string | null;
    v: any;
    l: string | null;
    r: RegExp | null;
    tag: string | null;
    atr: string | null;
    classes: string;
    target: string;
}
export declare class mkt_config {
    url: string | null;
    dados: any[] | null;
    nomeTabela: string | null;
    container: string;
    idmodelo: string;
    model: Array<mktm>;
    container_importar: boolean;
    filtroExtra: Function | null;
    filtros: string | null;
    hearSort: boolean;
    hearMenu: boolean;
    sortBy: string | null;
    sortDir: Number | null;
}
export declare class mkt {
    c: mkt_config;
    db: IDBDatabase | null;
    dadosFull: any;
    dadosFiltrado: any;
    dadosExibidos: any;
    alvo: any;
    thisListNum: number;
    idContainer: any;
    vars: {
        objFiltro: {};
        urlOrigem: string | null;
        pagAtual: number;
        sortBy: string;
        sortDir: boolean;
        totalFull: any;
        totalFiltrado: any;
        totalExibidos: any;
        pagPorPagina: number;
        pagItensIni: number;
        pagItensFim: number;
        totPags: number;
        versaoDb: number;
        pk: string | null;
        filtro: string | null;
        tbody: string | null;
        ths: string | null;
        pagBotoes: string | null;
        tableResultado: string | null;
        tablePorPagina: string | null;
        tableExibePorPagina: string | null;
        tableTotal: string | null;
        tableFiltrado: string | null;
        tableIni: string | null;
        tableFim: string | null;
        tableInicioFim: string | null;
        pag: string | null;
        pagBotao: string | null;
        nomeTabela: string | null;
    };
    constructor(mktconfig: mkt_config);
    static vars: any;
    static mkWorker: Function;
    static moldeWorker: Function;
    static classof: Function;
    static Inicializar: Function;
    static mkClicarNaAba: Function;
    static exeTimer: Function;
    static infolog: boolean;
}
export default mkt;
