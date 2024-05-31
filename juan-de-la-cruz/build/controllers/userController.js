"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUser = exports.getUserByRol = exports.getUser = exports.getUsers = void 0;
// @ts-nocheck
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const methods_1 = require("../utils/methods");
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.getUsers = (0, express_async_handler_1.default)(async (_request, response) => {
    const allUsers = await data_source_1.AppDataSource.getMongoRepository(User_1.User).find({});
    return response.send(allUsers);
});
exports.getUser = (0, express_async_handler_1.default)(async (request, response) => {
    const results = await data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({
        _id: new mongodb_1.ObjectId(request.params.id)
    });
    return results === null ? response.status(200).json({}) : response.send(results);
});
exports.getUserByRol = (0, express_async_handler_1.default)(async (request, response) => {
    const results = await data_source_1.AppDataSource.getRepository(User_1.User).find({
        role: request.params.id
    });
    return results === null ? response.status(200).json({}) : response.send(results);
});
exports.saveUser = (0, express_async_handler_1.default)(async (request, response) => {
    const { userName } = request.body;
    const userExisting = await data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({
        userName
    });
    if (userExisting !== null) {
        throw new Error('Username existing , choose a new username');
    }
    const newUser = (0, methods_1.toNewUser)(request.body);
    const saltRounds = 10;
    // It's necessary the await to let the process of hashing finish
    const passwordHash = await bcrypt_1.default.hash(newUser.passwordHash, saltRounds);
    newUser.passwordHash = passwordHash;
    try {
        const userInserted = data_source_1.AppDataSource.getMongoRepository(User_1.User).create(newUser);
        const results = await data_source_1.AppDataSource.getMongoRepository(User_1.User).save(userInserted);
        return response.send(results);
    }
    catch (error) {
        throw new Error('Error', error.message);
    }
});
