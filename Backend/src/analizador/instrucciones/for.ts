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

export default class For extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Instruccion[]
    private actualizacion: Instruccion
    private declaracion: Instruccion

    constructor(condicion: Instruccion, instrucciones: Instruccion[], actualizacion: Instruccion, declaracion: Instruccion, linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.condicion = condicion
        this.instrucciones = instrucciones
        this.actualizacion = actualizacion
        this.declaracion = declaracion
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {

        let newTabla = new TablaSimbolos(tabla)
        newTabla.setNombre("For")

        this.declaracion.interpretar(arbol, newTabla)

        let condicion = this.condicion.interpretar(arbol, newTabla)
        if( condicion instanceof Errores) return condicion

        if(this.condicion.tipoD.getTipo() != tipoD.BOOL) return new Errores("Semantico", "La condicion debe ser de tipo bool", this.linea, this.columna)
        
        while(this.condicion.interpretar(arbol, newTabla)) {
            let tablaN = new TablaSimbolos(newTabla)
            tablaN.setNombre("For interno")
            for(let i of this.instrucciones) {

                if(i instanceof Continue) break

                if(i instanceof Break) return

                if(i instanceof Return) return i

                let resultado = i.interpretar(arbol, tablaN)

                // if( resultado instanceof Errores) return resultado
                if( resultado instanceof Errores) {
                    lista_errores.push(resultado)
                    arbol.actualizarConsola((<Errores>resultado).obtenerError())
                }

                if(resultado instanceof Break) return

                if(resultado instanceof Continue) break
                if(resultado instanceof Return) return resultado
                // AGREGAR ERRORES
            }
            let act = this.actualizacion.interpretar(arbol, tablaN)

            if( act instanceof Errores) return act
        }
    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()

        let resultado = ""
        let instruc = []

        let nodoP = `n${cont.get()}`
        let nodoF = `n${cont.get()}`
        let nodoP1 = `n${cont.get()}`
        let nodoD = `n${cont.get()}`
        let nodoC = `n${cont.get()}`
        let nodoI = `n${cont.get()}`
        let nodoP2 = `n${cont.get()}`
        let nodoL1 = `n${cont.get()}`
        let nodoPI = `n${cont.get()}`
        let nodoL2 = `n${cont.get()}`

        for(let i = 0; i < this.instrucciones.length; i++){
            instruc.push(`n${cont.get()}`)
        }

        resultado += `${nodoP}[label="LOOP"]\n`
        resultado += `${nodoF}[label="for"]\n`
        resultado += `${nodoP1}[label="("]\n`
        resultado += `${nodoD}[label="EXPRESION"]\n`
        resultado += `${nodoC}[label="CONDICION"]\n`;
        resultado += `${nodoI}[label="EXPRESION"]\n`
        resultado += `${nodoP2}[label=")"]\n`
        resultado += `${nodoL1}[label="{"]\n`
        resultado += `${nodoPI}[label="INSTRUCCION"]\n`

        for(let i = 0; i < instruc.length; i++){
            resultado += ` ${instruc[i]}[label="INSTRUCCION"]\n`
        }

        resultado += `${nodoL2}[label="}"]\n`

        resultado += `${anterior} -> ${nodoP}\n`
        resultado += `${nodoP} -> ${nodoF}\n`
        resultado += `${nodoP} -> ${nodoP1}\n`
        resultado += `${nodoP} -> ${nodoD}\n`
        resultado += `${nodoP} -> ${nodoC}\n`
        resultado += `${nodoP} -> ${nodoI}\n`
        resultado += `${nodoP} -> ${nodoP2}\n`
        resultado += `${nodoP} -> ${nodoL1}\n`
        resultado += `${nodoP} -> ${nodoPI}\n`

        for(let i = 0; i < instruc.length; i++){
            resultado += `${nodoPI} -> ${instruc[i]}\n`
        }

        resultado += `${nodoD} -> ${nodoL2}\n`

        resultado += this.declaracion.nodo(nodoD)
        resultado += this.condicion.nodo(nodoC)
        resultado += this.actualizacion.nodo(nodoI)

        for(let i = 0; i < instruc.length; i++){
            resultado += this.instrucciones[i].nodo(instruc[i])
        }

        return resultado
    }
}