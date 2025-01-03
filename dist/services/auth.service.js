"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'Default-secret';
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, name: user.name }, JWT_SECRET, {
        expiresIn: '1400'
    });
};
exports.generateToken = generateToken;
