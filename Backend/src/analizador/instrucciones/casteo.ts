import AST from "../abstracto/ast";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Casteo extends Instruccion {
    private exp: Instruccion
    private tipo: Tipo

    constructor(exp: Instruccion, tipo: Tipo, linea: number, columna:number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.exp = exp
        this.tipo = tipo
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let expresion = this.exp.interpretar(arbol, tabla)
        switch (this.tipo.getTipo()) {
            case tipoD.INT:
                return this.casteoInt(expresion)

            case tipoD.DOUBLE:
                return this.casteoDouble(expresion)

            case tipoD.CADENA:
                return this.casteoString(expresion)

            case tipoD.CHAR:
                return this.casteoChar(expresion)
        
            default:
                return new Errores("Semantico", "No es posible ese casteo", this.linea, this.columna)
        }   
    }

    casteoInt(exp:any) {
        let tipo = this.exp.tipoD.getTipo()
        switch (tipo) {
            case tipoD.DOUBLE:
                this.tipoD = new Tipo(tipoD.INT)
                return parseInt(exp)

            case tipoD.CHAR:
                this.tipoD = new Tipo(tipoD.INT)
                return parseInt(exp.charCodeAt(1))
        
            default:
                return new Errores("Semantico", "No es posible castear el valor", this.linea, this.columna)
        }
    }

    casteoString(exp:any) {
        let tipo = this.exp.tipoD.getTipo()
        switch (tipo) {
            case tipoD.INT:
                this.tipoD = new Tipo(tipoD.CADENA)
                return parseInt(exp).toString()

            case tipoD.DOUBLE:
                this.tipoD = new Tipo(tipoD.CADENA)
                return parseFloat(exp).toString()

            case tipoD.CHAR:
                this.tipoD = new Tipo(tipoD.CADENA)
                return exp.charCodeAt(1).toString()
        
            default:
                return new Errores("Semantico", "No es posible castear el valor", this.linea, this.columna)
        }
    }

    casteoDouble(exp:any) {
        let tipo = this.exp.tipoD.getTipo()
        switch (tipo) {
            case tipoD.INT:
                this.tipoD = new Tipo(tipoD.DOUBLE)
                return parseFloat(exp)

            case tipoD.CHAR:
                this.tipoD = new Tipo(tipoD.DOUBLE)
                return parseFloat(exp.charCodeAt(1))
        
            default:
                return new Errores("Semantico", "No es posible castear el valor", this.linea, this.columna)
        }
    }

    casteoChar(exp:any) {
        let tipo = this.exp.tipoD.getTipo()
        switch (tipo) {
            case tipoD.INT:
                this.tipoD = new Tipo(tipoD.CHAR)
                return String.fromCharCode(parseInt(exp))
        
            default:
                return new Errores("Semantico", "No es posible castear el valor", this.linea, this.columna)
        }
    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()

        let resultado = ""

        let nodoP = `n${cont.get()}`
        let nodoP1 = `n${cont.get()}`
        let nodoT = `n${cont.get()}`
        let nodoP2 = `n${cont.get()}`
        let nodoV = `n${cont.get()}`
        let nodoPC = `n${cont.get()}`

        resultado += `${nodoP}[label="CASTEO"]\n`
        resultado += `${nodoP1}[label="("]\n`

        switch (this.tipo.getTipo()) {
            case tipoD.INT:
                resultado += `${nodoT}[label="int"]\n`

            case tipoD.DOUBLE:
                resultado += `${nodoT}[label="double"]\n`

            case tipoD.CADENA:
                resultado += `${nodoT}[label="std::string"]\n`

            case tipoD.CHAR:
                resultado += `${nodoT}[label="char"]\n`
        
        }

        resultado += `${nodoP2}[label=")"]\n`
        resultado += `${nodoV}[label="EXPRESION"]\n`
        resultado += `${nodoPC}[label=";"]\n`


        resultado += `${anterior} -> ${nodoP};\n`
        resultado += `${nodoP} -> ${nodoP1};\n`
        resultado += `${nodoP} -> ${nodoT};\n`
        resultado += `${nodoP} -> ${nodoP2};\n`
        resultado += `${nodoP} -> ${nodoV};\n`
        resultado += `${nodoP} -> ${nodoPC};\n`

        return resultado
    }


}
