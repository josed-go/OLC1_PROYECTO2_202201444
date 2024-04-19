import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Creacion extends Instruccion {
    private id: Array<any>
    private valor: any

    constructor(tipo: Tipo, linea: number, columna: number, id: Array<any>) {
        super(tipo, linea, columna)
        this.id = id
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let valor: any;
        // if(this.valor.tipoD.getTipo() != this.tipoD.getTipo()) {
        //     return new Errores("Semantico", "No se puede declarar variable", this.linea, this.columna)
        // }

        this.id.forEach(id => {

            switch (this.tipoD.getTipo()) {
                case tipoD.INT:
                    valor = 0
                    break;

                case tipoD.DOUBLE:
                    valor = 0.0
                    break;

                case tipoD.BOOL:
                    valor = true
                    break;

                case tipoD.CHAR:
                    valor = '\u0000'
                    break;

                case tipoD.CADENA:
                    valor = ""
                    break;
            
                default:
                    return new Errores("Semantico", "No se existe ese tipo de dato", this.linea, this.columna)
            }

            if(!tabla.setVariable(new Simbolo(this.tipoD, id, valor))) {
                return new Errores("Semantico", "No se puede declarar variable que ya existe", this.linea, this.columna)
            }
        });

    }
}