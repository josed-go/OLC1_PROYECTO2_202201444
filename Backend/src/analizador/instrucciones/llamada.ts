import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import AccesoVar from "../expresiones/acceso.var";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";
import Declaracion from "./declaracion";
import Funcion from "./funcion";
// import MetodoFunciones from "./metodo.funciones";
import Metodo from "./metodo";
import Vector2D from "./vector.dd";
import Vector1D from "./vectores.ud";

export default class Llamada extends Instruccion {
    private id: string
    private params: Instruccion[]

    constructor(id: string, linea:number, columna: number, params: Instruccion[]){
        super(new Tipo(tipoD.VOID), linea,columna)
        this.id = id
        this.params = params
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let busqueda = arbol.getFuncion(this.id)

        if(busqueda == null) return new Errores("Semantico", "La funcion con id: "+this.id+" no existe.", this.linea, this.columna)

        this.tipoD = busqueda.tipoD

        if(busqueda instanceof Metodo) {
            // if(busqueda.tipoS == "Metodo") {
            let metodo = <Metodo>busqueda
            let tablaN = new TablaSimbolos(tabla)
            tablaN.setNombre("Llamada metodo: "+this.id)

            if(metodo.parametros.length < this.params.length) new Errores("Semantico", "Se recibieron mas parametros de los que se esperaban", this.linea, this.columna)
            if(metodo.parametros.length > this.params.length) new Errores("Semantico", "Se recibieron menos parametros de los que se esperaban", this.linea, this.columna)
                
            for (let i = 0; i < metodo.parametros.length; i++) {
                let decla
                if(metodo.parametros[i].accion == 2) {
                    decla = new Vector1D(this.linea, this.columna, metodo.parametros[i].tipo, metodo.parametros[i].id[0], this.params[i], false, undefined, false)
                // }else if (metodo.parametros[i].vdd && Array.isArray(this.params[i])){
                //     decla = new Vector2D(metodo.linea, metodo.columna, metodo.parametros[i].tipoD, metodo.parametros[i].id[0], [], [], this.params[i] ,null, false )
                }else{
                    decla = new Declaracion(metodo.parametros[i].tipo, this.linea, this.columna, metodo.parametros[i].id, this.params[i])
                }
                
                let resultado = decla.interpretar(arbol, tablaN)
                if(resultado instanceof Errores) return resultado

                // let variable = tablaN.getVariable(busqueda.parametros[i].id[0])
                // if(variable != null) {
                //     if(variable.getTipo().getTipo() != this.params[i].tipoD.getTipo()) {
                //         return new Errores("Semantico", "Parametro "+i+" es de diferente tipo al que se esperaba", this.linea, this.columna) 
                //     }else{
                //         variable.setValor(resultado)
                //     }
                // }else {
                //     return new Errores("Semantico", "Varible con ID "+busqueda.parametros[i].id[0]+" no existe", this.linea, this.columna)
                // }
                
            }
            // INTERPRETAMOS LA FUNCION A LLAMAR
            let resultadoM: any = metodo.interpretar(arbol, tablaN)
            if(resultadoM instanceof Errores) return resultadoM

        }else if(busqueda instanceof Funcion) {
            let funcion = <Funcion>busqueda
            let tablaN = new TablaSimbolos(tabla)
            tablaN.setNombre("Llamada funcion: "+this.id)

            if(funcion.parametros.length < this.params.length) new Errores("Semantico", "Se recibieron mas parametros de los que se esperaban", this.linea, this.columna)
            if(funcion.parametros.length > this.params.length) new Errores("Semantico", "Se recibieron menos parametros de los que se esperaban", this.linea, this.columna)
                
            for (let i = 0; i < funcion.parametros.length; i++) {
                let varN = this.params[i].interpretar(arbol, tabla)
                if(varN instanceof Errores) return varN
                let decla

                if(funcion.parametros[i].accion == 2) {
                    decla = new Vector1D(this.linea, this.columna, funcion.parametros[i].tipo, funcion.parametros[i].id[0], this.params[i], false, undefined, false)
                // }else if (metodo.parametros[i].vdd && Array.isArray(this.params[i])){
                //     decla = new Vector2D(metodo.linea, metodo.columna, metodo.parametros[i].tipoD, metodo.parametros[i].id[0], [], [], this.params[i] ,null, false )
                }else{
                    decla = new Declaracion(funcion.parametros[i].tipo, this.linea, this.columna, funcion.parametros[i].id, this.params[i])
                }
                //let decla = new Declaracion(funcion.parametros[i].tipo, this.linea, this.columna, funcion.parametros[i].id, this.params[i])

                let resultado = decla.interpretar(arbol, tablaN)
                if(resultado instanceof Errores) return resultado


                let variable = tablaN.getVariable(funcion.parametros[i].id[0])

                if(variable != null) {
                    if(variable.getTipo().getTipo() != this.params[i].tipoD.getTipo()) {
                        return new Errores("Semantico", "Parametro "+i+" es de diferente tipo al que se esperaba", this.linea, this.columna) 
                    }else{
                        variable.setValor(varN)
                    }
                }else {
                    return new Errores("Semantico", "Varible con ID "+funcion.parametros[i].id[0]+" no existe", this.linea, this.columna)
                }
                
            }
            // this.tipoD.setTipo(funcion.tipoD.getTipo())
            let resultadoF: any = funcion.interpretar(arbol, tablaN)
            if(resultadoF instanceof Errores) return resultadoF
            return resultadoF
        }
        // }
    }

    nodo(anterior: string): string {
        return ""
    }
}