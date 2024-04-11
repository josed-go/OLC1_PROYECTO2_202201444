import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class AccesoVar extends Instruccion {
    private id: string

    constructor(id:string, linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.id = id
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let valorV: Simbolo = tabla.getVariable(this.id)
        if(valorV == null) return new Errores("Semantico", "Acceso invalido", this.linea, this.columna)
        this.tipoD = valorV.getTipo()
        return valorV.getValor()
    }
}