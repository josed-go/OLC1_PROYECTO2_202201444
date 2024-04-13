import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";
import Break from "./break";

export default class Ternario extends Instruccion {
    private condicion: Instruccion
    private exp1: Instruccion
    private exp2: Instruccion

    constructor(condicion: Instruccion, exp1: Instruccion, exp2: Instruccion, linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.condicion = condicion
        this.exp1 = exp1
        this.exp2 = exp2
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if(condicion instanceof Errores) return condicion

        let expresion1 = this.exp1.interpretar(arbol, tabla)
        if(expresion1 instanceof Errores) return expresion1

        let expresion2 = this.exp2.interpretar(arbol, tabla)
        if(expresion2 instanceof Errores) return expresion2

        if(this.condicion.tipoD.getTipo() != tipoD.BOOL ) return new Errores("Semantico", "La condicion debe ser de tipo bool", this.linea, this.columna)


        if(condicion) {
            this.tipoD = this.exp1.tipoD
            return expresion1
        }else {
            this.tipoD = this.exp2.tipoD
            return expresion2
        }
    }
}