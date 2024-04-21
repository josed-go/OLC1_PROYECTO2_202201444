import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class ModificarVector2D extends Instruccion {
    private id: string
    private pos1: Instruccion
    private pos2: Instruccion
    private exp: Instruccion

    constructor(id: string, pos: Instruccion, pos2: Instruccion, exp: Instruccion, linea: number, columna:number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.id = id
        this.pos1 = pos
        this.pos2 = pos2
        this.exp = exp
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let valor = tabla.getVariable(this.id)

        if(valor != null) {
            let posicion1 = this.pos1.interpretar(arbol, tabla)

            if(posicion1 instanceof Errores) return posicion1
            
            let posicion2 = this.pos2.interpretar(arbol, tabla)

            if(posicion2 instanceof Errores) return posicion2

            if(this.pos1.tipoD.getTipo() != tipoD.INT) return new Errores("Semantico", "La expresion debe de ser de tipo int", this.linea, this.columna)
            if(this.pos2.tipoD.getTipo() != tipoD.INT) return new Errores("Semantico", "La expresion debe de ser de tipo int", this.linea, this.columna)
            
            let arreglo = valor.getValor()
            let arreglo2 = arreglo[0]

            if(parseInt(posicion1) < 0 || parseInt(posicion1) > arreglo.length-1) return new Errores("Semantico", "La posición 1 esta fuera del rango del vector", this.linea, this.columna)
            if(parseInt(posicion2) < 0 || parseInt(posicion2) > arreglo2.length-1) return new Errores("Semantico", "La posición 2 esta fuera del rango del vector", this.linea, this.columna)

            let expresion = this.exp.interpretar(arbol, tabla)

            if(expresion instanceof Errores) return expresion

            if(valor.getTipo().getTipo() != this.exp.tipoD.getTipo() ) return new Errores("Semantico", "El vector "+this.id+" es de diferente tipo", this.linea, this.columna)
            
            arreglo[posicion1][posicion2] = expresion

            valor.setValor(arreglo)
        }else {
            return new Errores("Semantico", "La variable " +this.id+" no existe ", this.linea, this.columna)
        }
        
    }

    nodo(anterior: string): string {
        return ""
    }
}