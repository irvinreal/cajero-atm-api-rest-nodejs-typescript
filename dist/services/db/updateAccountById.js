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
exports.updateAccountById = updateAccountById;
const dataManager_1 = require("./dataManager");
function updateAccountById(id, newData) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield (0, dataManager_1.readFile)('account.json');
        // update account
        const newAccountsArr = data.filter((item) => item.accountId !== id);
        newAccountsArr.push(newData);
        // rewrite file
        yield (0, dataManager_1.writeFile)('account.json', newAccountsArr);
        const updatedData = yield (0, dataManager_1.readFile)('account.json');
        return updatedData.filter((item) => item.accountId === id)[0];
    });
}
