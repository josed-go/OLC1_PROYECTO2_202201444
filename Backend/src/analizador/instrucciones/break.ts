import AST from "../abstracto/ast";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Break extends Instruccion {
    constructor(linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        return
    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()

        let resultado = ""

        let nodoB = `n${cont.get()}`
        let nodoPC = `n${cont.get()}`

        resultado += `${nodoB}[label="Break"]\n`
        resultado += `${nodoPC}[label=";"]\n`

        resultado += `${anterior}-> ${nodoB}\n`
        resultado += `${anterior}-> ${nodoPC}\n`
        return resultado
    }
}