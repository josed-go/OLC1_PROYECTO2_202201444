import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";
import Declaracion from "./declaracion";
// import MetodoFunciones from "./metodo.funciones";
import Metodo from "./metodo";

export default class Execute extends Instruccion {

    private id: string
    private params: Instruccion[]

    constructor(id: string, linea:number, columna: number, params: Instruccion[]){
        super(new Tipo(tipoD.VOID), linea, columna)
        this.id = id
        this.params = params
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let busqueda = arbol.getFuncion(this.id)

        if(busqueda == null) return new Errores("Semantico", "La funcion con id: "+this.id+" no existe.", this.linea, this.columna)
        
        if(busqueda instanceof Metodo) {
            // if(busqueda.tipoS == "Funcion") return new Errores("Semantico", "Una funcion no puede ser el metodo main", this.linea, this.columna)
            if(busqueda.parametros.length < this.params.length) new Errores("Semantico", "Se recibieron mas parametros de los que se esperaban", this.linea, this.columna)
            if(busqueda.parametros.length > this.params.length) new Errores("Semantico", "Se recibieron menos parametros de los que se esperaban", this.linea, this.columna)
            let tablaN = new TablaSimbolos(arbol.getTablaGlobal())
            tablaN.setNombre("execute")

            for (let i = 0; i < busqueda.parametros.length; i++) {
                let decla = new Declaracion(busqueda.parametros[i].tipo, this.linea, this.columna, busqueda.parametros[i].id, this.params[i])
                
                let resultado = decla.interpretar(arbol, tablaN)
                if(resultado instanceof Errores) return resultado


                // let variable = tablaN.getVariable(busqueda.parametros[i].id)
                // if(variable != null) {
                //     if(variable.getTipo().getTipo() != this.params[i].tipoD.getTipo()) {
                //         return new Errores("Semantico", "Parametro "+i+" es de diferente tipo al que se esperaba", this.linea, this.columna) 
                //     }else{
                //         variable.setValor(resultado)
                //     }
                // }else {
                //     return new Errores("Semantico", "Varible con ID "+busqueda.parametros[i].id+" no existe", this.linea, this.columna)
                // }
            }

            let resultadoM: any = busqueda.interpretar(arbol, tablaN)
            if(resultadoM instanceof Errores) return resultadoM
        }
    }

}