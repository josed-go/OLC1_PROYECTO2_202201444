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
                if(this.valor1?.tipoD.getTipo() != tipoD.CADENA) return new Errores('Semantico', 'No se puede hacer la funcion con este tipo de dato', this.linea, this.columna)
                return unico.toLocaleLowerCase()
            case Operadores.UPPER:
                if(this.valor1?.tipoD.getTipo() != tipoD.CADENA) return new Errores('Semantico', 'No se puede hacer la funcion con este tipo de dato', this.linea, this.columna)
                return unico.toLocaleUpperCase()
        
            default:
                break;
        }
    }
}

export enum Operadores {
    LOWER,
    UPPER
}