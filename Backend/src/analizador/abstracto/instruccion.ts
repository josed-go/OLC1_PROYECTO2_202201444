import Arbol from "../simbolo/arbol";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo from "../simbolo/tipo";
import AST from "./ast";

export abstract class Instruccion {
    public tipoD : Tipo
    public linea: number
    public columna: number

    constructor(tipo: Tipo, linea: number, columna: number) {
        this.tipoD = tipo
        this.linea = linea
        this.columna = columna
    }

    abstract interpretar(arbol: Arbol, tabla: TablaSimbolos): any
    abstract nodo(anterior: string): string
}