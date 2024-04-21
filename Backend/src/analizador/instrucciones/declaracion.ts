import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Cont from "../simbolo/cont";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Declaracion extends Instruccion {
    private id: Array<any>
    private valor: Instruccion

    constructor(tipo: Tipo, linea: number, columna: number, id: Array<any>, valor: Instruccion) {
        super(tipo, linea, columna)
        this.id = id
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        // let pasa = true
        let valorf = this.valor.interpretar(arbol, tabla)
        if(valorf instanceof Errores) return valorf
        
        // REVISAR
        if(this.valor.tipoD.getTipo() == tipoD.INT && this.tipoD.getTipo() == tipoD.DOUBLE){
            this.id.forEach(id => {
                valorf = parseFloat(valorf);
                if (!tabla.setVariable(new Simbolo(this.tipoD, id, valorf))){
                    let error = new Errores("Semantico", "No se puede declarar variable "+id+" porque ya existe", this.linea, this.columna)
                    lista_errores.push(error)
                    arbol.actualizarConsola((<Errores>error).obtenerError())
                    return new Errores("Semantico", "No se puede declarar variable "+id+" porque ya existe", this.linea, this.columna)
                }   
            })
        }else{
            
            if(this.valor.tipoD.getTipo() != this.tipoD.getTipo()) {
                return new Errores("Semantico", "No se pueden declarar variables de diferentes tipos", this.linea, this.columna)
            }
            
            this.id.forEach(id => {
                if(!tabla.setVariable(new Simbolo(this.tipoD, id, valorf))) {
                    let error = new Errores("Semantico", "No se puede declarar variable "+id+" porque ya existe", this.linea, this.columna)
                    lista_errores.push(error)
                    arbol.actualizarConsola((<Errores>error).obtenerError())
                    return new Errores("Semantico", "No se puede declarar variable "+id+" porque ya existe", this.linea, this.columna)
                }
            });
        }

    }

    nodo(anterior: string): string {
        let cont = Cont.getInstancia()

        let resultado = ""

        let nodoD = `n${cont.get()}`
        let nodoT = `n${cont.get()}`
        let nodoID = `n${cont.get()}`

        let ids = []

        for(let i= 0; i < this.id.length; i++){
            ids.push(`n${cont.get()}`);

        }
        let nodoI = `n${cont.get()}`;
        let nodoV = `n${cont.get()}`;
        let nodoPC = `n${cont.get()}`;

        resultado += `${nodoD}[label="DECLARACION"];\n`

        switch (this.tipoD.getTipo()) {
            case tipoD.INT:
                resultado += `${nodoT}[label="int"]\n`

            case tipoD.DOUBLE:
                resultado += `${nodoT}[label="double"]\n`

            case tipoD.CADENA:
                resultado += `${nodoT}[label="std::string"]\n`

            case tipoD.CHAR:
                resultado += `${nodoT}[label="char"]\n`
            case tipoD.BOOL:
                resultado += `${nodoT}[label="bool"]\n`
        }

        resultado += `${nodoID}[label="ID"]\n`

        for(let i= 0; i < this.id.length; i++){
            resultado += `${ids[i]} [label = "${this.id[i]}"];\n`
        }

        resultado += `${nodoI}[label="="];\n`
        resultado += `${nodoV}[label="Expresion"];\n`
        resultado += `${nodoPC}[label=";"];\n`

        resultado += `${anterior} -> ${nodoD};\n`
        resultado += `${nodoD} -> ${nodoID};\n`
        resultado += `${nodoD} -> ${tipoD};\n`
        
        for(let i= 0; i < this.id.length; i++){
            resultado += `${nodoID} -> ${ids[i]};\n`
        }

        resultado += `${nodoD} -> ${nodoI};\n`
        resultado += `${nodoD} -> ${nodoV};\n`
        resultado += `${nodoD} -> ${nodoPC};\n`

        this.valor.nodo(nodoV)

        return resultado
    }
}