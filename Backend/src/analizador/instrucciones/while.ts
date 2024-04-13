import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";
import Break from "./break";

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

                if(i instanceof Break) return

                let resultado = i.interpretar(arbol, tablaN)

                if(resultado instanceof Break) return
                // AGREGAR ERRORES
            }
        }
    }
}