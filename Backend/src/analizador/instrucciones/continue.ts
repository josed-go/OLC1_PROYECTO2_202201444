import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Continue extends Instruccion {
    constructor(linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        return
    }
}