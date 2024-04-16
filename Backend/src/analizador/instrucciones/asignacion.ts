import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Asignacion extends Instruccion {
    private id: string
    private expresion : Instruccion

    constructor(id: string, expresion: Instruccion, linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.id = id
        this.expresion = expresion
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let valorN = this.expresion.interpretar(arbol, tabla)
        if(valorN instanceof Errores) return valorN

        let valor = tabla.getVariable(this.id.toLocaleLowerCase())
        if(valor == null) return new Errores('Semantico', 'Variable '+this.id+' no existe', this.linea, this.columna)
        
        if(this.expresion.tipoD.getTipo() != valor.getTipo().getTipo()) return new Errores('Semantico', 'Asignacion de diferentes tipos', this.linea, this.columna)
        this.tipoD = valor.getTipo()
        
        valor.setValor(valorN)
    }
}