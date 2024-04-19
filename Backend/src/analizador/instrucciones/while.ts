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

export default class While extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Instruccion[]

    constructor(condicion: Instruccion, instrucciones: Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.condicion = condicion
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if( condicion instanceof Errores) return condicion

        if(this.condicion.tipoD.getTipo() != tipoD.BOOL) return new Errores("Semantico", "La condicion debe ser de tipo bool", this.linea, this.columna)
        
        while(this.condicion.interpretar(arbol, tabla)) {
            let tablaN = new TablaSimbolos(tabla)
            tablaN.setNombre("Sentencia While")
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
            // for (let i = 0; i < this.instrucciones.length; i++) {
            //     let resultado = this.instrucciones[i].interpretar(arbol, tablaN)
            //     if( resultado instanceof Errores) return resultado

            //     if(resultado instanceof Break) return
            //     if(resultado instanceof Continue) break
                
            // }
        }
    }
}