"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const findUser_1 = require("../services/db/findUser");
const createUser_1 = require("../services/db/createUser");
const password_service_1 = require("../services/password.service");
const findUserById_1 = require("../services/db/findUserById");
const findAccountById_1 = require("../services/db/findAccountById");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, password, amount = 0 } = req.body;
    if (amount === '')
        amount = 0;
    try {
        if (!name || !password) {
            return res.status(400).json({ error: 'Faltan campos por llenar.' });
        }
        const hashedPassword = yield (0, password_service_1.hashPassword)(password);
        const newUser = {
            name: name,
            password: hashedPassword,
            amount: amount
        };
        yield (0, createUser_1.createUser)(newUser);
        return res.status(201).json({
            amount: parseFloat(newUser.amount),
            message: 'Nueva cuenta creada satisfactoriamente.'
        });
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(200).json({ error: 'Este cliente ya fue registrado.' });
        }
        if (error.message === 'User already exist.') {
            return res
                .status(400)
                .json({ error: 'El usuario que intenta crear ya existe.' });
        }
        return res.status(500).json({ error: 'Hubo un error. Intente más tarde..', message: error.meesage });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    try {
        const user = yield (0, findUser_1.findUser)(name, password);
        if (!user) {
            return res.status(404).json({ error: 'Cuenta incorrecta.' });
        }
        const isEqual = yield (0, password_service_1.comparePassword)(password, user.password);
        if (!isEqual)
            return res.status(401).json({ message: 'Incorrect password' });
        const token = jsonwebtoken_1.default.sign({
            name: user.name,
            userId: user.userId.toString(),
            accountId: user.accountId.toString()
        }, 'secret-key', {
            expiresIn: 1000 * 60 * 3
        });
        return res.status(200).json({
            message: 'Bievenido a tu cuenta.',
            name: user.name,
            token,
            userId: user.userId.toString()
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, userId } = req;
    if (!userId || !accountId)
        return;
    try {
        // Todo: Agregar historial de movimientos
        const user = yield (0, findUserById_1.findUserById)(userId);
        const userAccount = yield (0, findAccountById_1.findAccountById)(accountId);
        return res.status(200).json({
            accountId: userAccount.accountId,
            clientName: user.name,
            account: userAccount
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUserInfo = getUserInfo;
