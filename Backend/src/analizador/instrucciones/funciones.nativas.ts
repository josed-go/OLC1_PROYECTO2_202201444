import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
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
                if(Array.isArray(unico)) {
                    return this.longitud2(unico)
                }
                return this.longitud(unico)
            
            case Operadores.TYPEOF:
                return this.tipo()

            case Operadores.TOSTRING:
                return this.string(unico)

            case Operadores.CSTR:
                return this.cstr(unico)
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
                return new Errores('Semantico', 'No se puede realizar el length ese tipo de dato', this.linea, this.columna )
        }
    }

    longitud2(valor:any) {
        let tipo = this.valor1?.tipoD.getTipo()
        switch (tipo) {
            case tipoD.CADENA:
                this.tipoD = new Tipo(tipoD.INT)
                return valor.length
            case tipoD.INT:
                this.tipoD = new Tipo(tipoD.INT)
                return valor.length

            case tipoD.CHAR:
                this.tipoD = new Tipo(tipoD.INT)
                return valor.length

            case tipoD.DOUBLE:
                this.tipoD = new Tipo(tipoD.INT)
                return valor.length
            case tipoD.BOOL:
                this.tipoD = new Tipo(tipoD.INT)
                return valor.length
            default:
                return new Errores('Semantico', 'No se puede realizar el length ese tipo de dato', this.linea, this.columna )
        }
    }

    tipo() {
        let tipo = this.valor1?.tipoD.getTipo()
        switch (tipo) {
            case tipoD.CADENA:
                this.tipoD = new Tipo(tipoD.CADENA)
                return "string"
            case tipoD.INT:
                this.tipoD = new Tipo(tipoD.CADENA)
                return "int"
            case tipoD.DOUBLE:
                this.tipoD = new Tipo(tipoD.CADENA)
                return "double"
            case tipoD.BOOL:
                this.tipoD = new Tipo(tipoD.CADENA)
                return "bool"
            case tipoD.CHAR:
                this.tipoD = new Tipo(tipoD.CADENA)
                return "char"
            default:
                return new Errores('Semantico', 'No se puede retornar ese tipo de dato', this.linea, this.columna )
        }
    }

    string(valor: any) {
        let tipo = this.valor1?.tipoD.getTipo()
        switch (tipo) {
            case tipoD.CADENA:
                this.tipoD = new Tipo(tipoD.CADENA)
                return valor.toString()
            case tipoD.INT:
                this.tipoD = new Tipo(tipoD.CADENA)
                return valor.toString()
            case tipoD.DOUBLE:
                this.tipoD = new Tipo(tipoD.CADENA)
                return valor.toString()
            case tipoD.BOOL:
                this.tipoD = new Tipo(tipoD.CADENA)
                return valor.toString()
            case tipoD.CHAR:
                this.tipoD = new Tipo(tipoD.CADENA)
                return valor.toString()
            default:
                return new Errores('Semantico', 'No se puede retornar ese tipo de dato', this.linea, this.columna )
        }
    }

    cstr(valor: any) {
        let tipo = this.valor1?.tipoD.getTipo()
        switch (tipo) {
            case tipoD.CADENA:
                this.tipoD = new Tipo(tipoD.CHAR)

                return valor.split('')
            default:
                return new Errores('Semantico', 'No se puede usar la funcion c_str con ese tipo de dato', this.linea, this.columna )
        }
    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()
        let resultado = ""

        if(this.operacion == Operadores.LOWER){

            let nodoN = `n${cont.get()}`
            let nodoOU = `n${cont.get()}`
            let nodoP1 = `n${cont.get()}`
            let nodoE = `n${cont.get()}`
            let nodoP2 = `n${cont.get()}`
            let nodoPC = `n${cont.get()}`
    
            resultado += `${nodoN}[label="NATIVO"]\n`
            resultado += `${nodoOU}[label="toLower"]\n`
            resultado += `${nodoP1}[label="("]\n`
            resultado += `${nodoE}[label="EXPRESION"]\n`
            resultado += `${nodoP2}[label=")"]\n`
            resultado += `${nodoPC}[label=";"]\n`
    
            resultado += `${anterior} -> ${nodoN}\n`
            resultado += `${nodoN} -> ${nodoOU}\n`
            resultado += `${nodoN} -> ${nodoP1}\n`
            resultado += `${nodoN} -> ${nodoE}\n`
            resultado += `${nodoN} -> ${nodoP2}\n`
            resultado += `${nodoN} -> ${nodoPC}\n`
    
            resultado += this.valor1?.nodo(nodoE);
        }
            
        if(this.operacion == Operadores.UPPER) {

            let nodoN = `n${cont.get()}`
            let nodoOU = `n${cont.get()}`
            let nodoP1 = `n${cont.get()}`
            let nodoE = `n${cont.get()}`
            let nodoP2 = `n${cont.get()}`
            let nodoPC = `n${cont.get()}`
    
            resultado += `${nodoN}[label="NATIVO"]\n`
            resultado += `${nodoOU}[label="toUpper"]\n`
            resultado += `${nodoP1}[label="("]\n`
            resultado += `${nodoE}[label="EXPRESION"]\n`
            resultado += `${nodoP2}[label=")"]\n`
            resultado += `${nodoPC}[label=";"]\n`
    
            resultado += `${anterior} -> ${nodoN}\n`
            resultado += `${nodoN} -> ${nodoOU}\n`
            resultado += `${nodoN} -> ${nodoP1}\n`
            resultado += `${nodoN} -> ${nodoE}\n`
            resultado += `${nodoN} -> ${nodoP2}\n`
            resultado += `${nodoN} -> ${nodoPC}\n`
    
            resultado += this.valor1?.nodo(nodoE);
        }

        if(this.operacion == Operadores.TYPEOF) {

            let nodoN = `n${cont.get()}`
            let nodoOU = `n${cont.get()}`
            let nodoP1 = `n${cont.get()}`
            let nodoE = `n${cont.get()}`
            let nodoP2 = `n${cont.get()}`
            let nodoPC = `n${cont.get()}`
    
            resultado += `${nodoN}[label="NATIVO"]\n`
            resultado += `${nodoOU}[label="typeOf"]\n`
            resultado += `${nodoP1}[label="("]\n`
            resultado += `${nodoE}[label="EXPRESION"]\n`
            resultado += `${nodoP2}[label=")"]\n`
            resultado += `${nodoPC}[label=";"]\n`
    
            resultado += `${anterior} -> ${nodoN}\n`
            resultado += `${nodoN} -> ${nodoOU}\n`
            resultado += `${nodoN} -> ${nodoP1}\n`
            resultado += `${nodoN} -> ${nodoE}\n`
            resultado += `${nodoN} -> ${nodoP2}\n`
            resultado += `${nodoN} -> ${nodoPC}\n`
    
            resultado += this.valor1?.nodo(nodoE);
        }

        if(this.operacion == Operadores.TOSTRING) {

            let nodoN = `n${cont.get()}`
            let nodoSTD = `n${cont.get()}`
            let nodoOU = `n${cont.get()}`
            let nodoP1 = `n${cont.get()}`
            let nodoE = `n${cont.get()}`
            let nodoP2 = `n${cont.get()}`
            let nodoPC = `n${cont.get()}`
    
            resultado += `${nodoN}[label="NATIVO"]\n`
            resultado += `${nodoSTD}[label="std::string"]\n`
            resultado += `${nodoOU}[label="toString"]\n`
            resultado += `${nodoP1}[label="("]\n`
            resultado += `${nodoE}[label="EXPRESION"]\n`
            resultado += `${nodoP2}[label=")"]\n`
            resultado += `${nodoPC}[label=";"]\n`
    
            resultado += `${anterior} -> ${nodoN}\n`
            resultado += `${nodoN} -> ${nodoSTD}\n`
            resultado += `${nodoN} -> ${nodoOU}\n`
            resultado += `${nodoN} -> ${nodoP1}\n`
            resultado += `${nodoN} -> ${nodoE}\n`
            resultado += `${nodoN} -> ${nodoP2}\n`
            resultado += `${nodoN} -> ${nodoPC}\n`
    
            resultado += this.valor1?.nodo(nodoE);
        }
        
        if(this.operacion == Operadores.ROUND) {

            let nodoN = `n${cont.get()}`
            let nodoOU = `n${cont.get()}`
            let nodoP1 = `n${cont.get()}`
            let nodoE = `n${cont.get()}`
            let nodoP2 = `n${cont.get()}`
            let nodoPC = `n${cont.get()}`
    
            resultado += `${nodoN}[label="NATIVO"]\n`
            resultado += `${nodoOU}[label="round"]\n`
            resultado += `${nodoP1}[label="("]\n`
            resultado += `${nodoE}[label="EXPRESION"]\n`
            resultado += `${nodoP2}[label=")"]\n`
            resultado += `${nodoPC}[label=";"]\n`
    
            resultado += `${anterior} -> ${nodoN}\n`
            resultado += `${nodoN} -> ${nodoOU}\n`
            resultado += `${nodoN} -> ${nodoP1}\n`
            resultado += `${nodoN} -> ${nodoE}\n`
            resultado += `${nodoN} -> ${nodoP2}\n`
            resultado += `${nodoN} -> ${nodoPC}\n`
    
            resultado += this.valor1?.nodo(nodoE);
        }

        if(this.operacion == Operadores.LENGTH) {

            let nodoN = `n${cont.get()}`
            let nodoOU = `n${cont.get()}`
            let nodoP1 = `n${cont.get()}`
            let nodoE = `n${cont.get()}`
            let nodoP2 = `n${cont.get()}`
            let nodoPC = `n${cont.get()}`
    
            resultado += `${nodoN}[label="NATIVO"]\n`
            resultado += `${nodoOU}[label=".length"]\n`
            resultado += `${nodoP1}[label="("]\n`
            resultado += `${nodoE}[label="EXPRESION"]\n`
            resultado += `${nodoP2}[label=")"]\n`
            resultado += `${nodoPC}[label=";"]\n`
    
            resultado += `${anterior} -> ${nodoN}\n`
            resultado += `${nodoN} -> ${nodoOU}\n`
            resultado += `${nodoN} -> ${nodoP1}\n`
            resultado += `${nodoN} -> ${nodoE}\n`
            resultado += `${nodoN} -> ${nodoP2}\n`
            resultado += `${nodoN} -> ${nodoPC}\n`
    
            resultado += this.valor1?.nodo(nodoE);
        }

        if(this.operacion == Operadores.CSTR) {

            let nodoN = `n${cont.get()}`
            let nodoOU = `n${cont.get()}`
            let nodoP1 = `n${cont.get()}`
            let nodoE = `n${cont.get()}`
            let nodoP2 = `n${cont.get()}`
            let nodoPC = `n${cont.get()}`
    
            resultado += `${nodoN}[label="NATIVO"]\n`
            resultado += `${nodoOU}[label=".c_str"]\n`
            resultado += `${nodoP1}[label="("]\n`
            resultado += `${nodoE}[label="EXPRESION"]\n`
            resultado += `${nodoP2}[label=")"]\n`
            resultado += `${nodoPC}[label=";"]\n`
    
            resultado += `${anterior} -> ${nodoN}\n`
            resultado += `${nodoN} -> ${nodoOU}\n`
            resultado += `${nodoN} -> ${nodoP1}\n`
            resultado += `${nodoN} -> ${nodoE}\n`
            resultado += `${nodoN} -> ${nodoP2}\n`
            resultado += `${nodoN} -> ${nodoPC}\n`
    
            resultado += this.valor1?.nodo(nodoE);
        }

        return resultado

    }
}

export enum Operadores {
    LOWER,
    UPPER,
    ROUND,
    LENGTH,
    TYPEOF,
    TOSTRING,
    CSTR
}