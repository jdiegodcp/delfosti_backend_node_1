"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stateController_1 = require("../controllers/stateController");
const router = express_1.default.Router();
router.get('/', stateController_1.getStates);
router.get('/:id', stateController_1.getState);
// router.get('/role/:id', getUserByRol)
router.post('/', stateController_1.saveStates);
exports.default = router;
