import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class AccesoVector1D extends Instruccion {
    private id: string
    private exp: Instruccion

    constructor(id: string, exp: Instruccion, linea: number, columna:number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.id = id
        this.exp = exp
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let expresion = this.exp.interpretar(arbol, tabla)

        if(expresion instanceof Errores) return expresion

        if(this.exp.tipoD.getTipo() != tipoD.INT) return new Errores("Semantico", "La expresion debe de ser de tipo int", this.linea, this.columna)
        
        let valor = tabla.getVariable(this.id)

        if(valor != null) {
            this.tipoD = valor.getTipo()
            let arreglo = valor.getValor()

            if(parseInt(expresion) < 0 || parseInt(expresion) > arreglo.length - 1) return new Errores("Semantico", "La posición esta fuera del rango del vector", this.linea, this.columna)

            return valor.getValor()[expresion]
        }
        
        // return null;
        return new Errores("Semantico", "La variable " +this.id+" no existe ", this.linea, this.columna)
        
    }
}