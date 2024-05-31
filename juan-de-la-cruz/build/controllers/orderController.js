"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderWithProductsDetails = exports.saveOrder = exports.getOrder = exports.getOrders = void 0;
// @ts-nocheck
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const data_source_1 = require("../data-source");
const Order_1 = require("../entity/Order");
const methods_1 = require("../utils/methods");
const mongodb_1 = require("mongodb");
const Product_1 = require("../entity/Product");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const stateController_1 = require("../controllers/stateController");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.getOrders = (0, express_async_handler_1.default)(async (_request, response) => {
    const allOrders = await data_source_1.AppDataSource.getMongoRepository(Order_1.Order).find({});
    return response.send(allOrders);
});
exports.getOrder = (0, express_async_handler_1.default)(async (request, response) => {
    const results = await data_source_1.AppDataSource.getRepository(Order_1.Order).findOneBy({
        _id: new mongodb_1.ObjectId(request.params.id)
    });
    return results === null ? response.status(200).json({}) : response.send(results);
});
exports.saveOrder = (0, express_async_handler_1.default)(async (request, response) => {
    const authorization = request.get('authorization');
    let token = '';
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (authorization !== null && authorization.toLowerCase().startsWith('bearer') !== null) {
        token = authorization.substring(7);
    }
    let decodedToken;
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET === null || process.env.JWT_SECRET === undefined ? '123' : process.env.JWT_SECRET, (err, decoded) => {
            if (err != null) {
                console.error('Token verification failed:', err);
            }
            else {
                console.log('Decoded Payload:', decoded);
                decodedToken = decoded;
            }
        });
    }
    catch (error) {
        console.log(error);
    }
    if (token === null || decodedToken.userCode === null) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }
    const newOrder = (0, methods_1.toNewOrder)(request.body);
    newOrder.sellerCode = decodedToken.userCode;
    try {
        const orderInserted = data_source_1.AppDataSource.getMongoRepository(Order_1.Order).create(newOrder);
        const results = await data_source_1.AppDataSource.getMongoRepository(Order_1.Order).save(orderInserted);
        const stateSave = Object.assign({}, request);
        const responseSave = Object.assign({}, response);
        stateSave.body.orderNumber = await results.orderNumber.toString();
        stateSave.body.userCode = newOrder.sellerCode;
        stateSave.body.state = 'Por atender';
        (0, stateController_1.saveStates)(stateSave, responseSave);
        return response.send(results);
    }
    catch (error) {
        throw new Error('Error');
    }
});
exports.getOrderWithProductsDetails = (0, express_async_handler_1.default)(async (_request, response) => {
    const allOrders = await data_source_1.AppDataSource.getMongoRepository(Order_1.Order).find({});
    const filteredDocuments = allOrders === null ? [{}] : allOrders;
    if (filteredDocuments.length === 0) {
        return response.status(200).json({});
    }
    const orderInDetail = Object.assign({}, filteredDocuments);
    for (let index = 0; index < filteredDocuments.length; index++) {
        const results = [];
        for (const document of filteredDocuments[index].productsList) {
            const result = await data_source_1.AppDataSource.getMongoRepository(Product_1.Product).find({ where: { _id: new mongodb_1.ObjectId(document) } });
            if (result !== null) {
                results.push(result);
            }
        }
        orderInDetail[index].productsList = results;
    }
    return response.send(Object.values(orderInDetail));
});
