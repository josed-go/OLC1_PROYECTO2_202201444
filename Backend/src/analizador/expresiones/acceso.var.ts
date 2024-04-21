import AST from "../abstracto/ast";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class AccesoVar extends Instruccion {
    private id: string
    private valor: any

    constructor(id:string, linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.id = id
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let valorV: Simbolo = <Simbolo> tabla.getVariable(this.id)
        if(valorV == null) return new Errores("Semantico", "Acceso invalido para ID: "+this.id, this.linea, this.columna)
        this.tipoD = valorV.getTipo()
        this.valor = valorV.getValor()
        return valorV.getValor()
    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()
        let resultado = ""

        let nodoD = `n${cont.get()}`
        let nodoID = `n${cont.get()}`
        resultado += `${nodoID}[label="${this.id}"]\n`
        resultado += `${nodoD}[label="${this.valor}"]\n`

        resultado += `${anterior}->${nodoID}\n`
        resultado += `${nodoID}->${nodoD}\n`

        return resultado
    }
}