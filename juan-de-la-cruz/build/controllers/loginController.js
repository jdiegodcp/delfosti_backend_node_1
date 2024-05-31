"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginApp = void 0;
// @ts-nocheck
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = require("../entity/User");
const data_source_1 = require("../data-source");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.loginApp = (0, express_async_handler_1.default)(async (request, response) => {
    const { body } = request;
    const { userName, password } = body;
    const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({
        userName
    });
    const passwordConfirmed = user === null
        ? false
        : await bcrypt_1.default.compare(password, user.passwordHash);
    if (!((user !== null) && passwordConfirmed)) {
        response.status(401).json({
            error: 'invalid user or password'
        });
    }
    const userForToken = {
        userCode: user === null || user === void 0 ? void 0 : user.userCode,
        userName: user === null || user === void 0 ? void 0 : user.userName
    };
    const token = jsonwebtoken_1.default.sign(userForToken, process.env.JWT_SECRET === null || process.env.JWT_SECRET === undefined ? '123' : process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 7
    });
    response.send({
        name: user === null || user === void 0 ? void 0 : user.userName,
        cargo: user === null || user === void 0 ? void 0 : user.position,
        rol: user === null || user === void 0 ? void 0 : user.role,
        token
    });
});
