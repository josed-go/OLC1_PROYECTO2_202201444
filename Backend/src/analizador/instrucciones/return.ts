import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Return extends Instruccion {
    private exp?: Instruccion
    public valor = null

    constructor(linea: number, columna: number, exp?: Instruccion) {
        super(new Tipo(tipoD.INT), linea, columna)
        this.exp = exp
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        if(this.exp) {
            let val = this.exp.interpretar(arbol, tabla)
            this.valor = val
            if(val instanceof Errores) return val
            this.tipoD.setTipo(this.exp.tipoD.getTipo())
        }
        return this
    }

    nodo(anterior: string): string {
        return ""
    }
}