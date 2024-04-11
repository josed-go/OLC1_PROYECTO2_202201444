import { Request, Response } from "express"

class Controller {
    public tabla_simbolos: Array<nodoSym> = []
    public lista_errores: Array<Error_N> = []
    
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
            // let resultado = parser.parse('cout << "Hola";')
            let resultado = parser.parse(req.body.entrada)
            res.json({message: "Hola"})
        } catch (error:any) {
            console.log(error)
        }
    }
}

export const indexController = new Controller()