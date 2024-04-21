import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
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
        let cont = Cont.getInstancia()
        let resultado = ""

        let paramsT = []
        let params = []
        let instru = []

        let nodoP = `n${cont.get()}`
        let nodoT = `n${cont.get()}`
        let nodoPI = `n${cont.get()}`
        let nodoID = `n${cont.get()}`
        let nodoP1 = `n${cont.get()}`
        let nodoPar = `n${cont.get()}`

        let nodoP2 = `n${cont.get()}`
        let nodoL1 = `n${cont.get()}`
        let nodoL2 = `n${cont.get()}`
        let nodoPIns = `n${cont.get()}`

        for(let i = 0; i < this.parametros.length; i++){
            paramsT.push(`n${cont.get()}`)
            params.push(`n${cont.get()}`)
        }

        for(let i= 0; i< this.instrucciones.length; i++){
            instru.push(`n${cont.get()}`)
        }

        resultado += `${nodoP}[label="METODO"]\n`
        resultado += `${nodoT}[label="VOID"]\n`

        resultado += `${nodoPI}[label="ID"]\n`
        resultado += `${nodoID}[label="${this.id}"]\n`
        resultado += `${nodoP1}[label="("]\n`
        resultado += `${nodoPar}[label="PARAMS"]\n`

        for(let i = 0; i < this.parametros.length; i++){
            if(this.parametros[i].tipo.getTipo() == tipoD.INT){
                resultado += `${paramsT[i]}[label="INT"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoD.DOUBLE){
                resultado += `${paramsT[i]}[label="DOUBLE"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoD.CADENA){
                resultado += `${paramsT[i]}[label="std::string"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoD.BOOL){
                resultado += `${paramsT[i]}[label="BOOL"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoD.VOID){
                resultado += `${paramsT[i]}[label="VOID"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoD.CHAR){
                resultado += `${paramsT[i]}[label="CHAR"]\n`
            }
            
            resultado += `${params[i]}[label="${this.parametros[i].id}"]\n`
        }

        resultado += `${nodoP2}[label=")"]\n`
        resultado += `${nodoL1}[label="{"]\n`
        resultado += `${nodoPIns}[label="INSTRUCCIONES"]\n`
        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += `${instru[i]}[label="INSTRUCCION"]\n`
        }
        resultado += `${nodoL2}[label="}"]\n`

        resultado += `${nodoP} -> ${nodoT}\n`
        resultado += `${nodoP} -> ${nodoPI}\n`
        resultado += `${nodoPI} -> ${nodoID}\n`
        resultado += `${nodoP} -> ${nodoP1}\n`
        resultado += `${nodoP} -> ${nodoPar}\n`

        for(let i = 0; i < this.parametros.length; i++){
            resultado += `${nodoPar} -> ${paramsT[i]}\n`
            resultado += `${nodoPar} -> ${params[i]}\n`
        }

        resultado += `${nodoP} -> ${nodoP2}\n`

        resultado += `${nodoP} -> ${nodoL1}\n`

        resultado += `${nodoP} -> ${nodoPIns}\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += `${nodoPIns} -> ${instru[i]}\n`
        }

        resultado += `${nodoP} -> ${nodoL2}\n`

        resultado += `${anterior} -> ${nodoP}\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            resultado += this.instrucciones[i].nodo(instru[i])
        }


        return resultado

    }

}