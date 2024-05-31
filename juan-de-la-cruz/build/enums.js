"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ENCARGADO"] = "Encargado";
    UserRole["VENDEDOR"] = "Vendedor";
    UserRole["DELIVERY"] = "Delivery";
    UserRole["REPARTIDOR"] = "Repartidor";
})(UserRole || (exports.UserRole = UserRole = {}));
var State;
(function (State) {
    State["POR_ATENDER"] = "Por atender";
    State["EN_PROCESO"] = "En proceso";
    State["EN_DELIVERY"] = "En delivery";
    State["RECIBIDO"] = "Recibido";
})(State || (exports.State = State = {}));
