import { Request, Response } from "express"
import Arbol from "../analizador/simbolo/arbol"
import TablaSimbolos from "../analizador/simbolo/tabla.simbolos"
import Errores from "../analizador/errores/errores"
import Metodo from "../analizador/instrucciones/metodo"
import Declaracion from "../analizador/instrucciones/declaracion"
import Execute from "../analizador/instrucciones/execute"
import Asignacion from "../analizador/instrucciones/asignacion"
import Vector1D from "../analizador/instrucciones/vectores.ud"
import Vector2D from "../analizador/instrucciones/vector.dd"
import Creacion from "../analizador/instrucciones/creacion.var"
import ModificarVector1D from "../analizador/instrucciones/modificar.vectorud"
import ModificarVector2D from "../analizador/instrucciones/modificar.vectordd"
// import Metodo from "../analizador/instrucciones/metodo.funciones"
import Funcion from "../analizador/instrucciones/funcion"
import Cont from "../analizador/simbolo/cont"
import { Reporte } from "../analizador/simbolo/reporte"

export let lista_errores: Array<Errores> = []
export let dot: string = ""
export let tablaS: Array<Reporte>
tablaS = new Array<Reporte>

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
            let execute = null

            let contador = Cont.getInstancia()

            dot = "digraph ast{\n"
            dot += "nINICIO[label=\"INICIO\"];\n"
            dot += "nINSTRUCCIONES[label=\"INSTRUCCIONES\"];\n"
            dot += "nINICIO->nINSTRUCCIONES;\n"

            for (let error of lista_errores) {
                ast.actualizarConsola((<Errores>error).obtenerError())
            }

            for(let i of ast.getInstrucciones()) {
                if(i instanceof Metodo || i instanceof Funcion) {
                    i.id = i.id.toLocaleLowerCase()
                    ast.addFuncion(i)
                }
            }

            for(let i of ast.getInstrucciones()) {

                if(i instanceof Errores){
                    lista_errores.push(i)
                    ast.actualizarConsola((<Errores>i).obtenerError())
                } 
                if(i instanceof Metodo || i instanceof Funcion || i instanceof Execute) continue

                if(i instanceof Declaracion || i instanceof Asignacion || i instanceof Vector1D || i instanceof Vector2D
                    || i instanceof Creacion
                ) {
                    let resultado = i.interpretar(ast, tabla)
                    if(resultado instanceof Errores){
                        lista_errores.push(resultado)
                        ast.actualizarConsola((<Errores>resultado).obtenerError())
                    } 
                }else {
                    let error = new Errores("Semantico", "Sentencia fuera de un metodo", i.linea, i.columna)
                    lista_errores.push(error)
                    ast.actualizarConsola((<Errores>error).obtenerError())
                }
            }

            for(let i of ast.getInstrucciones()) {
                if(i instanceof Execute) {
                    let resultado = i.interpretar(ast, tabla)
                    if(resultado instanceof Errores) {
                        lista_errores.push(resultado)
                        ast.actualizarConsola((<Errores>resultado).obtenerError())
                    }
                }

                let nodo = `n${contador.get()}`
                dot += `${nodo}[label=\"INSTRUCCION\"];\n`
                dot += `nINSTRUCCIONES->${nodo};\n`
                dot += i.nodo(nodo)
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

            dot += "\n}"

            tablaS.length = 0

            for (let i = 0; i < ast.getSimbolos().length; i++) {
                tablaS.push(ast.getSimbolos()[i])
                
            }

            console.log(tabla)

            res.json({"respuesta": ast.getConsola(), "lista_errores": lista_errores, "ast": dot, "simbolos": tablaS})
            console.log(lista_errores)
            console.log(ast.getFunciones())
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

    public getAST(req: Request, res:Response) {

        try {
            res.json({ "ast": dot })
        } catch (error) {
            console.log(error)
            res.json({message: "Ya no sale"})
        }
    }
}

export const indexController = new Controller()