import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Vector1D extends Instruccion {
    private tipo1: Tipo
    private tipo2?: Tipo
    private id: string
    private new_?: boolean
    private expresion : Instruccion[] | Instruccion

    constructor(linea: number, columna: number, tipo1: Tipo, id: string, expresion: Instruccion[] | Instruccion, tipo2?: Tipo, new_?: boolean) {
        super(tipo1, linea, columna)
        this.tipo1 = tipo1
        this.tipo2 = tipo2
        this.new_ = new_
        this.id = id
        this.expresion = expresion
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        
        
        if(!Array.isArray(this.expresion)) {
            if(this.new_ == true) {
                console.log("Entre2")

                if(this.tipo1.getTipo() != this.tipo2?.getTipo()) return new Errores("Semantico", "Los tipos son diferentes para la declaracion del vector", this.linea, this.columna)
                let cantidad = this.expresion.interpretar(arbol, tabla)
    
                if(cantidad instanceof Errores) return cantidad
    
                if(this.expresion.tipoD.getTipo() != tipoD.INT) return new Errores("Semantico", "La variable para el tamaño del vector no es de tipo int", this.linea, this.columna)
                cantidad = parseInt(cantidad)
    
                let arreglo: any = [];
    
                let valor = this.getValorDefault(this.tipo1.getTipo())
    
                for(let i = 0; i < cantidad; i++) {
                    arreglo[i] = valor
                }
    
                if(!tabla.setVariable(new Simbolo(this.tipoD, this.id, arreglo))) {
                    // let error = new Errores("Semantico", "No se puede declarar variable "+id+" porque ya existe", this.linea, this.columna)
                    // lista_errores.push(error)
                    // arbol.actualizarConsola((<Errores>error).obtenerError())
                    return new Errores("Semantico", "No se puede declarar el vector, porque ya existe el ID "+this.id, this.linea, this.columna)
                }
            }else {
                if(this.tipo1.getTipo() != tipoD.CHAR) return new Errores("Semantico", "El arreglo debe de ser de tipo char", this.linea, this.columna)
                let valores = this.expresion.interpretar(arbol, tabla)
    
                if(valores instanceof Errores) return valores
    
                if(!tabla.setVariable(new Simbolo(this.tipoD, this.id, valores))) {
                    // let error = new Errores("Semantico", "No se puede declarar variable "+id+" porque ya existe", this.linea, this.columna)
                    // lista_errores.push(error)
                    // arbol.actualizarConsola((<Errores>error).obtenerError())
                    return new Errores("Semantico", "No se puede declarar el vector, porque ya existe el ID "+this.id, this.linea, this.columna)
                }
            }
        }else {
            let arreglo: any = []
            // for (let i = 0; i < this.expresion.length; i++) {
            //     let dato = this.expresion[i].interpretar
                
            // }
            for(let i = 0; i < this.expresion.length; i++) {
                let dato = this.expresion[i].interpretar(arbol, tabla)

                if(dato instanceof Errores) return dato

                if(this.tipo1.getTipo() != this.expresion[i].tipoD.getTipo()) {
                    return new Errores("Semantico", "Tipo de dato distinto al del vector", this.linea, this.columna)
                }
                arreglo[i] = dato

            }
            if(!tabla.setVariable(new Simbolo(this.tipoD, this.id, arreglo))) {
                // let error = new Errores("Semantico", "No se puede declarar variable "+id+" porque ya existe", this.linea, this.columna)
                // lista_errores.push(error)
                // arbol.actualizarConsola((<Errores>error).obtenerError())
                return new Errores("Semantico", "No se puede declarar el vector, porque ya existe el ID "+this.id, this.linea, this.columna)
            }
        }
    }

    public getValorDefault(tipo: tipoD){
        switch (tipo) {
            case tipoD.INT:
                return 0      

            case tipoD.DOUBLE:
                return 0.0

            case tipoD.BOOL:
                return true

            case tipoD.CHAR:
                return '0'
            case tipoD.CADENA:
                return ""
        
            default:
                return new Errores("Semantico", "No se existe ese tipo de dato", this.linea, this.columna)
        }
    }

}