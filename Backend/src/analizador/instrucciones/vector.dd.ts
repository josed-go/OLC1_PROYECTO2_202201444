import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
import { Reporte } from "../simbolo/reporte";
import Simbolo from "../simbolo/simbolo";
import TablaSimbolos from "../simbolo/tabla.simbolos";
import Tipo, { tipoD } from "../simbolo/tipo";

export default class Vector2D extends Instruccion {
    private tipo1: Tipo
    private tipo2?: Tipo
    private id: string
    private new_?: boolean
    private expresion : Instruccion[] | Instruccion
    private expresion2 : Instruccion[] | Instruccion
    // private lista: Array<Array<Instruccion>>
    private lista: Instruccion[][]

    constructor(linea: number, columna: number, tipo1: Tipo, id: string, expresion: Instruccion[] | Instruccion, expresion2: Instruccion[] | Instruccion, lista: Instruccion[][], tipo2?: Tipo, new_?: boolean) {
        super(tipo1, linea, columna)
        this.tipo1 = tipo1
        this.tipo2 = tipo2
        this.new_ = new_
        this.id = id
        this.expresion = expresion
        this.expresion2 = expresion2
        this.lista = lista
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {

        if(!Array.isArray(this.expresion) && !Array.isArray(this.expresion2)) {
            if(this.tipo1.getTipo() != this.tipo2?.getTipo()) return new Errores("Semantico", "Los tipos son diferentes para la declaracion del vector", this.linea, this.columna)
            let cantidad1 = this.expresion.interpretar(arbol, tabla)
            let cantidad2 = this.expresion2.interpretar(arbol, tabla)

            if(cantidad1 instanceof Errores) return cantidad1
            if(cantidad2 instanceof Errores) return cantidad2

            if(this.expresion.tipoD.getTipo() != tipoD.INT) return new Errores("Semantico", "La variable para el tamaño del vector no es de tipo int", this.linea, this.columna)
            if(this.expresion2.tipoD.getTipo() != tipoD.INT) return new Errores("Semantico", "La variable para el tamaño del vector no es de tipo int", this.linea, this.columna)
            
            cantidad1 = parseInt(cantidad1)
            cantidad2 = parseInt(cantidad2)

            let arreglo = new Array(cantidad1);

            let valor = this.getValorDefault(this.tipo1.getTipo())

            for(let i = 0; i < cantidad1; i++) {
                arreglo[i] = new Array(cantidad2)
            }

            for(let i = 0; i < cantidad1; i++) {
                for(let j = 0; j < cantidad2; j++) {
                    arreglo[i][j] = valor

                }
            }


            if(!tabla.setVariable(new Simbolo(this.tipoD, this.id, arreglo))) {
                return new Errores("Semantico", "No se puede declarar el vector, porque ya existe el ID "+this.id, this.linea, this.columna)
            }else {
                if(!arbol.tablaSimbolos(this.id, arreglo.toString(), this.linea.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                    let simboloN = new Reporte(this.id, arreglo.toString(), this.tipoD.getTipoD(this.tipoD.getTipo()), tabla.getNombre().toString(), this.linea.toString(), this.columna.toString(), "vector 2 dimensiones")
                    arbol.simbolos.push(simboloN)
                }
            }
        }else if(this.lista.length > 0) {
            let arreglo = new Array(this.lista.length)

            for (let i = 0; i < this.lista.length; i++) {

                if(Array.isArray(this.lista[i])) {

                    arreglo[i] = new Array(this.lista[i].length)
                    
                    for (let j = 0; j < this.lista[i].length; j++) {
                        
                        let valor = this.lista[i][j].interpretar(arbol, tabla)
                        if(valor instanceof Errores) return valor
                        if(this.tipo1.getTipo() != this.lista[i][j].tipoD.getTipo()) {
                            return new Errores("Semantico", "Tipo de dato distinto al del vector", this.linea, this.columna)
                        }
                        
                        arreglo[i][j] = valor
                    }
                }else {
                    return new Errores("Semantico", "Debe de ser un vector", this.linea, this.columna)
                }
                
            }

            if(!tabla.setVariable(new Simbolo(this.tipoD, this.id, arreglo))) {
                return new Errores("Semantico", "No se puede declarar el vector, porque ya existe el ID "+this.id, this.linea, this.columna)
            }else {
                if(!arbol.tablaSimbolos(this.id, arreglo.toString(), this.linea.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                    let simboloN = new Reporte(this.id, arreglo.toString(), this.tipoD.getTipoD(this.tipoD.getTipo()), tabla.getNombre().toString(), this.linea.toString(), this.columna.toString(), "vector 2 dimensiones")
                    arbol.simbolos.push(simboloN)
                }
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

    nodo(anterior: string): string {
        return ""
    }

}