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
    // public tabla_simbolos: Array<nodoSym> = []
    prueba(req, res) {
        res.json({ message: "HEllo WOLRD" });
    }
    probarPost(req, res) {
        console.log(req.body);
        res.json({ message: "metdo post" });
    }
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
            res.json({ "respuesta": ast.getConsola() });
            console.log(exports.lista_errores);
        }
        catch (error) {
            console.log(error);
            res.json({ message: "Ya no sale" });
        }
    }
}
exports.indexController = new Controller();
