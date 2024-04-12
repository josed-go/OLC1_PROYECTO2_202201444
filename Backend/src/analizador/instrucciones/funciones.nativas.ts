import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class FuncionesN extends Instruccion {
    private valor1 : Instruccion | undefined
    private operacion: Operadores

    constructor(operacion: Operadores, fila: number, columna: number, valor1: Instruccion) {
        super(new Tipo(tipoD.VOID), fila, columna)
        this.operacion = operacion
        this.valor1 = valor1
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let unico = null
        if(this.valor1 != null) {
            unico = this.valor1.interpretar(arbol, tabla)
            if(unico instanceof Errores) return unico
        }

        switch (this.operacion) {
            case Operadores.LOWER:
                this.tipoD = new Tipo(tipoD.CADENA)
                if(this.valor1?.tipoD.getTipo() != tipoD.CADENA) return new Errores('Semantico', 'No se puede hacer la funcion con este tipo de dato', this.linea, this.columna)
                return unico.toLocaleLowerCase()
            case Operadores.UPPER:
                this.tipoD = new Tipo(tipoD.CADENA)
                if(this.valor1?.tipoD.getTipo() != tipoD.CADENA) return new Errores('Semantico', 'No se puede hacer la funcion con este tipo de dato', this.linea, this.columna)
                return unico.toLocaleUpperCase()
            case Operadores.ROUND:
                return this.round(unico)
            
            case Operadores.LENGTH:
                return this.longitud(unico)
            default:
                break;
        }
    }

    round(valor:any){
        let tipo = this.valor1?.tipoD.getTipo()
        switch (tipo) {
            case tipoD.DOUBLE:
                this.tipoD = new Tipo(tipoD.INT)
                return Math.round(valor)
            case tipoD.INT:
                this.tipoD = new Tipo(tipoD.INT)
                return Math.round(parseFloat(valor))
            default:
                return new Errores('Semantico', 'No se puede hacer redondear ese tipo de dato', this.linea, this.columna )
        }
    }

    longitud(valor:any) {
        let tipo = this.valor1?.tipoD.getTipo()
        switch (tipo) {
            case tipoD.CADENA:
                this.tipoD = new Tipo(tipoD.INT)
                return valor.length
            default:
                return new Errores('Semantico', 'No se puede hacer redondear ese tipo de dato', this.linea, this.columna )
        }
    }
}

export enum Operadores {
    LOWER,
    UPPER,
    ROUND,
    LENGTH
}