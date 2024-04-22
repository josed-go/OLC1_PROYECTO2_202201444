import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
import { Reporte } from "../simbolo/reporte";
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
            }else{
                if(!arbol.tablaSimbolos(id, valor, this.linea.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                    let simboloN = new Reporte(id, valor, this.tipoD.getTipoD(this.tipoD.getTipo()), tabla.getNombre().toString(), this.linea.toString(), this.columna.toString(), "variable")
                    arbol.simbolos.push(simboloN)
                }
            }
        });

    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()
        let resultado = ""

        let nodoD = `n${cont.get()}`
        let nodoID = `n${cont.get()}`
        let nodoPC = `n${cont.get()}`

        let ids = []

        for (let i = 0; i < this.id.length; i++) {
            ids.push(`n${cont.get()}`)   
        }

        resultado += `${nodoD}[label="DECLARACION"]\n`
        resultado += `${nodoID}[label="ID"]\n`

        for (let i = 0; i < this.id.length; i++) {
            resultado += `${ids[i]}[label="${this.id[i]}"]\n`
            
        }

        resultado += `${nodoPC}[label=";"];\n`;

        resultado += `${anterior} -> ${nodoD};\n`;
        resultado += `${nodoD} -> ${nodoID};\n`;

        for(let i= 0; i < this.id.length; i++){
            resultado += `${nodoID} -> ${ids[i]};\n`;
        }

        resultado += `${nodoD} -> ${nodoPC};\n`;

        return resultado;


    }
}