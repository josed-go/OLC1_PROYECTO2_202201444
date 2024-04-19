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
                // if(i instanceof Break) return i;
                // if(i instanceof Continue) return i;
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
                    // if(i instanceof Break) return i;
                    // if(i instanceof Continue) return i;
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
}