"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Product_1 = require("./entity/Product");
const Order_1 = require("./entity/Order");
const User_1 = require("./entity/User");
const OrderState_1 = require("./entity/OrderState");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mongodb',
    host: 'localhost',
    database: 'tracking-system',
    synchronize: true,
    port: 27017,
    logging: false,
    entities: [Product_1.Product, Order_1.Order, User_1.User, OrderState_1.OrderState],
    migrations: [],
    subscribers: []
});
