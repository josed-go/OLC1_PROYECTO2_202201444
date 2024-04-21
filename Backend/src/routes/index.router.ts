import { Router } from 'express'
import { indexController } from '../controllers/index.controller'

class router {
    public router: Router = Router()
    constructor() {
        this.config()
    }

    config(): void {
        this.router.post('/analizar', indexController.analizar)
        this.router.get('/obtenerErrores', indexController.getErrores)
        this.router.get('/getAST', indexController.getAST)
    }
}

const indexRouter = new router()
export default indexRouter.router