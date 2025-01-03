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
const mongoose_1 = __importDefault(require("mongoose"));
const account_1 = __importDefault(require("../models/account"));
const user_1 = __importDefault(require("../models/user"));
// import { UserResponse } from '../types'
const password_service_1 = require("../services/password.service");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, password, amount = 0 } = req.body;
    if (amount === '') {
        amount = 0;
    }
    try {
        if (!name || !password) {
            return res.status(400).json({ error: 'Faltan campos por llenar.' });
        }
        const userExists = yield user_1.default.findOne({ name });
        if (userExists) {
            console.log(userExists);
            return res.status(400).json({ error: 'Este cliente ya fue registrado.' });
        }
        const hashedPassword = yield (0, password_service_1.hashPassword)(password);
        const userId = new mongoose_1.default.Types.ObjectId();
        console.log(userId);
        const userAccount = new account_1.default({
            user: userId,
            amount: amount,
        });
        const user = new user_1.default({
            name,
            password: hashedPassword,
            accountId: userAccount._id,
        });
        user._id = userId;
        const userAccountDB = yield userAccount.save();
        const userDB = yield user.save();
        console.log({
            user: userDB,
            account: userAccountDB,
        });
        return res.status(201).json({
            name: userDB.name,
            amount: parseFloat(userAccountDB.amount.toString()),
            message: 'Nueva cuenta creada satisfactoriamente.',
        });
    }
    catch (error) {
        if (error.code === 'P2002') {
            console.log('Este cliente ya fue registrado.');
            return res.status(200).json({ error: 'Este cliente ya fue registrado.' });
        }
        console.log(error);
        return res.status(500).json({ error: 'Hubo un error. Intente más tarde..' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ name });
        if (!user) {
            return res.status(404).json({ error: 'Cuenta incorrecta.' });
        }
        const isEqual = yield (0, password_service_1.comparePassword)(password, user.password);
        if (!isEqual) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }
        console.log(user);
        const token = jsonwebtoken_1.default.sign({ name: user.name, userId: user._id.toString(), accountId: user.accountId.toString() }, 'secret-key', {
            expiresIn: 1000 * 60 * 5,
        });
        return res.status(200).json({
            message: 'Bievenido a tu cuenta.',
            name: user.name,
            token,
            userId: user._id.toString(),
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { userId } = req.body
    const { accountId } = req;
    // if (!userId) {
    //   return res.status(401).json({ message: "Falta 'userId'" })
    // }
    try {
        const accountDB = yield account_1.default.findById(accountId).populate('user', 'name');
        if (!accountDB)
            return res.status(404).json({ message: 'No existe una cuenta relacionada con este cliente.' });
        // Todo: Agregar historial de movimientos
        console.log(accountDB);
        return res.status(200).json({
            client: accountDB === null || accountDB === void 0 ? void 0 : accountDB.user,
            amount: parseFloat(accountDB === null || accountDB === void 0 ? void 0 : accountDB.amount.toString()),
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUserInfo = getUserInfo;
