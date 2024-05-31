"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewState = exports.toNewProduct = exports.toNewUser = exports.toNewOrder = void 0;
const enums_1 = require("../enums");
const isString = (value) => typeof value === 'string';
const isArrayOfStrings = (arr) => {
    return Array.isArray(arr) && arr.every(item => isString(item));
};
const parseValue = (value, fieldName) => {
    if (!isString(value)) {
        throw new Error(`Incorrect or missing ${fieldName}`);
    }
    return value;
};
const parseArray = (arrayFromRequest) => {
    if (!isArrayOfStrings(arrayFromRequest)) {
        throw new Error('Incorrect or missing Array');
    }
    return arrayFromRequest;
};
const parseRole = (roleInput) => {
    if (!isString(roleInput) || !Object.values(enums_1.UserRole).includes(roleInput)) {
        throw new Error('Incorrect or missing Role');
    }
    return roleInput;
};
const parsePrice = (priceField) => {
    if (isNaN(priceField)) {
        throw new Error('Incorrect or missing Price');
    }
    return priceField;
};
const parseState = (stateIn) => {
    if (!isString(stateIn) || !Object.values(enums_1.State).includes(stateIn)) {
        throw new Error('Incorrect or missing Status');
    }
    return stateIn;
};
const toNewOrder = (object) => {
    return {
        sellerCode: parseValue(object.sellerCode, 'SellerCode'),
        productsList: parseArray(object.productsList),
        orderDate: new Date((new Date()).getTime() - (5 * 60 * 60 * 1000))
    };
};
exports.toNewOrder = toNewOrder;
const toNewUser = (object) => {
    return {
        userName: parseValue(object.userName, 'UserName'),
        passwordHash: parseValue(object.passwordHash, 'PasswordHash'),
        email: parseValue(object.email, 'Email'),
        phone: parseValue(object.phone, 'Phone'),
        position: parseValue(object.position, 'Position'),
        role: parseRole(object.role)
    };
};
exports.toNewUser = toNewUser;
const toNewProduct = (object) => {
    return {
        productName: parseValue(object.productName, 'Product Name'),
        productType: parseValue(object.productType, 'Product Type'),
        tags: parseValue(object.tags, 'Tags'),
        price: parsePrice(object.price),
        measurementUnit: parseValue(object.measurementUnit, 'Measurement Unit')
    };
};
exports.toNewProduct = toNewProduct;
const toNewState = (object) => {
    return {
        orderNumber: parseValue(object.orderNumber, 'Order Number'),
        userCode: parseValue(object.userCode, 'User Code'),
        state: parseState(object.state),
        date: new Date((new Date()).getTime() - (5 * 60 * 60 * 1000))
    };
};
exports.toNewState = toNewState;
