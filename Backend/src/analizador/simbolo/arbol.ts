import TablaSimbolos from "./tabla.simbolos";

import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Metodo from "../instrucciones/metodo";
// import MetodoFunciones from "../instrucciones/metodo.funciones";
import Funcion from "../instrucciones/funcion";

export default class Arbol {
    private instrucciones: Array<Instruccion>
    private consola: string
    private tablaGlobal: TablaSimbolos
    private errores: Array<Errores>
    private funciones: Array<Instruccion>

    constructor(instrucciones: Array<Instruccion>) {
        this.instrucciones = instrucciones
        this.consola = ""
        this.tablaGlobal = new TablaSimbolos()
        this.errores = new Array<Errores>
        this.funciones = new Array<Instruccion>
    }

    public getConsola(): string {
        return this.consola
    }

    public setConsola(consola: string): void {
        this.consola = consola
    }

    public getInstrucciones(): Array<Instruccion> {
        return this.instrucciones
    }

    public setInstrucciones(instrucciones: Array<Instruccion>): void {
        this.instrucciones = instrucciones
    }

    public getTablaGlobal(): TablaSimbolos {
        return this.tablaGlobal
    }

    public setTablaGlobal(tabla: TablaSimbolos) {
        this.tablaGlobal = tabla
    }

    public getErrores(): any {
        return this.errores
    }

    public Cout(contenido: any) {
        this.consola = `${this.consola}${contenido}`
    }
    
    public actualizarConsola(contenido: any){
        this.consola = `${this.consola}\n${contenido}\n`

    }

    public getFunciones() {
        return this.funciones
    }

    public setFunciones(funciones: Array<Instruccion>) {
        this.funciones = funciones
    }

    public addFuncion(funcion: Instruccion) {
        this.funciones.push(funcion)
    }

    public getFuncion(id: string) {
        for(let i of this.instrucciones) {
            if(i instanceof Metodo) {
                if(i.id.toLocaleLowerCase() == id.toLocaleLowerCase()) return i
            }
            else if(i instanceof Funcion) {
                if(i.id.toLocaleLowerCase() == id.toLocaleLowerCase()) return i
            }
        }
        return null
    }

}