import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";
import Break from "./break";
import Continue from "./continue";
import Return from "./return";
import Switch from "./switch";

export default class Funcion extends Instruccion {
    public id: string
    public parametros: any[]
    public instrucciones: Instruccion[]

    constructor(id:string, tipo: Tipo, instrucciones: Instruccion[], linea:number, columna: number, parametros: any[]) {
        super(tipo, linea, columna)
        this.id = id
        this.parametros = parametros
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        // if(this.tipoD.getTipo() == tipoD.VOID) return new Errores("Semantico", "Una funcion no puede ser de tipo void", this.linea, this.columna)
        /*for(let i of this.instrucciones) {
    
            if( i instanceof Errores) {
                lista_errores.push(i)
                arbol.actualizarConsola((<Errores>i).obtenerError())
            }
    
            // if(i instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.columna)
            // if(i instanceof Break) return
    
            let resultado = i.interpretar(arbol, tabla)
    
            if( resultado instanceof Errores) {
                // lista_errores.push(resultado)
                // arbol.actualizarConsola((<Errores>resultado).obtenerError())
                return resultado
            }
    
            // if(resultado instanceof Break) return
            // if(resultado instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.columna)
            // if(i instanceof Return) {
                
                if(resultado instanceof Return) {
                    // tieneRe = true
                    // let a = resultado.interpretar(arbol, tabla)
                    console.log("entreeeeeeeeeeeeeeeeeeeeeeeeeeee", resultado.valor)
                    if(resultado.valor != null) {
                        if(this.tipoD.getTipo() == resultado.tipoD.getTipo()) {
                            console.log("resulvalor ", resultado.valor)
                            return resultado.valor
                        }else {
                            return new Errores("Semantico", "El tipo de la funcion y del valor de retorno son diferentes", this.linea, this.columna)
                        }
                    }else {
                        return new Errores("Semantico", "La función debe de retornar un valor", this.linea, this.columna)
                    }
    
                }
            // }
            
        }*/

        // if(!tieneRe) return new Errores("Semantico", "La función debe de retornar un valor", this.linea, this.columna)

        for (let i = 0; i < this.instrucciones.length; i++) {
            let varN = this.instrucciones[i].interpretar(arbol, tabla)

            if(varN instanceof Errores) return varN
            
            if(varN instanceof Return) {
                if(varN.valor != null){
                    if(this.tipoD.getTipo() != varN.tipoD.getTipo()) return new Errores("Semantico", "El tipo de la funcion y del valor de retorno son diferentes", this.linea, this.columna)
                    return varN.valor
                }
            } 
            
            if(i == this.instrucciones.length - 1) return new Errores("Semantico", "Debe de retornar un valor", this.linea, this.columna)

            // else {
            //     // return new Errores("Semantico", "Debe de retornar un valor", this.linea, this.columna)
            // }
        }

        // if(!bandera) return new Errores("Semantico", "Debe de retornar un valor", this.linea, this.columna)
    }

    nodo(anterior: string): string {
        return ""
    }

}