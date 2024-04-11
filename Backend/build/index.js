"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_router_1 = __importDefault(require("./src/routes/index.router"));
class servidor {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 4000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use("/", index_router_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Server on port: ", this.app.get('port'));
        });
    }
}
exports.server = new servidor();
exports.server.start();
// const app = express()
// app.use(cors())
// app.listen(4000, () => {
//     console.log("server listening on port 4000")
// })
