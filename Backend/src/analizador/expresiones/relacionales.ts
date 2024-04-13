import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Relacionales extends Instruccion {
    private condicion1: Instruccion
    private condicion2: Instruccion
    private relacional: Relacional

    constructor(relacional: Relacional, condicion1: Instruccion, condicion2: Instruccion, linea: number, columna: number){
        super(new Tipo(tipoD.BOOL), linea, columna)
        this.condicion1 = condicion1
        this.condicion2 = condicion2
        this.relacional = relacional
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let condIzq = this.condicion1.interpretar(arbol, tabla)
        if(condIzq instanceof Errores) return condIzq

        let condDer = this.condicion2.interpretar(arbol, tabla)
        if(condDer instanceof Errores) return condDer

        switch (this.relacional) {
            case Relacional.MAYOR:
                
                return this.mayor(condIzq, condDer)
            case Relacional.MENOR:
                
                return this.menor(condIzq, condDer)
            case Relacional.IGUAL:
            
                return this.igual(condIzq, condDer)
            case Relacional.DIF:
            
                return this.dif(condIzq, condDer)
            default:
                return new Errores("Semantico", "Operador relacional invalido", this.linea, this.columna)
        }
    }

    menor(cond1:any, cond2: any) {
        let comp1 = this.condicion1.tipoD.getTipo()
        let comp2 = this.condicion2.tipoD.getTipo()

        switch (comp1) {
            case tipoD.INT:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) < parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) < parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) < parseInt(cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) < cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida1", this.linea, this.columna)
                }
            case tipoD.DOUBLE:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) < parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) < parseFloat(cond2)
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) < parseFloat(cond2.charCodeAt(1))
    
                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseFloat(cond1) < parseFloat(cond2)
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) < cond2
                    default:
                        return new Errores("Semantico", "Relacional invalida2", this.linea, this.columna)
                }
            case tipoD.CHAR:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1.charCodeAt(1)) < parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1.charCodeAt(1)) < parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return (cond1.charCodeAt(1)) < (cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1.charCodeAt(1)) < cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida3", this.linea, this.columna)
                }
            case tipoD.CADENA:
                switch (comp2) {
                    // case tipoD.INT:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1.charCodeAt(1)) < parseInt(cond2)

                    // case tipoD.DOUBLE:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseFloat(cond1.charCodeAt(1)) < parseFloat(cond2)
                    
                    // case tipoD.CHAR:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return (cond1.charCodeAt(1)) < (cond2.charCodeAt(1))

                    case tipoD.CADENA:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 < cond2

                    // case tipoD.BOOL:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1.charCodeAt(1)) < cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida4", this.linea, this.columna)
                }
            case tipoD.BOOL:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 < parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 < parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 < parseInt(cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 < cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida5", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional invalida6", this.linea, this.columna)
        }
    }

    mayor(cond1:any, cond2: any) {
        let comp1 = this.condicion1.tipoD.getTipo()
        let comp2 = this.condicion2.tipoD.getTipo()

        switch (comp1) {
            case tipoD.INT:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) > parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) > parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) > parseInt(cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) > cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida1", this.linea, this.columna)
                }
            case tipoD.DOUBLE:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) > parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) > parseFloat(cond2)
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) > parseFloat(cond2.charCodeAt(1))
    
                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseFloat(cond1) < parseFloat(cond2)
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) > cond2
                    default:
                        return new Errores("Semantico", "Relacional invalida2", this.linea, this.columna)
                }
            case tipoD.CHAR:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1.charCodeAt(1)) > parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1.charCodeAt(1)) > parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return (cond1.charCodeAt(1)) > (cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1.charCodeAt(1)) > cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida3", this.linea, this.columna)
                }
            case tipoD.CADENA:
                switch (comp2) {
                    // case tipoD.INT:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1.charCodeAt(1)) < parseInt(cond2)

                    // case tipoD.DOUBLE:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseFloat(cond1.charCodeAt(1)) < parseFloat(cond2)
                    
                    // case tipoD.CHAR:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return (cond1.charCodeAt(1)) < (cond2.charCodeAt(1))

                    case tipoD.CADENA:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 > cond2

                    // case tipoD.BOOL:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1.charCodeAt(1)) < cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida4", this.linea, this.columna)
                }
            case tipoD.BOOL:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 > parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 > parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 > parseInt(cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 > cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida5", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional invalida6", this.linea, this.columna)
        }
    }

    igual(cond1:any, cond2: any) {
        let comp1 = this.condicion1.tipoD.getTipo()
        let comp2 = this.condicion2.tipoD.getTipo()

        switch (comp1) {
            case tipoD.INT:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) == parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) == parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) == parseInt(cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) == cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida1", this.linea, this.columna)
                }
            case tipoD.DOUBLE:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) == parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) == parseFloat(cond2)
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) == parseFloat(cond2.charCodeAt(1))
    
                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseFloat(cond1) < parseFloat(cond2)
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) == cond2
                    default:
                        return new Errores("Semantico", "Relacional invalida2", this.linea, this.columna)
                }
            case tipoD.CHAR:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1.charCodeAt(1)) == parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1.charCodeAt(1)) == parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return (cond1.charCodeAt(1)) == (cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1.charCodeAt(1)) == cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida3", this.linea, this.columna)
                }
            case tipoD.CADENA:
                switch (comp2) {
                    // case tipoD.INT:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1.charCodeAt(1)) < parseInt(cond2)

                    // case tipoD.DOUBLE:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseFloat(cond1.charCodeAt(1)) < parseFloat(cond2)
                    
                    // case tipoD.CHAR:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return (cond1.charCodeAt(1)) < (cond2.charCodeAt(1))

                    case tipoD.CADENA:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 == cond2

                    // case tipoD.BOOL:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1.charCodeAt(1)) < cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida4", this.linea, this.columna)
                }
            case tipoD.BOOL:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 == parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 == parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 == parseInt(cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 == cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida5", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional invalida6", this.linea, this.columna)
        }
    }

    dif(cond1:any, cond2: any) {
        let comp1 = this.condicion1.tipoD.getTipo()
        let comp2 = this.condicion2.tipoD.getTipo()

        switch (comp1) {
            case tipoD.INT:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) != parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) != parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) != parseInt(cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1) != cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida1", this.linea, this.columna)
                }
            case tipoD.DOUBLE:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) != parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) != parseFloat(cond2)
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) != parseFloat(cond2.charCodeAt(1))
    
                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseFloat(cond1) < parseFloat(cond2)
                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1) != cond2
                    default:
                        return new Errores("Semantico", "Relacional invalida2", this.linea, this.columna)
                }
            case tipoD.CHAR:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1.charCodeAt(1)) != parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseFloat(cond1.charCodeAt(1)) != parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return (cond1.charCodeAt(1)) != (cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return parseInt(cond1.charCodeAt(1)) != cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida3", this.linea, this.columna)
                }
            case tipoD.CADENA:
                switch (comp2) {
                    // case tipoD.INT:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1.charCodeAt(1)) < parseInt(cond2)

                    // case tipoD.DOUBLE:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseFloat(cond1.charCodeAt(1)) < parseFloat(cond2)
                    
                    // case tipoD.CHAR:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return (cond1.charCodeAt(1)) < (cond2.charCodeAt(1))

                    case tipoD.CADENA:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 != cond2

                    // case tipoD.BOOL:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1.charCodeAt(1)) < cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida4", this.linea, this.columna)
                }
            case tipoD.BOOL:
                switch (comp2) {
                    case tipoD.INT:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 != parseInt(cond2)

                    case tipoD.DOUBLE:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 != parseFloat(cond2)
                    
                    case tipoD.CHAR:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 != parseInt(cond2.charCodeAt(1))

                    // case tipoD.CADENA:
                    //     this.tipoD = new Tipo(tipoD.BOOL)
                    //     return parseInt(cond1) < parseInt(cond2)

                    case tipoD.BOOL:
                        this.tipoD = new Tipo(tipoD.BOOL)
                        return cond1 != cond2

                    default:
                        return new Errores("Semantico", "Relacional invalida5", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional invalida6", this.linea, this.columna)
        }
    }
}

export enum Relacional {
    MENOR,
    MAYOR,
    IGUAL,
    DIF,
    MENORI,
    MAYORI
}