import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class IncreDecre extends Instruccion{
    private id: string
    private accion: string

    constructor(id: string, linea: number, columna: number, accion: string) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.id = id
        this.accion = accion
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {

        let valor = tabla.getVariable(this.id.toLocaleLowerCase())
        if(valor == null) return new Errores('Semantico', 'Variable no existe', this.linea, this.columna)
        
        if(valor.getTipo().getTipo() != tipoD.INT) return new Errores('Semantico', 'No se puede incrementar o decrementar ese tipo de dato', this.linea, this.columna)
        
        if(this.accion == "mas") {

            valor.setValor(parseInt(valor.getValor()) + 1)
        }else if(this.accion == "menos") {

            valor.setValor(parseInt(valor.getValor()) - 1)
        }
        
    }
}