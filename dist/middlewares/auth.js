"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    let decodedToken;
    if (!authHeader) {
        res.status(401).json({ message: 'Faltan permisos de autorización.' });
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, 'secret-key');
    }
    catch (error) {
        res.status(500).json({ message: 'Credenciales incorrectas.' });
        return next();
    }
    if (!decodedToken) {
        res.status(500).json({ message: 'Error de autenticación.' });
        return next();
    }
    req.accountId = decodedToken.accountId;
    req.userId = decodedToken.userId;
    next();
};
exports.auth = auth;
