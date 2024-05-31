"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_1 = __importDefault(require("./routes/orders"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const states_1 = __importDefault(require("./routes/states"));
const login_1 = __importDefault(require("./routes/login"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("./data-source");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const PORT = process.env.PORT === null || process.env.PORT === undefined ? 3000 : process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Timezone should be the default International timezone
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});
app.use('/api/orders', orders_1.default);
app.use('/api/users', users_1.default);
app.use('/api/products', products_1.default);
app.use('/api/states', states_1.default);
app.use('/api/login', login_1.default);
app.listen(PORT, () => {
    console.log(`Servidor está en el puerto ${PORT}`);
});
