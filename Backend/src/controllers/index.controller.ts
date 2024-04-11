import { Request, Response } from "express"
import Arbol from "../analizador/simbolo/arbol"
import TablaSimbolos from "../analizador/simbolo/tabla.simbolos"

class Controller {
    // public tabla_simbolos: Array<nodoSym> = []
    // public lista_errores: Array<Error_N> = []
    
    public prueba (req: Request, res:Response) {
        res.json({message: "HEllo WOLRD"})
    }
    
    public probarPost (req: Request, res: Response) {
        console.log(req.body)
        res.json({message: "metdo post"})
    }

    public analizar(req: Request, res:Response) {
        try {
            let parser = require('../analizador/analizador.js')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new TablaSimbolos()
            tabla.setNombre("Tabla simbolos")
            ast.setTablaGlobal(tabla)
            ast.setConsola("")
            
            for(let i of ast.getInstrucciones()) {
                console.log(i)
                var resultado = i.interpretar(ast, tabla)
            }
            console.log(tabla)
            // let resultado = parser.parse('cout << "Hola";')
            // let resultado = parser.parse(req.body.entrada)
            res.json({message: ast.getConsola()})
        } catch (error:any) {
            console.log(error)
            res.json({message: "Ya no sale"})
        }
    }
}

export const indexController = new Controller()