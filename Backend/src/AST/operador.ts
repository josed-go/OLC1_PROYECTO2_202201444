import { indexController } from "../controllers/index.controller"

class Operador {
    constructor() {

    }

    ejecutar(raiz:any) {
        let resultado1 = null
        let resultado2 = null
        let resultado3 = null

        switch(raiz.tag) {
            case "expresion":
                if(raiz.hijos.length == 3) {
                    resultado1 = this.ejecutar(raiz.hijos[0])
                    resultado2 = this.ejecutar(raiz.hijos[2])
                    let ope = raiz.hijos[1].value

                    switch(ope) {
                        case "+":

                    }

                }else if(raiz.hijos.length == 2) {

                }else {

                }
        }
    }

    aritmetico(r1: any, r2: any, fila:any, columna: any, op:any) {
        let tipo1 = r1.tipo
        let tipo2 = r2.tipo
        let res = new Resultado("", "")
        if(tipo1 == 'error' || tipo2 == 'error') {
            res.tipo = 'error'
            return res
        }

        switch (op) {
            case '+':
                switch (tipo1.toLowerCase()) {
                    case 'int':
                        switch (tipo2.toLowerCase()) {
                            case 'int':
                                res.tipo = 'int'
                                res.valor = r1.valor + r2.valor
                                break;
                            case 'double':
                                res.tipo = 'double'
                                res.valor = r1.valor + r2.valor
                                break;
                            case 'bool':
                                var i = r2.valor ? 1 : 0;
                                res.tipo = 'int'
                                res.valor = r1.valor + i
                                break;
                            case 'string':
                                res.tipo = 'string'
                                res.valor = r1.valor + r2.valor
                                break;
                            case 'char':
                                res.tipo = 'int'
                                res.valor = r1.valor + r2.valor.charCodeAt(0)
                                break
                            default:
                                indexController.lista_errores.push(new Error_N('Semantico', 'No se puede hacer ese tipo de operacion', fila, columna))
                                res.tipo="error";
                                res.valor="error";
                                return res;
                        }
                        break;
                
                    default:
                        break;
                }
                break;
        
            default:
                break;
        }
    }
}