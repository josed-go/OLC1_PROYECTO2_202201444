import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";
import Break from "./break";
import Continue from "./continue";

export default class Default extends Instruccion {
    private instrucciones: Instruccion[]
    private condi : any

    constructor(instrucciones: Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoD.VOID), linea, columna)
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {

        // if(this.condicion.tipoD.getTipo() != tipoD.BOOL) return new Errores("Semantico", "La condicion debe ser de tipo bool", this.linea, this.columna)
        

        let tablaN = new TablaSimbolos(tabla)
        tablaN.setNombre("Sentencia Default")

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
}