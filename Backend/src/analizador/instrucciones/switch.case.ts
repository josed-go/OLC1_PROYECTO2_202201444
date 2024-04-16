import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";
import Break from "./break";
import Continue from "./continue";

export default class Case extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Instruccion[]
    public condicionCase?: Instruccion

    constructor(condicion: Instruccion, instrucciones: Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.condicion = condicion
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let condi = this.condicion.interpretar(arbol, tabla)
        if( condi instanceof Errores) return condi
        let condiCase = this.condicionCase?.interpretar(arbol, tabla)
        if( condiCase instanceof Errores) return condiCase

        if(this.condicion.tipoD.getTipo() != this.condicionCase?.tipoD.getTipo()) return new Errores("Semantico", "Condicion es de tipo diferente", this.linea, this.columna)

        if(condi == condiCase) {
            let tablaN = new TablaSimbolos(tabla)
            tablaN.setNombre("Sentencia Case")
    
            for(let i of this.instrucciones) {
    
                if(i instanceof Break) return i 
                if(i instanceof Continue) return i 
    
                let resultado = i.interpretar(arbol, tablaN)
                if( resultado instanceof Errores) return resultado
    
                if(resultado instanceof Break) return resultado
                if(resultado instanceof Continue) return resultado
                // AGREGAR ERRORES
            }
        }

        // if(this.condicion.tipoD.getTipo() != tipoD.BOOL) return new Errores("Semantico", "La condicion debe ser de tipo bool", this.linea, this.columna)
        

        // let tablaN = new TablaSimbolos(tabla)
        // tablaN.setNombre("Sentencia Case")

        // for(let i of this.instrucciones) {

        //     if(i instanceof Break) return
        //     if(i instanceof Continue) break

        //     let resultado = i.interpretar(arbol, tablaN)
        //     if( resultado instanceof Errores) return resultado

        //     if(resultado instanceof Break) return
        //     if(resultado instanceof Continue) break
        //     // AGREGAR ERRORES
        // }
    }

    public getCondicion() {
        
        if( this.condicion instanceof Errores) return this.condicion
        return this.condicion
    }
}