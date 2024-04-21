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

export default class Metodo extends Instruccion {
    public id: string
    public parametros: any[]
    public instrucciones: Instruccion[]
    // public tipoS: string

    constructor(id:string, tipo: Tipo, instrucciones: Instruccion[], linea:number, columna: number, parametros: any[]) {
        super(tipo, linea, columna)
        this.id = id
        this.parametros = parametros
        this.instrucciones = instrucciones
        // this.tipoS = ""
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        if(this.tipoD.getTipo() != tipoD.VOID) return new Errores("Semantico", "El metodo debe de ser de tipo void", this.linea, this.columna)
            // this.tipoS = "Metodo"
                // return new Errores("Semantico", "El metodo debe de ser de tipo void", this.linea, this.columna)
        
            for(let i of this.instrucciones) {
        
                if( i instanceof Errores) {
                    lista_errores.push(i)
                    arbol.actualizarConsola((<Errores>i).obtenerError())
                }

                // if(i instanceof Return) {
                //     if(i.valor != undefined){
                //         return i.valor
                //     }
                // }
        
                // if(i instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.columna)
                // if(i instanceof Break) return
        
                let resultado = i.interpretar(arbol, tabla)
        
                if( resultado instanceof Errores) {
                    lista_errores.push(resultado)
                    arbol.actualizarConsola((<Errores>resultado).obtenerError())
                }
        
                // if(resultado instanceof Break) return
                // if(resultado instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.columna)
                
                // if(i instanceof Return) {
                    if(resultado instanceof Return) {
                        if(resultado.valor != null) {
                            // let error = new Errores("Semantico", "No se puede devolver un valor en un metodo", this.linea, this.columna)
                            // lista_errores.push(error)
                            // arbol.actualizarConsola((<Errores>error).obtenerError())
                            return new Errores("Semantico", "No se puede devolver un valor en un metodo", this.linea, this.columna)
                        }
                        break
        
                    }//else {
                        //return new Errores("Semantico", "No se puede devolver un valor en un metodo", this.linea, this.columna)
                    //}
                    // if(i.valor != null) {
                    //     let error = new Errores("Semantico", "No se puede devolver un valor en un metodo", this.linea, this.columna)
                    //     lista_errores.push(error)
                    //     arbol.actualizarConsola((<Errores>error).obtenerError())
                    // }else {
                    //     break
                    // }
                //}
        
                
            }

        //}else {
            // let tieneRe = false
            /*this.tipoS = "Funcion"
            console.log("entre")
            for(let i of this.instrucciones) {
        
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

                if(resultado instanceof Return) {
                    // tieneRe = true
                    if(resultado.valor != null) {
                        if(this.tipoD.getTipo() != resultado.tipoD.getTipo()) {
                            return resultado.valor
                        }else {
                            return new Errores("Semantico", "El tipo de la funcion y del valor de retorno son diferentes", this.linea, this.columna)
                        }
                    }else {
                        return new Errores("Semantico", "La función debe de retornar un valor", this.linea, this.columna)
                    }
    
                }
                
            }

            // if(!tieneRe) return new Errores("Semantico", "La función debe de retornar un valor", this.linea, this.columna)
        }*/
    }

    nodo(anterior: string): string {
        return ""
    }

}