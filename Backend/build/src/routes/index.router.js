"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = require("../controllers/index.controller");
class router {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/analizar', index_controller_1.indexController.analizar);
        this.router.get('/obtenerErrores', index_controller_1.indexController.getErrores);
    }
}
const indexRouter = new router();
exports.default = indexRouter.router;
