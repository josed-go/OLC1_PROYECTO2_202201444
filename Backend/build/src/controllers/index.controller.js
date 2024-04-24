"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = exports.tablaS = exports.dot = exports.lista_errores = void 0;
const arbol_1 = __importDefault(require("../analizador/simbolo/arbol"));
const tabla_simbolos_1 = __importDefault(require("../analizador/simbolo/tabla.simbolos"));
const errores_1 = __importDefault(require("../analizador/errores/errores"));
const metodo_1 = __importDefault(require("../analizador/instrucciones/metodo"));
const declaracion_1 = __importDefault(require("../analizador/instrucciones/declaracion"));
const execute_1 = __importDefault(require("../analizador/instrucciones/execute"));
const asignacion_1 = __importDefault(require("../analizador/instrucciones/asignacion"));
const vectores_ud_1 = __importDefault(require("../analizador/instrucciones/vectores.ud"));
const vector_dd_1 = __importDefault(require("../analizador/instrucciones/vector.dd"));
const creacion_var_1 = __importDefault(require("../analizador/instrucciones/creacion.var"));
// import Metodo from "../analizador/instrucciones/metodo.funciones"
const funcion_1 = __importDefault(require("../analizador/instrucciones/funcion"));
const cont_1 = __importDefault(require("../analizador/simbolo/cont"));
exports.lista_errores = [];
exports.dot = "";
exports.tablaS = new Array;
class Controller {
    analizar(req, res) {
        exports.lista_errores = new Array;
        try {
            let parser = require('../analizador/analizador.js');
            let ast = new arbol_1.default(parser.parse(req.body.entrada));
            let tabla = new tabla_simbolos_1.default();
            tabla.setNombre("Global");
            ast.setTablaGlobal(tabla);
            ast.setConsola("");
            let execute = null;
            let contador = cont_1.default.getInstancia();
            exports.dot = "digraph ast{\n";
            exports.dot += "nINICIO[label=\"INICIO\"];\n";
            exports.dot += "nINSTRUCCIONES[label=\"INSTRUCCIONES\"];\n";
            exports.dot += "nINICIO->nINSTRUCCIONES;\n";
            for (let error of exports.lista_errores) {
                ast.actualizarConsola(error.obtenerError());
            }
            for (let i of ast.getInstrucciones()) {
                if (i instanceof metodo_1.default || i instanceof funcion_1.default) {
                    i.id = i.id.toLocaleLowerCase();
                    ast.addFuncion(i);
                }
            }
            for (let i of ast.getInstrucciones()) {
                if (i instanceof errores_1.default) {
                    exports.lista_errores.push(i);
                    ast.actualizarConsola(i.obtenerError());
                }
                if (i instanceof metodo_1.default || i instanceof funcion_1.default || i instanceof execute_1.default)
                    continue;
                if (i instanceof declaracion_1.default || i instanceof asignacion_1.default || i instanceof vectores_ud_1.default || i instanceof vector_dd_1.default
                    || i instanceof creacion_var_1.default) {
                    let resultado = i.interpretar(ast, tabla);
                    if (resultado instanceof errores_1.default) {
                        exports.lista_errores.push(resultado);
                        ast.actualizarConsola(resultado.obtenerError());
                    }
                }
                else {
                    let error = new errores_1.default("Semantico", "Sentencia fuera de un metodo", i.linea, i.columna);
                    exports.lista_errores.push(error);
                    ast.actualizarConsola(error.obtenerError());
                }
            }
            for (let i of ast.getInstrucciones()) {
                if (i instanceof execute_1.default) {
                    let resultado = i.interpretar(ast, tabla);
                    if (resultado instanceof errores_1.default) {
                        exports.lista_errores.push(resultado);
                        ast.actualizarConsola(resultado.obtenerError());
                    }
                }
                let nodo = `n${contador.get()}`;
                exports.dot += `${nodo}[label=\"INSTRUCCION\"];\n`;
                exports.dot += `nINSTRUCCIONES->${nodo};\n`;
                exports.dot += i.nodo(nodo);
            }
            // PRIMER RECORRIDO
            // for(let i of ast.getInstrucciones()) {
            //     if(i instanceof Metodo) {
            //         i.id = i.id.toLocaleLowerCase()
            //         ast.addFuncion(i)
            //     }
            //     if(i instanceof Declaracion) {
            //         i.interpretar(ast, tabla)
            //         // ERRoRes
            //     }
            //     if(i instanceof Execute) {
            //         execute = i
            //     }
            // }
            // if(execute != null){
            //     execute.interpretar(ast, tabla)
            // }
            // for(let i of ast.getInstrucciones()) {
            //     if(i instanceof Errores){
            //         lista_errores.push(i)
            //         ast.actualizarConsola((<Errores>i).obtenerError())
            //     } 
            //     console.log(i)
            //     var resultado = i.interpretar(ast, tabla)
            //     console.log(resultado)
            //     if(resultado instanceof Errores){
            //         lista_errores.push(resultado)
            //         ast.actualizarConsola((<Errores>resultado).obtenerError())
            //     } 
            // }
            exports.dot += "\n}";
            exports.tablaS.length = 0;
            for (let i = 0; i < ast.getSimbolos().length; i++) {
                exports.tablaS.push(ast.getSimbolos()[i]);
            }
            console.log(tabla);
            res.json({ "respuesta": ast.getConsola(), "lista_errores": exports.lista_errores, "ast": exports.dot, "simbolos": exports.tablaS });
            console.log(exports.lista_errores);
            console.log(ast.getFunciones());
        }
        catch (error) {
            console.log(error);
            res.json({ message: "Ya no sale" });
        }
    }
    getErrores(req, res) {
        console.log(exports.lista_errores);
        // return res.send({
        //     "lista_errores": lista_errores
        // })
        try {
            res.json({ "lista_errores": exports.lista_errores });
        }
        catch (error) {
            console.log(error);
            res.json({ message: "Ya no sale" });
        }
    }
    getAST(req, res) {
        try {
            res.json({ "ast": exports.dot });
        }
        catch (error) {
            console.log(error);
            res.json({ message: "Ya no sale" });
        }
    }
}
exports.indexController = new Controller();
