import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Aritmeticas extends Instruccion {
    private valor1 : Instruccion | undefined
    private valor2 : Instruccion | undefined
    private operacion: Operadores
    private opU: Instruccion | undefined
    
    constructor(operacion: Operadores, fila: number, columna: number, valor1: Instruccion, valor2?: Instruccion) {
        super(new Tipo(tipoD.VOID), fila, columna)
        this.operacion = operacion
        if(!valor2) this.opU = valor1
        else {
            this.valor1 = valor1
            this.valor2 = valor2
        }
    }
    
    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let oprI, oprD, unico = null
        if(this.opU != null) {
            unico = this.opU.interpretar(arbol, tabla)
            if(unico instanceof Errores) return unico
        }else {
            oprI = this.valor1?.interpretar(arbol, tabla)
            if(oprI instanceof Errores) return oprI
            oprD = this.valor2?.interpretar(arbol, tabla)
            if(oprD instanceof Errores) return oprD
        }
        switch (this.operacion) {
            case Operadores.SUMA:
                
                return this.suma(oprI, oprD)
            
            case Operadores.RESTA:
                return this.resta(oprI, oprD)

            case Operadores.NEGACION:
            
                return this.negacion(unico)

            case Operadores.MUL:
                return this.multi(oprI, oprD)

            case Operadores.DIV:
                return this.div(oprI, oprD)
            
            case Operadores.POW:
                return this.pow(oprI, oprD)
        
            default:
                return new Errores('Semantico', 'Operador invalido', this.linea, this.columna)
        }

        
    }

    suma(valor1: any, valor2: any) {
        let tipo1 = this.valor1?.tipoD.getTipo()
        let tipo2 = this.valor2?.tipoD.getTipo()

        switch (tipo1) {
            case tipoD.INT:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1) + parseInt(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) + parseFloat(valor2)
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1) + valor2
                    case tipoD.CADENA:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1) + parseInt(valor2.charCodeAt(1))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" + "+tipo2, this.linea, this.columna )
                }

            case tipoD.DOUBLE:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) + parseFloat(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) + parseFloat(valor2)
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) + valor2
                    case tipoD.CADENA:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) + parseFloat(valor2.charCodeAt(1))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" + "+tipo2, this.linea, this.columna )
                }
            case tipoD.BOOL:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return valor1 + parseInt(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return valor1 + parseFloat(valor2)
                    case tipoD.CADENA:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" + "+tipo2, this.linea, this.columna )
                }
            case tipoD.CADENA:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    case tipoD.CADENA:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" + "+tipo2, this.linea, this.columna )
                }
            case tipoD.CHAR:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1.charCodeAt[0]) + (valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1.charCodeAt[0]) + parseFloat(valor2)
                    case tipoD.CADENA:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.CADENA)
                        return valor1 + valor2
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" + "+tipo2, this.linea, this.columna )
                }
            default:
                return new Errores('Semantico', 'No se puede hacer '+tipo1+" + "+tipo2, this.linea, this.columna )
        }
    }
    
    resta(valor1: any, valor2: any) {
        let tipo1 = this.valor1?.tipoD.getTipo()
        let tipo2 = this.valor2?.tipoD.getTipo()

        switch (tipo1) {
            case tipoD.INT:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1) - parseInt(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) - parseFloat(valor2)
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1) - valor2
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1) - parseInt(valor2.charCodeAt(1))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" - "+tipo2, this.linea, this.columna )
                }

            case tipoD.DOUBLE:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) - parseFloat(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) - parseFloat(valor2)
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) - valor2
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) - parseFloat(valor2.charCodeAt(1))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" - "+tipo2, this.linea, this.columna )
                }
            case tipoD.BOOL:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return valor1 - parseInt(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return valor1 - parseFloat(valor2)
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" - "+tipo2, this.linea, this.columna )
                }
            case tipoD.CHAR:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1.charCodeAt(1)) - (valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1.charCodeAt(1)) - parseFloat(valor2)
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" + "+tipo2, this.linea, this.columna )
                }
            default:
                return new Errores('Semantico', 'No se puede hacer '+tipo1+" + "+tipo2, this.linea, this.columna )
        }
    }

    negacion(valor1: any) {
        let opeU = this.opU?.tipoD.getTipo()

        switch (opeU) {
            case tipoD.INT:
                this.tipoD = new Tipo(tipoD.INT)
                return parseInt(valor1) * -1
            case tipoD.DOUBLE:
                this.tipoD = new Tipo(tipoD.DOUBLE)
                return parseFloat(valor1) * -1
            default:
                return new Errores('Semantico', 'No se puede hacer negar '+opeU, this.linea, this.columna )
        }
    }

    multi(valor1: any, valor2: any) {
        let tipo1 = this.valor1?.tipoD.getTipo()
        let tipo2 = this.valor2?.tipoD.getTipo()

        switch (tipo1) {
            case tipoD.INT:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1) * parseInt(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) * parseFloat(valor2)
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1) * parseInt(valor2.charCodeAt(1))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" * "+tipo2, this.linea, this.columna )
                }
            case tipoD.DOUBLE:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) * parseFloat(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) * parseFloat(valor2)
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) * parseFloat(valor2.charCodeAt(1))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" * "+tipo2, this.linea, this.columna )
                }
            case tipoD.CHAR:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1.charCodeAt(1)) * (valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1.charCodeAt(1)) * parseFloat(valor2)
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" * "+tipo2, this.linea, this.columna )
                }
            default:
                return new Errores('Semantico', 'No se puede hacer '+tipo1+" * "+tipo2, this.linea, this.columna )
        }
    }

    div(valor1: any, valor2: any) {
        let tipo1 = this.valor1?.tipoD.getTipo()
        let tipo2 = this.valor2?.tipoD.getTipo()

        switch (tipo1) {
            case tipoD.INT:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) / parseFloat(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) / parseFloat(valor2)
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) / parseFloat(valor2.charCodeAt(1))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" / "+tipo2, this.linea, this.columna )
                }

            case tipoD.DOUBLE:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) / parseFloat(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) / parseFloat(valor2)
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) / parseFloat(valor2.charCodeAt(1))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" / "+tipo2, this.linea, this.columna )
                }
            case tipoD.CHAR:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1.charCodeAt[0]) / parseFloat(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1.charCodeAt[0]) / parseFloat(valor2)
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" / "+tipo2, this.linea, this.columna )
                }
            default:
                return new Errores('Semantico', 'No se puede hacer '+tipo1+" / "+tipo2, this.linea, this.columna )
        }
    }

    pow(valor1: any, valor2: any) {
        let tipo1 = this.valor1?.tipoD.getTipo()
        let tipo2 = this.valor2?.tipoD.getTipo()

        switch (tipo1) {
            case tipoD.INT:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return Math.pow(parseInt(valor1), parseInt(valor2))
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return Math.pow(parseFloat(valor1), parseFloat(valor2))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+"^"+tipo2, this.linea, this.columna )
                }

            case tipoD.DOUBLE:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return Math.pow(parseFloat(valor1), parseFloat(valor2))
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return Math.pow(parseFloat(valor1), parseFloat(valor2))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+"^"+tipo2, this.linea, this.columna )
                }
            default:
                return new Errores('Semantico', 'No se puede hacer '+tipo1+"^"+tipo2, this.linea, this.columna )
        }
    }
}

export enum Operadores {
    SUMA,
    RESTA,
    NEGACION,
    MUL,
    DIV,
    POW
}