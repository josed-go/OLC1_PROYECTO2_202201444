import TablaSimbolos from "./tabla.simbolos";

import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";

export default class Arbol {
    private instrucciones: Array<Instruccion>
    private consola: string
    private tablaGlobal: TablaSimbolos
    private errores: Array<Errores>

    constructor(instrucciones: Array<Instruccion>) {
        this.instrucciones = instrucciones
        this.consola = ""
        this.tablaGlobal = new TablaSimbolos()
        this.errores = new Array<Errores>
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

}