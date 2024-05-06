import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
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
        
            case Operadores.MOD:
                return this.mod(oprI, oprD)
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
                        return parseInt(valor1) + parseInt(valor2.charCodeAt(0))
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
                        return parseFloat(valor1) + parseFloat(valor2.charCodeAt(0))
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
                        return parseInt(valor1) - parseInt(valor2.charCodeAt(0))
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
                        return parseFloat(valor1) - parseFloat(valor2.charCodeAt(0))
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
                        return parseInt(valor1.charCodeAt(0)) - (valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1.charCodeAt(0)) - parseFloat(valor2)
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
                        return parseInt(valor1) * parseInt(valor2.charCodeAt(0))
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
                        return parseFloat(valor1) * parseFloat(valor2.charCodeAt(0))
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" * "+tipo2, this.linea, this.columna )
                }
            case tipoD.CHAR:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.INT)
                        return parseInt(valor1.charCodeAt(0)) * (valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1.charCodeAt(0)) * parseFloat(valor2)
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
                        return parseFloat(valor1) / parseFloat(valor2.charCodeAt(0))
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
                        return parseFloat(valor1) / parseFloat(valor2.charCodeAt(0))
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

    mod(valor1: any, valor2: any) {
        let tipo1 = this.valor1?.tipoD.getTipo()
        let tipo2 = this.valor2?.tipoD.getTipo()

        switch (tipo1) {
            case tipoD.INT:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) % parseFloat(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) % parseFloat(valor2)
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" % "+tipo2, this.linea, this.columna )
                }

            case tipoD.DOUBLE:
                switch (tipo2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) % parseFloat(valor2)
                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.DOUBLE)
                        return parseFloat(valor1) % parseFloat(valor2)
                    default:
                        return new Errores('Semantico', 'No se puede hacer '+tipo1+" % "+tipo2, this.linea, this.columna )
                }
            default:
                return new Errores('Semantico', 'No se puede hacer '+tipo1+" % "+tipo2, this.linea, this.columna )
        }
    }

    public nodo(anterior: string): string {
        let cont = Cont.getInstancia()
        let resultado = ""
        if(this.opU != undefined){
            let nodoN = `N${cont.get()}`
            let nodoExp = `N${cont.get()}`
            resultado += `${nodoN}[label=\"-\"]\n`
            resultado += `${nodoExp}[label=\"EXPRESION\"]\n`
            resultado += `${anterior}->${nodoN}\n`
            resultado += `${anterior}->${nodoExp}\n`
            resultado += this.opU?.nodo(nodoExp)
            return resultado
        }

        let nodoE1 = `n${cont.get()}`
        let nodoop = `n${cont.get()}`
        let nodoE2 = `n${cont.get()}`

        resultado += `${nodoE1}[label=\"EXPRESION\"]\n`
        resultado += `${nodoop}[label=\"${this.getOperacion(this.operacion)}\"]\n`
        resultado += `${nodoE2}[label=\"EXPRESION\"]\n`
        resultado += `${anterior}->${nodoE1}\n`
        resultado += `${anterior}->${nodoop}\n`
        resultado += `${anterior}->${nodoE2}\n`
        resultado += this.valor1?.nodo(nodoE1)
        resultado += this.valor2?.nodo(nodoE2)
        
        return resultado
    }

    getOperacion(num: any){
        switch (num) {
            case 0:
                return '+'

            case 1:
                return '-'
                
            case 2:
                return '-'
                
            case 3:
                return '*'
                
            case 4:
                return '/'
                
            case 6:
                return '%'
                
        }
    }
}

export enum Operadores {
    SUMA,
    RESTA,
    NEGACION,
    MUL,
    DIV,
    POW,
    MOD
}