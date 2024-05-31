"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveStates = exports.getState = exports.getStates = void 0;
// @ts-nocheck
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const data_source_1 = require("../data-source");
const OrderState_1 = require("../entity/OrderState");
const methods_1 = require("../utils/methods");
const enums_1 = require("../enums");
const stateMap = new Map([
    [enums_1.State.POR_ATENDER, { id: 1, description: enums_1.State.POR_ATENDER }],
    [enums_1.State.EN_PROCESO, { id: 2, description: enums_1.State.EN_PROCESO }],
    [enums_1.State.EN_DELIVERY, { id: 3, description: enums_1.State.EN_DELIVERY }],
    [enums_1.State.RECIBIDO, { id: 4, description: enums_1.State.RECIBIDO }]
]);
exports.getStates = (0, express_async_handler_1.default)(async (_request, response) => {
    const allUsers = await data_source_1.AppDataSource.getMongoRepository(OrderState_1.OrderState).find({});
    return response.send(allUsers);
});
exports.getState = (0, express_async_handler_1.default)(async (request, response) => {
    const results = await data_source_1.AppDataSource.getRepository(OrderState_1.OrderState).find({
        orderNumber: request.params.id
    });
    return results === null ? response.status(200).json({}) : response.send(results);
});
exports.saveStates = (0, express_async_handler_1.default)(async (request, response) => {
    const filteredDocuments = await data_source_1.AppDataSource.getRepository(OrderState_1.OrderState).find({
        orderNumber: request.body.orderNumber
    });
    const newState = (0, methods_1.toNewState)(request.body);
    if (filteredDocuments.length === 0) {
        const updateInserted = data_source_1.AppDataSource.getMongoRepository(OrderState_1.OrderState).create(newState);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const results = await data_source_1.AppDataSource.getMongoRepository(OrderState_1.OrderState).save(updateInserted);
        return null;
    }
    else {
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
        newState.userCode = decodedToken.userCode;
        const weightState = filteredDocuments.map((doc) => stateMap.get(doc.state).id);
        const max = Math.max(...weightState);
        if (stateMap.get(newState.state).id <= max) {
            throw new Error('Status sent incorrectly, insert a proper Status');
        }
        else {
            const updateInserted = data_source_1.AppDataSource.getMongoRepository(OrderState_1.OrderState).create(newState);
            const resultsNewUpdate = await data_source_1.AppDataSource.getMongoRepository(OrderState_1.OrderState).save(updateInserted);
            return response.send(resultsNewUpdate);
        }
    }
});
