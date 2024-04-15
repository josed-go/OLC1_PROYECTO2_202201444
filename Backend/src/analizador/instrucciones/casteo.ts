import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
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


}
