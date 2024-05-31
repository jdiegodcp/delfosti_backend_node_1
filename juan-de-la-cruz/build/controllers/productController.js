"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProduct = exports.getProductByName = exports.getProduct = exports.getProducts = void 0;
// @ts-nocheck
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const data_source_1 = require("../data-source");
const Product_1 = require("../entity/Product");
const methods_1 = require("../utils/methods");
const mongodb_1 = require("mongodb");
exports.getProducts = (0, express_async_handler_1.default)(async (_request, response) => {
    const allProducts = await data_source_1.AppDataSource.getMongoRepository(Product_1.Product).find({});
    return response.send(allProducts);
});
exports.getProduct = (0, express_async_handler_1.default)(async (request, response) => {
    const results = await data_source_1.AppDataSource.getRepository(Product_1.Product).findOneBy({
        _id: new mongodb_1.ObjectId(request.params.id)
    });
    return results === null ? response.status(200).json({}) : response.send(results);
});
exports.getProductByName = (0, express_async_handler_1.default)(async (request, response) => {
    const results = await data_source_1.AppDataSource.getRepository(Product_1.Product).find({
        productName: request.params.id
    });
    return results === null ? response.status(200).json({}) : response.send(results);
});
exports.saveProduct = (0, express_async_handler_1.default)(async (request, response) => {
    const newProduct = (0, methods_1.toNewProduct)(request.body);
    try {
        const productInserted = data_source_1.AppDataSource.getMongoRepository(Product_1.Product).create(newProduct);
        const results = await data_source_1.AppDataSource.getMongoRepository(Product_1.Product).save(productInserted);
        return response.send(results);
    }
    catch (error) {
        throw new Error('Error', error.message);
    }
});
