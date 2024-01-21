declare const appPath: any;
declare class mk {
    db: IDBDatabase | null;
    dadosFull: any;
    dadosFiltrado: any;
    dadosExibidos: any;
    alvo: any;
    thisListNum: number;
    idContainer: any;
    static infolog: boolean;
    constructor(urlOrigem?: any, todaListagem?: any, idModelo?: any, filtro?: any, arg?: any);
    aoReceberDados: (objeto: object) => object;
    antesDePopularTabela: (este: any) => void;
    modicaFiltro: (obj: any) => boolean;
    aoCompletarExibicao: () => void;
    aoConcluirDownload: (dados: any) => void;
    antesDeOrdenar: () => void;
    antesDeOrdenarAsync: () => Promise<unknown>;
    c: any;
    listagemConfigurar: (urlOrigem: any, todaListagem: any, idModelo: any, fTag: any, arg: any) => void;
    configurarUI: () => void;
    getList: (arg?: any) => Promise<void>;
    dbCon: () => Promise<IDBDatabase | null>;
    /**
     * ATUALIZA a listagem com os dados ja ordenados.
     * Executa a filtragem dos dados;
     */
    atualizarListagem: () => Promise<void>;
    atualizarStatusListagem: () => void;
    atualizaNaPaginaUm: () => Promise<void>;
    mudaPag: (e: any) => void;
    processoPaginar: () => void;
    updateFiltro: () => void;
    gerarFiltro: (e: any) => void;
    setFiltroListener: () => void;
    static headMenuHide: (ev: any) => void;
    static headMenuHideX: () => void;
    static headMenuCrescente: () => void;
    static headMenuDecrescente: () => void;
    static headMenuLimpar: () => void;
    static headMenuLimparTodos: () => void;
    static headMenuContemInput: (v: any) => void;
    static headMenuFiltraExclusivo: (v: any) => void;
    static headMenuMarcarExclusivos: (e: any) => void;
    exclusivos: any;
    hmunsel: never[];
    static hmCfg: {
        svgSquare: string;
        svgX: string;
        svgAB: string;
        svgBA: string;
        svgF: string;
        clacre: string;
        cladec: string;
        contem: string;
        espaco: string;
        limparIndivisual: string;
        limparTodos: string;
        selectAll: string;
    };
    headSeeMenuAbrir: (colName: string, e: HTMLTableCellElement) => void;
    headMenuAbrir: (colName: any) => void;
    headAtivar: () => void;
    setDirSort: (propriedade: string | null, direcao?: number) => void;
    orderBy: (propriedade: string | null, direcao?: number) => void;
    efeitoSort: () => void;
    clearFiltro: (campoEspecifico?: string | null) => void;
    clearFiltroUpdate: () => void;
    getObj: (valorKey: any) => object | null;
    getObjs: (k: string, v: any) => object[];
    setObj: (v: any, objeto: any) => any;
    getModel: () => any;
    getKVLR: (obj: any) => any;
    getUsedKeys: (formatoKV?: boolean) => any;
    getNewPK: () => number;
    getAllTr: () => Element[];
    add: (objDados: object) => void;
    edit: (objDados: object, k: any, v: any) => void;
    del: (k: any, v: any) => void;
    addMany: (arrayDados: object[]) => void;
    find: (k: string, v: any) => any;
    toJSON: () => any;
    toString: () => string;
    valueOf: () => any;
    static toString: () => string;
    static contaListas: number;
    static contaOrdena: number;
    static paginationAtual: number;
    static objetoSelecionado: {};
    static sendObjFull: {};
    static mkFaseAtual: number;
    static mkCountValidate: number;
    static debug: number;
    static timers: any;
    static t: {
        G: string;
        P: string;
        J: string;
        B: string;
        H: string;
        F: string;
    };
    static MESES: (string | number)[][];
    static CORES: {
        VERMELHO: string;
        VERDE: string;
        AZUL: string;
        BRANCO: string;
        PRETO: string;
        VERDEFLORESTA: string;
        VERDEFOLHA: string;
        VERDEABACATE: string;
        AMARELO: string;
        LARANJA: string;
        AZULESCURO: string;
        AZULPISCINA: string;
        AZULCEU: string;
        ROSA: string;
        ROXO: string;
        MAGENTA: string;
        OURO: string;
    };
    static util: any;
    static mascarar: (texto: any, mascara: any) => any;
    static toNumber: (valor: any, c?: any) => number;
    static fromNumber: (valor: any, c?: any) => string;
    static toMoeda: (valor: any) => string;
    static fromMoeda: (texto: string) => Number;
    static w: (...s: any) => void;
    static erro: (...s: any) => void;
    static l: (...s: any) => void;
    static cls: () => void;
    static gc: (...s: any) => void;
    static ge: () => void;
    static ct: (s: any) => void;
    static cte: (s: any, quietMode?: any) => void;
    static Q: (query: any) => any;
    static QAll: (query?: Element | string) => Element[];
    static AoConfig: {
        capture: boolean;
        once: boolean;
        passive: boolean;
    };
    static Ao: (tipoEvento: string | undefined, query: any, executar: any) => void;
    static atribuir: (e: any, gatilho: any, atributo?: string) => void;
    static html: (query: any, conteudo: string) => any;
    static wait: (ms: number) => Promise<unknown>;
    static isJson: (s: any) => boolean;
    static parseJSON: (t: any) => any;
    static removeEspecias: (s: string) => string;
    static range: (from: number, to: number) => object;
    static cursorFim: (e: any) => void;
    static like: (strMenor: string, strMaior: string) => boolean;
    static contem: (strMaior: string, strMenor: string) => boolean;
    static allSubPropriedades: (OA: any, funcao?: Function | null, exceto?: string) => number;
    static mkExecutaNoObj: (oa: object | object[], func: any) => object | object[];
    static mkLimparOA: (oa: object | object[]) => object | object[];
    static mkGerarObjeto: (este: any) => object | object[];
    static QSet: (query?: HTMLElement | string, valor?: any) => null | HTMLElement;
    static QSetAll: (query?: string, o?: object | null, comEvento?: boolean | null) => HTMLInputElement[];
    static Qon: (query?: any) => any;
    static Qoff: (query?: any) => any;
    static Qison: (query?: any) => any;
    static QverOn: (query?: HTMLElement | string | null) => any;
    static QverOff: (query?: HTMLElement | string | null) => any;
    static QverToggle: (query?: HTMLElement | string | null) => any;
    static aCadaElemento: (query: any, fn: Function) => any;
    static cadaExe: (query: any, fn: Function) => any;
    static QScrollTo: (query?: HTMLElement | string) => HTMLElement;
    static QdataGet: (query: string | HTMLElement | undefined, atributoNome: string) => any;
    static QdataSet: (query: string | HTMLElement | undefined, atributoNome: string, atributoValor: string) => any;
    static toggleSwitcher: (e: HTMLElement) => HTMLElement;
    static GetParam: (name?: null) => string | URLSearchParams | null;
    static isVisible: (e: HTMLElement) => boolean;
    static apenasNumerosLetras: (s?: string) => string;
    static apenasNumeros: (s?: string) => string;
    static apenasLetras: (s?: string) => string;
    static isFloat: (x: any) => boolean;
    static delUrlQuery: (url: string) => string;
    static gerarDownload: (blob: any, nomeArquivo?: string) => string;
    static downloadData: (base64: any, nomeArquivo?: string) => string;
    static getServerOn: (url?: string) => Promise<void>;
    static detectedServerOff: () => void;
    static detectedServerOn: () => void;
    static mkOnlyFloatKeys: (ev: KeyboardEvent) => void;
    static mkEventBlock: (ev: Event) => void;
    static mkTrocaPontoPorVirgula: (query: string) => void;
    static mkSelecionarInner: (e: HTMLElement) => void;
    static mkInputFormatarValor: (e: HTMLInputElement) => void;
    static mkMedia: (menor: string | number, maior: string | number) => string;
    static mkFloat: (num: any) => number;
    static mkDuasCasas: (num: number) => string;
    static mkNCasas: (num: number, nCasas?: number) => string;
    static mkEmReais: (num: number) => string;
    static encod: (texto?: string) => string;
    static decod: (texto?: string) => string;
    static mkBase64: (arquivo: any, tagImg: string, tagHidden: string) => void;
    static ler: (arq: any, p: Function) => Promise<unknown>;
    static clonar: (i: any) => any;
    static getModelo: (array: any) => any;
    static getExclusivos: (array: any) => any;
    static mkMerge: (o: any, ...fontes: any) => object;
    static isInside: (e: any, container: any) => boolean;
    static encheArray: (arrTemplate: any[], inicio: number | undefined, total: number | null) => any[];
    static encheArrayUltimos: (arrTemplate: any[], fim: number | undefined, total: number | null) => any[];
    static isData: (i: string) => any;
    static getMs: (dataYYYYMMDD?: string | null) => number;
    static hojeMkData: () => string;
    static hojeMkHora: () => string;
    static hoje: () => string;
    static getFullData: (ms?: null) => string;
    static getDia: (ms?: null) => number;
    static getMes: (ms?: null) => number;
    static getAno: (ms?: null) => number;
    static geraMeses: (config: any) => (string | number)[];
    static getTempoDiferenca: (msOld: number, msNew?: number | null) => string;
    static getDiasDiferenca: (msOld: number, msNew?: number | null) => number;
    static transMsEmSegundos: (ms: number) => number;
    static transMsEmMinutos: (ms: number) => number;
    static transMsEmHoras: (ms: number) => number;
    static transMsEmDias: (ms: number) => number;
    static transSegundosEmMs: (s: number) => number;
    static transMinutosEmMs: (m: number) => number;
    static transHorasEmMs: (h: number) => number;
    static transDiasEmMs: (d: number) => number;
    static mkGeraElemento(e: any, nomeElemento?: string): any;
    static mkNodeToScript(node: any): any;
    static frequencia: (array: any) => object;
    static mkYYYYMMDDtoDDMMYYYY: (dataYYYYMMDD: string) => string;
    static toLocale: (data: string) => string;
    static mkFormatarDataOA: (oa: object | object[]) => object | object[];
    static mkBoolToSimNaoOA: (oa: object | object[]) => object | object[];
    static mkFormatarOA: (oa: object | object[]) => object | object[];
    static CarregarON: (nomeDoRequest?: string) => void;
    static CarregarOFF: (nomeDoRequest?: string) => void;
    static CarregarHtml: (estilo?: string, classe?: string) => string;
    static get: {
        json: (config: any) => Promise<any>;
        html: (config: any) => Promise<any>;
        blob: (config: any) => Promise<any>;
    };
    static post: {
        json: (config: any, json: object) => Promise<any>;
        html: (config: any, text: string) => Promise<any>;
        form: (config: any, formdata: FormData) => Promise<any>;
    };
    /** REQUEST
     * Se Utilizar o await, o config enviado retorna com o resultado e o pacote
     * Se definir o done e/ou o error no config, será executado como callback também.
     * @param config  Estes são as propriedades em uso do config:
     * {
     * 	url: "www.google.com",
     * 	metoto: "GET",
     * 	tipo: "application/json",
     * 	dados: ["a",1],
     * 	headers: new Headers(),
     * 	quiet: false,
     * 	dev: false,
     * 	carregador: false,
     * 	done: (c)=>{mk.l("Deu Boa? ",c.pacote.ok)},
     * 	error: (c)=>{mk.l("Deu Boa? ",c.pacote.ok)},
     *  //pacote: É populado com os dados do pacote.
     *  //retorno: É populado com os dados retornados.
     * }
     * @returns Sempre retorna o config preenchido (utilizar await para capturar o resultado)
     */
    static request: (config: any) => Promise<any>;
    static getObjetoFromId: (nomeKey: any, valorKey: any, listaDados: object[]) => object | null;
    static setObjetoFromId: (nomeKey: any, valorKey: any, itemModificado: object, listaDados: object[]) => object[] | null;
    static delObjetoFromId: (nomeKey: any, valorKey: any, listaDados: object[]) => object[];
    static aoCompletarExibicao: () => void;
    static aoConcluirDownload: (dados: any) => void;
    static antesDePopularTabela: (este: any) => void;
    static ativaPaginaAtual: () => void;
    /**
     * FullFiltroFull - processoFiltragem
     * Executa a redução da listagem basedo no objFiltro.
     * Usando modificaFiltro(), pode-se filtrar o objeto da lista também.
     * Atributos:
     * 		data-mkfformato = "date"
     * 		data-mkfoperador = "<="
     */
    static processoFiltragem: (aTotal: any, objFiltro: any, inst: any) => any[];
    static aoReceberDados: (data: object) => object;
    static ordenamento: (a: object[], por: string, dir: any) => object[];
    static ordenar: (array: object[], nomeProp: string, reverse: any) => object[];
    get [Symbol.toStringTag](): string;
    [Symbol.iterator](): {
        next(): any;
        [Symbol.iterator](): any;
    };
    static classof(o: any): string;
    static regras: any;
    /**
     * Informar o C (Container), N (Nome do input) e OBJ (Regra)
     * Atributos do Objeto
     * k:		nome da regra a ser utilizada
     * v: 	atributo da regra escolhida
     * m: 	mensagem de exibição caso esteja em estado falso.
     * a: 	auto executar essa regra assim que regrar (true/false)
     * f:		força validar mesmo se estiver invisivel / desativado (true/false)
     * on: 	padrão true. define se vai executar a regra ou não.
     */
    static regrar: (container: any, nome: string, ...obj: any) => void;
    /**
     * e:		elemento do Query alvo da verificação onde irá iterar todos filhos.
     * @param config String do Query ou a Config
     */
    static estaValido: (container: any) => Promise<boolean>;
    static m: {
        po: string;
        so: string;
        fi: string;
        in: string;
        negado: string;
        maxc: string;
        minc: string;
        nummax: string;
        nummin: string;
        some: string;
        datamax: string;
        charproibido: string;
        apenasnumeros: string;
        apenasletras: string;
        datamaiorque: string;
        datamenorque: string;
    };
    static exeregra: (e: any, ev?: any) => Promise<unknown>;
    static regraDisplay: (e: any, erro: boolean, eDisplay: any, mensagem?: string) => void;
    static regraBlink: (e: any) => void;
    static regraClear(): void;
    static desregrar: (container: any) => Promise<void>;
    static TerremotoErros: (form: string) => void;
    static fase: (possiveis: number[], config: any) => {
        possiveis: number[];
        atual: number;
        historico: number[];
        config: any;
        aoAvancar(): Promise<void>;
        avancar(novaFase?: any): Promise<unknown>;
        voltar(): Promise<unknown>;
        update(): void;
        has(x: number): boolean;
        toString(): string;
        [Symbol.iterator](): {
            next(): {
                value: number;
                done?: undefined;
            } | {
                done: boolean;
                value?: undefined;
            };
            [Symbol.iterator](): any;
        };
    };
    static fUIFaseUpdateLinkFase: () => void;
    static fUIFaseUpdateView: (obj: object) => void;
    static fUIFaseVoltar: (esteForm: string) => void;
    static fUIFaseAvancar: (esteForm: string) => void;
    static fUIFaseEspecifica: (e: HTMLElement) => void;
    static fUIFaseLiberarView: (obj: object) => void;
    static mkClicarNaAba: (este: HTMLElement | Element) => void;
    static removerAspas: (s: any) => any;
    static getV: (keys: string, objeto: any) => any;
    static mkToValue: (m: string, o: any) => string;
    static mkMoldeOA: (dadosOA: object[] | object, modelo?: string, repositorio?: string) => Promise<unknown>;
    static mkInclude: () => Promise<unknown>;
    static mkConfirma: (texto?: string, p?: any) => Promise<unknown>;
    static elementoDuranteUpload: any;
    static mkBotCheck: () => Promise<void>;
    static mkRecRenderizar: () => Promise<void>;
    static mkRecUpdate: (e: any) => void;
    static mkRecChange: (recItem: any, texto: string) => void;
    static mkRecFoco: (input: any, f: Boolean) => void;
    static poppers: never[];
    static mkSelRenderizar: () => Promise<void>;
    static mkSelDelRefillProcesso: (eName: string | HTMLElement, cod?: null) => Promise<unknown>;
    static mkSelDlRefill: (eName: string | HTMLElement, cod: any, clear?: boolean) => Promise<void>;
    static mkSelTabIndex: (e: any) => void;
    static mkSelSelecionar: (eItem: any) => void;
    static mkSelLeftSel: (e: any) => void;
    static mkSelRightSel: (e: any) => void;
    static mkSelPopularLista: (e: any) => void;
    static mkSelPesquisaFocus: (e: any) => void;
    static getParentScrollTop: (e: any) => number;
    static mkSelReposicionar: (eList: any) => void;
    static mkSelPesquisaBlur: (e: any) => void;
    static mkSelPesquisaKeyDown: (ev: any) => void;
    static mkSelPesquisaInput: (e: any) => void;
    static mkSelMoveu: (e: any) => void;
    static mkSelMoveCima: (e: any) => void;
    static mkSelMoveBaixo: (e: any) => void;
    static mkSelUpdate: (e: any, KV?: any[] | null) => void;
    static mkSelArraySetMap: (e: any, map: any) => any;
    static mkSelArraySetKV: (e: any, kv: any[]) => any;
    static mkSelArrayGetMap: (e: any) => any;
    static mkSelArrayGetKV: (e: any) => any[];
    static mkSelGetMap: (e: any) => Map<unknown, unknown>;
    static mkSelGetKV: (e: any) => any[];
    static mkSelSetDisplay: (e: any, KV: any) => void;
    static contaImportados: number;
    static importar: (tagBuscar?: string, tipo?: any, quiet?: boolean) => Promise<unknown>;
    static uuid: () => string;
    static worker: Worker | null;
    static mkWorker: () => Worker;
    static moldeWorker: () => void;
    static Inicializar: () => void;
    static mkRecargaTimer: number;
    static mkRecargaTimerPause: boolean;
    static mkRecargaExe: () => void;
}
