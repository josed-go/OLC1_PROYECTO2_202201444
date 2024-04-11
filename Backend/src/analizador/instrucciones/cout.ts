import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Cout extends Instruccion {
    private expresion : Instruccion
    private salto: string

    constructor(expresion: Instruccion, linea: number, columna: number, salto:string) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.expresion = expresion
        this.salto = salto
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let valor = this.expresion.interpretar(arbol, tabla)
        if (valor instanceof Errores) return valor

        arbol.Cout(valor+this.salto)
    }
}