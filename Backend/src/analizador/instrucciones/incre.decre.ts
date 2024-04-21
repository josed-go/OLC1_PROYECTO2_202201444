import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
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
        
        if(valor.getTipo().getTipo() != tipoD.INT && valor.getTipo().getTipo() != tipoD.DOUBLE) return new Errores('Semantico', 'No se puede incrementar o decrementar ese tipo de dato', this.linea, this.columna)
        
        if(this.accion == "mas") {
            if(valor.getTipo().getTipo() == tipoD.INT){
                valor.setValor(parseInt(valor.getValor()) + 1)
            }else{
                valor.setValor(parseFloat(valor.getValor()) + 1)
            }
        }else  {
            if(valor.getTipo().getTipo() == tipoD.INT){
                valor.setValor(parseInt(valor.getValor()) - 1)
            }else{
                valor.setValor(parseFloat(valor.getValor()) - 1)
            }
        }
        
    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()
        let resultado = ""

        let nodoI = `n${cont.get()}`
        let nodoN = `n${cont.get()}`
        let nodoMA = `n${cont.get()}`
        let nodoME = `n${cont.get()}`
        let nodoPC= `n${cont.get()}`

        resultado += ` ${nodoI}[label="ID"]\n`
        resultado += ` ${nodoN}[label="${this.id}"]\n`
        
        if(this.accion == "mas"){
            resultado += `${nodoMA}[label="++"]\n`
            resultado += `${anterior} -> ${nodoMA}\n`
        }else{
            resultado += ` ${nodoME}[label="--"]\n`
            resultado += `${anterior} -> ${nodoME}\n`
        }
        
        resultado += ` ${nodoPC}[label=";"]\n`
        
        resultado += ` ${anterior} -> ${nodoI}\n`
        resultado += ` ${nodoI} -> ${nodoN}\n`
        resultado += ` ${anterior} -> ${nodoPC}\n`

        return resultado
    }
}