import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";
import Break from "./break";
import Continue from "./continue";
import Case from "./switch.case";
import Default from "./switch.default";

export default class Switch extends Instruccion {
    private condicion: Instruccion
    private casos: Case[] | undefined
    private default_: Instruccion | undefined

    constructor(condicion: Instruccion, linea: number, columna: number, casos: Case[], defecto: Instruccion) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.condicion = condicion
        this.casos = casos
        this.default_ = defecto
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let condi = this.condicion.interpretar(arbol, tabla)

        if(condi instanceof Errores) return condi

        // let tablaN = new TablaSimbolos(tabla)
        // tablaN.setNombre("Sentencia Switch")

        if(this.casos != undefined) {
            for(let caso of this.casos) {
                caso.condicionCase = this.condicion
                let resultado = caso.interpretar(arbol, tabla)
                // if(caso instanceof Case) {
                    
                    // if(resultado instanceof Errores) return resultado
                    if( resultado instanceof Errores) {
                        lista_errores.push(resultado)
                        arbol.actualizarConsola((<Errores>resultado).obtenerError())
                    }

                    if(resultado instanceof Break) return
                    
                    if(resultado instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.columna)
                            // console.log(resultado.getCondicion(), "|", condi)
                // if(caso.getCondicion().interpretar(arbol, tabla) == condi) {
                //     let i = resultado.interpretar(arbol, tabla)
                    // if(resultado instanceof Errores) return resultado
                //     }
                // }
            }
        }

        if(this.default_ != undefined) {
            let defecto = this.default_.interpretar(arbol, tabla)
            if(defecto instanceof Break) return
            if(defecto instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.columna)
            if( defecto instanceof Errores) return defecto
        }

        // for(let i of this.casos) {
            
        //     let resultado = i
        //     if(i instanceof Case) {
                
        //         // console.log(resultado.getCondicion(), "|", condi)
        //         if(i.getCondicion().interpretar(arbol, tablaN) == condi) {
        //             let caso = resultado.interpretar(arbol, tablaN)
        //             if(caso instanceof Break) return caso;
        //             if(caso instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.columna)
        //             if( caso instanceof Errores) return caso
        //         }
        //     }else if(i instanceof Default) {
        //         let default_ = resultado.interpretar(arbol, tablaN)
        //         if(default_ instanceof Break) return default_;
        //         if(default_ instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.columna)
        //         if( default_ instanceof Errores) return default_
        //     }
        // }

    }
}