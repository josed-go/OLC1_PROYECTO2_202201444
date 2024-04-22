import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
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
        
        if(this.expresion.tipoD.getTipo() != valor.getTipo().getTipo()){

            return new Errores('Semantico', 'Asignacion de diferentes tipos', this.linea, this.columna)
        } else {
            this.tipoD = valor.getTipo()
            
            valor.setValor(valorN)

            arbol.tablaSimbolos(this.id, valor.getValor(), this.linea.toString(), tabla.getNombre().toString(), this.columna.toString())

        }
    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()

        let resultado = ""

        let nodoP = `n${cont.get()}`
        let nodoV = `n${cont.get()}`
        let nodoN = `n${cont.get()}`
        let nodoI = `n${cont.get()}`
        let nodoA = `n${cont.get()}`

        resultado += `${nodoP}[label="ASIGNACION"]\n`
        resultado += `${nodoV}[label="ID"]\n`
        resultado += `${nodoN}[label="${this.id}"]\n`
        resultado += `${nodoI}[label="="]\n`
        resultado += `${nodoA}[label="EXPRESION"]\n`

        resultado += `${anterior}->${nodoP}\n`
        resultado += `${nodoP}->${nodoV}\n`
        resultado += `${nodoV}->${nodoN}\n`
        resultado += `${nodoP}->${nodoI}\n`
        resultado += `${nodoP}->${nodoA}\n`

        resultado += this.expresion.nodo(nodoA)
        return resultado
    }
}