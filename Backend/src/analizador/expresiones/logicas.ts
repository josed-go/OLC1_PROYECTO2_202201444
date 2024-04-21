import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Logicas extends Instruccion {
    private condicion1: Instruccion | undefined
    private condicion2: Instruccion | undefined
    private condicionU: Instruccion | undefined
    private logico: Logico

    constructor(logico: Logico, linea: number, columna: number, condicion1: Instruccion, condicion2?: Instruccion){
        super(new Tipo(tipoD.BOOL), linea, columna)
        this.logico = logico
        if(!condicion2) this.condicionU = condicion1
        else {
            this.condicion1 = condicion1
            this.condicion2 = condicion2
        }
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let condIzq, condDer, unico = null
        if(this.condicionU != null) {
            unico = this.condicionU.interpretar(arbol, tabla)
            if(unico instanceof Errores) return unico

            if(this.condicionU.tipoD.getTipo() != tipoD.BOOL ) return new Errores("Semantico", "La condicion debe ser de tipo bool1", this.linea, this.columna)
        }else {
            condIzq = this.condicion1?.interpretar(arbol, tabla)
            if(condIzq instanceof Errores) return condIzq

            condDer = this.condicion2?.interpretar(arbol, tabla)
            if(condDer instanceof Errores) return condDer
        }

        // if(this.condicion1?.tipoD.getTipo() != tipoD.BOOL || this.condicion2?.tipoD.getTipo() != tipoD.BOOL ) return new Errores("Semantico", "La condicion debe ser de tipo bool2", this.linea, this.columna)

        switch (this.logico) {
            case Logico.OR:
                
                return this.or(condIzq, condDer)
            case Logico.AND:
                
                return this.and(condIzq, condDer)
            case Logico.NOT:
                
                return this.not(unico)
            default:
                return new Errores("Semantico", "Operador logico invalido", this.linea, this.columna)
        }
    }

    or(cond1: any, cond2: any) {
        let tipo1 = this.condicion1?.tipoD.getTipo()
        let tipo2 = this.condicion2?.tipoD.getTipo()

        switch (tipo1) {
            case tipoD.BOOL:
                switch (tipo2) {
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 || cond2
                    default:
                        return new Errores('Semantico', 'OR invalido', this.linea, this.columna )
                }
            
            default:
                return new Errores("Semantico", "Operador logico invalido", this.linea, this.columna)
        }
        // this.tipoD = new Tipo(tipoD.BOOL)
        // return cond1 || cond2
    }

    and(cond1: any, cond2: any) {
        let tipo1 = this.condicion1?.tipoD.getTipo()
        let tipo2 = this.condicion2?.tipoD.getTipo()

        switch (tipo1) {
            case tipoD.BOOL:
                switch (tipo2) {
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 && cond2
                    default:
                        return new Errores('Semantico', 'AND invalido', this.linea, this.columna )
                }
            
            default:
                return new Errores("Semantico", "Operador logico invalido", this.linea, this.columna)
        }
        // this.tipoD = new Tipo(tipoD.BOOL)
        // return cond1 && cond2
    }

    not(cond1: any){
        let tipo1 = this.condicionU?.tipoD.getTipo()

        switch (tipo1) {
            case tipoD.BOOL:
                this.tipoD = new Tipo(tipoD.BOOL)
                return !cond1
            default:
                return new Errores("Semantico", "Operador logico invalido", this.linea, this.columna)
        }
        // console.log("HJOALAAL",cond1)
        // this.tipoD = new Tipo(tipoD.BOOL)
        // return !cond1
    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()
        let resultado = ""

        let nodoE1 = `n${cont.get()}`
        let nodoE2 = `n${cont.get()}`
        let nodoOp = `n${cont.get()}`
        
        resultado += `${nodoE1}[label="EXPRESION"]\n`
        resultado += `${nodoE2}[label="EXPRESION"]\n`
        resultado += `${nodoOp}[label="${this.getLogic(this.logico)}"]\n`

        resultado += `${anterior}->${nodoE1}\n`
        resultado += `${anterior}->${nodoOp}\n`
        resultado += `${anterior}->${nodoE2}\n`

        resultado += this.condicion1?.nodo(nodoE1)
        resultado += this.condicion2?.nodo(nodoE2)

        return resultado
    }

    getLogic(op:any){
        switch (op) {
            case 0:
                return '||'
            case 1:
                return '&&'
            case 2:
                return '!'
        }
    }
}

export enum Logico {
    OR,
    AND,
    NOT
}