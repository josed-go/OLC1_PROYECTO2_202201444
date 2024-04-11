"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = void 0;
class Controller {
    prueba(req, res) {
        res.json({ message: "HEllo WOLRD" });
    }
    probarPost(req, res) {
        console.log(req.body);
        res.json({ message: "metdo post" });
    }
}
exports.indexController = new Controller();
