import { Router } from 'express'
import { indexController } from '../controllers/index.controller'

class router {
    public router: Router = Router()
    constructor() {
        this.config()
    }

    config(): void {
        this.router.get('/', indexController.prueba)
        this.router.post('/post', indexController.probarPost)
        this.router.post('/analizar', indexController.analizar)
    }
}

const indexRouter = new router()
export default indexRouter.router