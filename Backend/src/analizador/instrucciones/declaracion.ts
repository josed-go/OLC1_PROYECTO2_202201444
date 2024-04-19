import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
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
}