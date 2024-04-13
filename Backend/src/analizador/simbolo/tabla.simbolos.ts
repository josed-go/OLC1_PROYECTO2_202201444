import Simbolo from "./simbolo";
import Tipo, {tipoD} from "./tipo";

export default class TablaSimbolos {
    private tablaAnterior : TablaSimbolos | any
    private tablaActual : Map<string, Simbolo>
    private nombre: string
    
    constructor(anterior?: TablaSimbolos) {
        this.tablaAnterior = anterior
        this.tablaActual = new Map<string, Simbolo>()
        this.nombre = ""
    }

    public getTablaAnterior() {
        return this.tablaAnterior
    }

    public setTablaAnterior(anterior: TablaSimbolos) {
        this.tablaAnterior = anterior
    }

    public getTablaActual(): Map<string, Simbolo> {
        return this.tablaActual
    }

    public setTablaActual(actual: Map<string, Simbolo>) {
        this.tablaActual = actual
    }

    public getVariable(id: string) {
        // let buscar: Simbolo = <Simbolo> this.getTablaActual().get(id.toLocaleLowerCase())
        for (let i :TablaSimbolos = this; i != null; i = i.getTablaAnterior()) {
            let buscar: Simbolo = <Simbolo> i.getTablaActual().get(id.toLocaleLowerCase())
            if(buscar != null) return buscar
        }
        
        // return <Simbolo> this.getTablaActual().get(id.toLocaleLowerCase())
        return null
    }

    public setVariable(simbolo: Simbolo) {
        let buscar: Simbolo = <Simbolo> this.getTablaActual().get(simbolo.getId().toLocaleLowerCase())
        if(buscar == null) {
            this.tablaActual.set(simbolo.getId().toLocaleLowerCase(), simbolo)
            return true
        }
        return false
    }

    public getNombre(): string {
        return this.nombre
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre
    }
}