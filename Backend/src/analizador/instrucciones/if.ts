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

export default class If extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Instruccion[]
    private instrucciones_else : Instruccion[] | undefined
    private condicion_else : Instruccion | undefined

    constructor(condicion: Instruccion, instrucciones: Instruccion[], linea: number, columna: number, condicion_e: Instruccion | undefined, instrucciones_e?: Instruccion[] | undefined) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.condicion = condicion
        this.instrucciones = instrucciones
        this.condicion_else = condicion_e
        this.instrucciones_else = instrucciones_e
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if(condicion instanceof Errores) return condicion

        if(this.condicion.tipoD.getTipo() != tipoD.BOOL ) return new Errores("Semantico", "La condicion debe ser de tipo bool", this.linea, this.columna)

            
        if(condicion) {
            let tablaN = new TablaSimbolos(tabla)
            tablaN.setNombre("Sentencia if")

            for(let i of this.instrucciones) {
                if(i instanceof Break) return i;
                if(i instanceof Continue) return i;
                // if(i instanceof Return) return i
                let resultado = i.interpretar(arbol, tablaN)
                if( resultado instanceof Errores) {
                    lista_errores.push(resultado)
                    arbol.actualizarConsola((<Errores>resultado).obtenerError())
                }
                if(resultado instanceof Break) return resultado;
                if(resultado instanceof Continue) return resultado;
                if(resultado instanceof Return) return resultado;

            }
        }else {
            if(this.instrucciones_else != undefined) {
                let tablaN = new TablaSimbolos(tabla)
                tablaN.setNombre("Sentencia else")
                
                for(let i of this.instrucciones_else) {
                    if(i instanceof Break) return i;
                    if(i instanceof Continue) return i;
                    // if(i instanceof Return) return i;
                    let resultado = i.interpretar(arbol, tablaN)
                    // if( resultado instanceof Errores) return resultado
                    if( resultado instanceof Errores) {
                        lista_errores.push(resultado)
                        arbol.actualizarConsola((<Errores>resultado).obtenerError())
                    }
                    if(resultado instanceof Break) return resultado;
                    if(resultado instanceof Continue) return resultado;
                    if(resultado instanceof Return) return resultado;
                    // if(resultado instanceof Continue) return resultado
                }
            }else if(this.condicion_else != undefined) {
                let a = this.condicion_else.interpretar(arbol, tabla)
                if( a instanceof Errores) return a
                if(a instanceof Break) return a;
                if(a instanceof Continue) return a;
                if(a instanceof Return) return a;
            }
        }
    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()

        let resultado = ""

        let nodoI = `n${cont.get()}`
        let nodoP1 = `n${cont.get()}`
        let nodoC = `n${cont.get()}`
        let nodoP2 = `n${cont.get()}`
        let nodoLL1 = `n${cont.get()}`
        let nodoPIF = `n${cont.get()}`
        let nodoLL2 = `n${cont.get()}`

        let nodoI1 = []
        let nodoI2 = []
        let nodoI3 = ""
        let nodoL1 = ""
        let nodoPIE = ""
        let nodoEl = ""
        let nodoL2 = ""
        let nodoElF = ""

        for(let i = 0; i < this.instrucciones.length; i++){
            nodoI1.push(`n${cont.get()}`)
        }

        if(this.instrucciones_else != undefined){
            nodoEl = `n${cont.get()}`
            nodoL1 = `n${cont.get()}`
            nodoPIE = `n${cont.get()}`
            for(let i = 0; i < this.instrucciones_else.length; i++){
                nodoI2.push(`n${cont.get()}`)
            }
            nodoL2 = `n${cont.get()}`

            resultado += `${nodoEl}[label="Else"]\n`
            resultado += `${nodoL1}[label="{"]\n`
            resultado += `${nodoPIE}[label="INSTRUCCIONES"]\n`

            for(let i = 0; i < nodoI2.length; i++){
                resultado += `${nodoI2[i]}[label="INSTRUCCION"]\n`
            }

            resultado += `${nodoL2}[label="}"]\n`

            resultado += `${anterior} -> ${nodoEl}\n`
            resultado += `${anterior} -> ${nodoL1}\n`
            resultado += `${anterior} -> ${nodoPIE}\n`

            for(let i = 0; i < nodoI2.length; i++){
                resultado += `${nodoPIE} -> ${nodoI2[i]}\n`
            }

            resultado += `${anterior} -> ${nodoL2}\n`

            for(let i = 0; i < nodoI2.length; i++){
                resultado += this.instrucciones_else[i].nodo(nodoI2[i])
            }
        }

        if(this.condicion_else != undefined){
            nodoI3 = `n${cont.get()}`
            nodoElF = `n${cont.get()}`

            resultado += `${nodoI3}[label="else If"]\n`
            resultado += `${anterior} -> ${nodoI3}\n`
            resultado += this.condicion_else.nodo(nodoI3)
        }

        resultado += `${nodoI}[label="If"]\n`
        resultado += `${nodoP1}[label="("]\n`
        resultado += `${nodoC}[label="EXPRESION"]\n`
        resultado += `${nodoP2}[label=")"]\n`
        resultado += `${nodoLL1}[label="{"]\n`
        resultado += `${nodoPIF}[label="INSTRUCCIONES"]\n`

        for(let i = 0; i < nodoI1.length; i++){
            resultado += `${nodoI1[i]}[label="INSTRUCCION"]\n`
        }

        resultado += `${nodoLL2}[label="}"]\n`

        // if(this.instrucciones_else != undefined){

            

        // }

        // if(this.condicion_else != undefined){
        
        // }

        resultado += `${anterior} -> ${nodoI}\n`
        resultado += `${anterior} -> ${nodoP1}\n`
        resultado += `${anterior} -> ${nodoC}\n`
        resultado += `${anterior} -> ${nodoP2}\n`
        resultado += `${anterior} -> ${nodoLL1}\n`
        resultado += `${anterior} -> ${nodoPIF}\n`

        for(let i = 0; i < nodoI1.length; i++){
            resultado += `${nodoPIF} -> ${nodoI1[i]}\n`
        }

        // if(this.instrucciones_else != undefined){
            
        // }

        // if(this.condicion_else != undefined){
            
        // }

        resultado += `${anterior} -> ${nodoLL2}\n`

        resultado += this.condicion.nodo(nodoC)

        for(let i = 0; i < nodoI1.length; i++){
            resultado += this.instrucciones[i].nodo(nodoI1[i])
        }

        // if(this.instrucciones_else != undefined){
            
        // }

        // if(this.condicion_else != undefined){
            
        // }

        return resultado
    }
}