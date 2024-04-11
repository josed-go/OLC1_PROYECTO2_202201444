import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import indexRouter from './src/routes/index.router'

class servidor {
    public app: Application

    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    config(): any{
        this.app.set('port', process.env.PORT || 4000)
        this.app.use(morgan('dev'))
        this.app.use(express.urlencoded({extended: false}))
        this.app.use(express.json())
        this.app.use(cors())
        this.app.use(bodyParser.urlencoded({extended: false}))
    }

    routes(): void {
        this.app.use("/", indexRouter)
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log("Server on port: ", this.app.get('port'))
        })
    }
}

export const server = new servidor()
server.start()

// const app = express()

// app.use(cors())

// app.listen(4000, () => {
//     console.log("server listening on port 4000")
// })