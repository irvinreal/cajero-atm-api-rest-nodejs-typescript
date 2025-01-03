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
exports.transfer = exports.withdraw = exports.deposit = void 0;
const account_1 = __importDefault(require("../models/account"));
const user_1 = __importDefault(require("../models/user"));
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { amount } = req.body;
    const { accountId } = req;
    amount = parseFloat(amount);
    if (!amount)
        return res.status(400).json({ message: 'Ingresar cantidad' });
    const accountDB = yield account_1.default.findById(accountId);
    if (!accountDB)
        return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' });
    const parsedAmount = parseFloat(accountDB.amount.toString());
    const newAmount = parsedAmount + amount;
    const amountUpdated = yield account_1.default.findByIdAndUpdate(accountId, { amount: newAmount }, { returnDocument: 'after' });
    if (!amountUpdated)
        return res.status(500).json({ message: 'Error al retirar en la DB.' });
    const parsedAmountUpdated = parseFloat(amountUpdated.amount.toString());
    return res.status(200).json({ message: 'Deposito exitoso.', amount: parsedAmountUpdated });
});
exports.deposit = deposit;
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { amount } = req.body;
    const { accountId } = req;
    amount = parseFloat(amount);
    if (!amount)
        return res.status(400).json({ message: 'Ingresar cantidad' });
    const accountDB = yield account_1.default.findById(accountId);
    if (!accountDB)
        return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' });
    const parsedAmount = parseFloat(accountDB.amount.toString());
    // Verificar que el cliente cuente con dinero suficiente para poder realizar el retiro de la cantidad solicitada
    if (parsedAmount < amount) {
        return res
            .status(400)
            .json({ message: 'No cuenta con saldo suficiente para realizar el retiro.' });
    }
    // Actualizar la cantidad restante después del retiro
    const newAmount = parsedAmount - amount;
    const amountUpdated = yield account_1.default.findByIdAndUpdate(accountId, { amount: newAmount }, { returnDocument: 'after' });
    if (!amountUpdated)
        return res.status(500).json({ message: 'Error al retirar en la DB.' });
    const parsedAmountUpdated = parseFloat(amountUpdated.amount.toString());
    return res.status(200).json({ message: 'Retiro exitoso.', amount: parsedAmountUpdated });
});
exports.withdraw = withdraw;
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { amount, userToTransfer } = req.body;
    const { accountId } = req;
    amount = parseFloat(amount);
    console.log(amount, userToTransfer);
    if (!amount)
        return res.status(400).json({ message: 'Ingresar cantidad.' });
    if (!userToTransfer)
        return res.status(400).json({ message: 'Ingrese una cuenta de destino.' });
    const accountDBEmisor = yield account_1.default.findById(accountId);
    if (!accountDBEmisor)
        return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' });
    const parsedAmountEmisor = parseFloat(accountDBEmisor.amount.toString());
    // Verificar que el cliente cuente con dinero suficiente para poder realizar el retiro de la cantidad solicitada
    if (parsedAmountEmisor < amount) {
        return res
            .status(400)
            .json({ message: 'No cuenta con saldo suficiente para realizar el retiro.' });
    }
    // Verificar que el cliente que recibe existe
    const userDBReceptor = yield user_1.default.findById(userToTransfer);
    if (!userDBReceptor)
        return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' });
    const accountDBReceptor = yield account_1.default.findById(userDBReceptor.accountId.toString());
    if (!accountDBReceptor)
        return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' });
    const parsedAmountReceptor = parseFloat(accountDBReceptor.amount.toString());
    // Actualizar la cantidad restante después del retiro en la cuenta del cliente emisor
    const newAmountEmisor = parsedAmountEmisor - amount;
    const amountUpdatedEmisor = yield account_1.default.findByIdAndUpdate(accountId, { amount: newAmountEmisor }, { returnDocument: 'after' });
    if (!amountUpdatedEmisor)
        return res.status(500).json({ message: 'Error al retirar en la DB.' });
    const parsedAmountUpdatedEmisor = parseFloat(amountUpdatedEmisor.amount.toString());
    // Actualizar la cantidad restante después del retiro en la cuenta del cliente que recibe
    const newAmountReceptor = parsedAmountReceptor + amount;
    const amountUpdatedReceptor = yield account_1.default.findByIdAndUpdate(userDBReceptor.accountId.toString(), { amount: newAmountReceptor }, { returnDocument: 'after' });
    if (!amountUpdatedReceptor)
        return res.status(500).json({ message: 'Error al retirar en la DB.' });
    const parsedAmountUpdatedReceptor = parseFloat(amountUpdatedReceptor.amount.toString());
    console.log('Cuenta emisor: ', parsedAmountEmisor, ' -> ', parsedAmountUpdatedEmisor);
    console.log('Cuenta receptor: ', parsedAmountReceptor, ' -> ', parsedAmountUpdatedReceptor);
    return res.status(200).json({ message: 'Transferencia exitosa.' });
});
exports.transfer = transfer;
