import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class AccesoVector2D extends Instruccion {
    private id: string
    private exp: Instruccion
    private exp2: Instruccion

    constructor(id: string, exp: Instruccion, exp2: Instruccion, linea: number, columna:number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.id = id
        this.exp = exp
        this.exp2 = exp2
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let expresion = this.exp.interpretar(arbol, tabla)
        if(expresion instanceof Errores) return expresion

        let expresion2 = this.exp2.interpretar(arbol, tabla)
        if(expresion2 instanceof Errores) return expresion2

        if(this.exp.tipoD.getTipo() != tipoD.INT) return new Errores("Semantico", "La expresion debe de ser de tipo int", this.linea, this.columna)
        if(this.exp2.tipoD.getTipo() != tipoD.INT) return new Errores("Semantico", "La expresion debe de ser de tipo int", this.linea, this.columna)
        
        let valor = tabla.getVariable(this.id)

        if(valor != null) {
            this.tipoD = valor.getTipo()
            let arreglo = valor.getValor()

            if(parseInt(expresion) < 0 || parseInt(expresion) > arreglo.length - 1) return new Errores("Semantico", "La posición 1 esta fuera del rango del vector", this.linea, this.columna)
            if(parseInt(expresion) < 0 || parseInt(expresion2) > arreglo[0].length - 1) return new Errores("Semantico", "La posición 2 esta fuera del rango del vector", this.linea, this.columna)

            return valor.getValor()[expresion][expresion2]
        }
        
        // return null;
        return new Errores("Semantico", "La variable " +this.id+" no existe ", this.linea, this.columna)
        
    }

    nodo(anterior: string): string {
        return ""
    }
}