"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = exports.lista_errores = void 0;
const arbol_1 = __importDefault(require("../analizador/simbolo/arbol"));
const tabla_simbolos_1 = __importDefault(require("../analizador/simbolo/tabla.simbolos"));
const errores_1 = __importDefault(require("../analizador/errores/errores"));
exports.lista_errores = [];
class Controller {
    analizar(req, res) {
        exports.lista_errores = new Array;
        try {
            let parser = require('../analizador/analizador.js');
            let ast = new arbol_1.default(parser.parse(req.body.entrada));
            let tabla = new tabla_simbolos_1.default();
            tabla.setNombre("Tabla simbolos");
            ast.setTablaGlobal(tabla);
            ast.setConsola("");
            for (let error of exports.lista_errores) {
                ast.actualizarConsola(error.obtenerError());
            }
            for (let i of ast.getInstrucciones()) {
                if (i instanceof errores_1.default) {
                    exports.lista_errores.push(i);
                    ast.actualizarConsola(i.obtenerError());
                }
                console.log(i);
                var resultado = i.interpretar(ast, tabla);
                console.log(resultado);
                if (resultado instanceof errores_1.default) {
                    exports.lista_errores.push(resultado);
                    ast.actualizarConsola(resultado.obtenerError());
                }
            }
            console.log(tabla);
            res.json({ "respuesta": ast.getConsola(), "lista_errores": exports.lista_errores });
            console.log(exports.lista_errores);
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
}
exports.indexController = new Controller();
