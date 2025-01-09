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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = exports.withdraw = exports.deposit = void 0;
const findAccountById_1 = require("../services/db/findAccountById");
const updateAccountById_1 = require("../services/db/updateAccountById");
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { amount } = req.body;
    const { accountId, userId } = req;
    if (!accountId || !userId)
        return;
    amount = parseFloat(amount);
    if (!amount)
        return res.status(400).json({ message: 'Ingresar cantidad' });
    const account = yield (0, findAccountById_1.findAccountById)(accountId);
    if (!account)
        return res
            .status(404)
            .json({ message: 'No hay una cuenta relacionada con este cliente.' });
    const newAmount = account.amount + amount;
    const newAccount = yield (0, updateAccountById_1.updateAccountById)(accountId, {
        accountId,
        userId,
        amount: newAmount
    });
    return res
        .status(200)
        .json({ message: 'Deposito exitoso.', amount: newAccount.amount });
});
exports.deposit = deposit;
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { amount } = req.body;
    const { accountId, userId } = req;
    if (!accountId || !userId)
        return;
    amount = parseFloat(amount);
    if (!amount)
        return res.status(400).json({ message: 'Ingresar cantidad' });
    const account = yield (0, findAccountById_1.findAccountById)(accountId);
    if (!account)
        return res
            .status(404)
            .json({ message: 'No hay una cuenta relacionada con este cliente.' });
    // Verificar que el cliente cuente con dinero suficiente para poder realizar el retiro de la cantidad solicitada
    if (account.amount < amount) {
        return res.status(400).json({
            message: 'No cuenta con saldo suficiente para realizar el retiro.'
        });
    }
    // Actualizar la cantidad restante después del retiro
    const newAmount = account.amount - amount;
    const newAccount = yield (0, updateAccountById_1.updateAccountById)(accountId, {
        accountId,
        userId,
        amount: newAmount
    });
    return res
        .status(200)
        .json({ message: 'Retiro exitoso.', amount: newAccount });
});
exports.withdraw = withdraw;
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { amount, accountToTransfer } = req.body;
    const { accountId, userId } = req;
    if (!accountId || !userId)
        return;
    amount = parseFloat(amount);
    if (!amount)
        return res.status(400).json({ message: 'Ingresar cantidad.' });
    if (!accountToTransfer)
        return res.status(400).json({ message: 'Ingrese una cuenta de destino.' });
    //* retirar dinero de la cuenta del cliente que envia
    const accountEmisor = yield (0, findAccountById_1.findAccountById)(accountId);
    console.log(accountEmisor);
    //* Verificar que el cliente cuente con dinero suficiente para poder realizar el retiro de la cantidad solicitada
    if (accountEmisor.amount < amount) {
        return res.status(400).json({
            message: 'No cuenta con saldo suficiente para realizar el retiro.'
        });
    }
    //* Actualizar la cantidad restante después del retiro en la cuenta del cliente emisor
    const newAmountEmisor = accountEmisor.amount - amount;
    const updatedAccountEmisor = yield (0, updateAccountById_1.updateAccountById)(accountId, {
        accountId,
        userId,
        amount: newAmountEmisor
    });
    //* cuenta del cliente que recibe
    const accountReceptor = yield (0, findAccountById_1.findAccountById)(accountToTransfer);
    console.log(accountReceptor);
    //* Actualizar la cantidad restante después del retiro en la cuenta del cliente receptor
    const newAmountReceptor = accountReceptor.amount + amount;
    console.log(amount, accountToTransfer, newAmountReceptor);
    const updatedAccountReceptor = yield (0, updateAccountById_1.updateAccountById)(accountToTransfer, {
        accountId: accountToTransfer,
        userId: accountReceptor.userId,
        amount: newAmountReceptor
    });
    return res
        .status(200)
        .json({
        message: 'Transferencia exitosa.',
        updatedAccountEmisor,
        updatedAccountReceptor
    });
});
exports.transfer = transfer;
