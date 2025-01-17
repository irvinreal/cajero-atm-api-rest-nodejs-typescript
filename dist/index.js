"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
const ACCEPTED_ORIGINS = [
    'https://landing-cajero-atm.vercel.app/',
    'https://landing-cajero-atm.vercel.app/login',
    'https://landing-cajero-atm.vercel.app/register',
    '*'
];
dotenv_1.default.config();
const app = (0, express_1.default)();
// const logger = buildLogger('index.ts')
// logger.log('hola mundo')
// logger.error('Este es un error...')
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Referer');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
//* Routes
// Crear cuenta ( Autenticación )
app.use('/auth', authRoutes_1.default);
// Movimientos ( Depositos, Retiros, Transferencias )
app.use('/auth/my-account', accountRoutes_1.default);
// DBConnection()
// Todo: change MONGODB -> json file
const newUserCamila = {
    name: 'camila',
    password: 'camilita',
    amount: 0
};
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
