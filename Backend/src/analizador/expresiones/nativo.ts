import { Instruccion } from "../abstracto/instruccion";
import Arbol from "../simbolo/arbol";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Datos extends Instruccion {
    valor: any
    
    constructor(tipo: Tipo, valor: any, fila: number, columna: number) {
        super(tipo, fila, columna)
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        return this.valor
    }
}