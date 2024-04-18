import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class ModificarVector1D extends Instruccion {
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
        let valor = tabla.getVariable(this.id)

        if(valor != null) {
            let ele = this.exp.interpretar(arbol, tabla)

            if(ele instanceof Errores) return ele

            if(this.exp.tipoD.getTipo() != tipoD.INT) return new Errores("Semantico", "La expresion debe de ser de tipo int", this.linea, this.columna)
            
            let arreglo = valor.getValor()

            if( parseInt(ele) < 0|| parseInt(ele) > arreglo.length-1) return new Errores("Semantico", "La posición esta fuera del rango del vector", this.linea, this.columna)

            let expresion2 = this.exp2.interpretar(arbol, tabla)

            if(expresion2 instanceof Errores) return expresion2

            if(valor.getTipo().getTipo() != this.exp2.tipoD.getTipo() ) return new Errores("Semantico", "El vector "+this.id+" es de diferente tipo", this.linea, this.columna)
            
            arreglo[ele] = expresion2

            valor.setValor(arreglo)
        }else {
            return new Errores("Semantico", "La variable " +this.id+" no existe ", this.linea, this.columna)
        }
        
    }
}