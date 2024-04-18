import { Instruccion } from "../abstracto/instruccion";
import Errores from "../errores/errores";
import Arbol from "../simbolo/arbol";
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

    constructor(linea: number, columna: number, tipo1: Tipo, id: string, expresion: Instruccion[] | Instruccion, expresion2: Instruccion[] | Instruccion, tipo2?: Tipo, new_?: boolean) {
        super(tipo1, linea, columna)
        this.tipo1 = tipo1
        this.tipo2 = tipo2
        this.new_ = new_
        this.id = id
        this.expresion = expresion
        this.expresion2 = expresion2
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