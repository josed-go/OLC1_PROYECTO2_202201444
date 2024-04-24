import TablaSimbolos from "./tabla.simbolos";

import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Metodo from "../instrucciones/metodo";
// import MetodoFunciones from "../instrucciones/metodo.funciones";
import Funcion from "../instrucciones/funcion";
import { Reporte } from "./reporte";
import Tipo, { tipoD } from "./tipo";

export default class Arbol {
    private instrucciones: Array<Instruccion>
    private consola: string
    private tablaGlobal: TablaSimbolos
    private errores: Array<Errores>
    private funciones: Array<Instruccion>
    public simbolos: Array<Reporte>

    constructor(instrucciones: Array<Instruccion>) {
        this.instrucciones = instrucciones
        this.consola = ""
        this.tablaGlobal = new TablaSimbolos()
        this.errores = new Array<Errores>
        this.funciones = new Array<Instruccion>
        this.simbolos = new Array<Reporte>
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
                if(i.id.toLocaleLowerCase() == id.toLocaleLowerCase()) {
                    if(!this.tablaSimbolos(i.id.toString(), '', i.linea.toString(), '', i.columna.toString())){
                        let simboloN = new Reporte(i.id, '', "void", '', i.linea.toString(), i.columna.toString(), "Metodo")
                        this.simbolos.push(simboloN)
                    }
                    return i
                }
            }
            else if(i instanceof Funcion) {
                // const tipoo = new Tipo(tipoD.VOID)
                if(i.id.toLocaleLowerCase() == id.toLocaleLowerCase()) {
                    if(!this.tablaSimbolos(i.id.toString(), '', i.linea.toString(), '', i.columna.toString())){
                        let simboloN = new Reporte(i.id, '', i.tipoD.getTipoD(i.tipoD.getTipo()), '', i.linea.toString(), i.columna.toString(), "Funcion")
                        this.simbolos.push(simboloN)
                    }
                    return i
                }
            }
        }
        return null
    }

    public tablaSimbolos(id: string, valor: string, linea: string, entorno: string, columna: string) : boolean{
        for(let ele of this.simbolos){
            if(ele.getId().toString() == id.toLocaleLowerCase() && ele.getEntorno().toString() == entorno.toString()){

                ele.setValor(valor)
                ele.setLinea(linea)
                ele.setValor(columna)
                return true
            }
        }

        return false
    }

    public getTipoS(id:string): string{
        for(let ele of this.simbolos){
            if(ele.getId().toString() == id.toLocaleLowerCase()){
                return ele.getTipoS().toString()
            }
        }
        return "none"
    }

    public getSimbolos(): Array<Reporte> {
        return this.simbolos
    }

}