import { Instruccion } from "../abstracto/instruccion";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Datos extends Instruccion {
    valor: any
    
    constructor(tipo: Tipo, valor: any, fila: number, columna: number) {
        super(tipo, fila, columna)
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        return this.valor
    }
    
    nodo(anterior:string): string {
        let cont = Cont.getInstancia()

        let nodoN = `n${cont.get()}`
        let nodoV = `n${cont.get()}`
        let resultado = `${nodoN}[label="NATIVO"]\n`
        resultado += `${nodoV}[label="${this.valor}"]\n`
        resultado += `${nodoN}->${nodoV}\n`
        resultado += `${anterior}->${nodoN}\n`
        return resultado
    }
}