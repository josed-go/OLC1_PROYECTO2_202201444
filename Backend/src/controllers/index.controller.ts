import { Request, Response } from "express"
import Arbol from "../analizador/simbolo/arbol"
import TablaSimbolos from "../analizador/simbolo/tabla.simbolos"
import Errores from "../analizador/errores/errores"

export let lista_errores: Array<Errores> = []

class Controller {

    public analizar(req: Request, res:Response) {
        lista_errores = new Array<Errores>
        try {
            let parser = require('../analizador/analizador.js')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new TablaSimbolos()
            tabla.setNombre("Tabla simbolos")
            ast.setTablaGlobal(tabla)
            ast.setConsola("")

            for (let error of lista_errores) {
                ast.actualizarConsola((<Errores>error).obtenerError())
            }

            for(let i of ast.getInstrucciones()) {
                if(i instanceof Errores){
                    lista_errores.push(i)
                    ast.actualizarConsola((<Errores>i).obtenerError())
                } 
                console.log(i)
                var resultado = i.interpretar(ast, tabla)
                console.log(resultado)
                if(resultado instanceof Errores){
                    lista_errores.push(resultado)
                    ast.actualizarConsola((<Errores>resultado).obtenerError())
                } 
            }
            console.log(tabla)

            res.json({"respuesta": ast.getConsola(), "lista_errores": lista_errores})
            console.log(lista_errores)
        } catch (error:any) {
            console.log(error)
            res.json({message: "Ya no sale"})
        }
    }

    public getErrores(req: Request, res:Response) {
        console.log(lista_errores)
        // return res.send({
        //     "lista_errores": lista_errores
        // })

        try {
            res.json({ "lista_errores": lista_errores })
        } catch (error) {
            console.log(error)
            res.json({message: "Ya no sale"})
        }
    }
}

export const indexController = new Controller()