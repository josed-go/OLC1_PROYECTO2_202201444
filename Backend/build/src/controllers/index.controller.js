"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = void 0;
const arbol_1 = __importDefault(require("../analizador/simbolo/arbol"));
const tabla_simbolos_1 = __importDefault(require("../analizador/simbolo/tabla.simbolos"));
class Controller {
    // public tabla_simbolos: Array<nodoSym> = []
    // public lista_errores: Array<Error_N> = []
    prueba(req, res) {
        res.json({ message: "HEllo WOLRD" });
    }
    probarPost(req, res) {
        console.log(req.body);
        res.json({ message: "metdo post" });
    }
    analizar(req, res) {
        try {
            let parser = require('../analizador/analizador.js');
            let ast = new arbol_1.default(parser.parse(req.body.entrada));
            let tabla = new tabla_simbolos_1.default();
            tabla.setNombre("Tabla simbolos");
            ast.setTablaGlobal(tabla);
            ast.setConsola("");
            for (let i of ast.getInstrucciones()) {
                console.log(i);
                var resultado = i.interpretar(ast, tabla);
            }
            console.log(tabla);
            // let resultado = parser.parse('cout << "Hola";')
            // let resultado = parser.parse(req.body.entrada)
            res.json({ message: ast.getConsola() });
        }
        catch (error) {
            console.log(error);
            res.json({ message: "Ya no sale" });
        }
    }
}
exports.indexController = new Controller();
