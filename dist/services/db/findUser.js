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
exports.findUser = findUser;
const dataManager_1 = require("./dataManager");
function findUser(inputName, inputPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        // bring info from db
        const resUsers = yield (0, dataManager_1.readFile)('user.json');
        // const resAccounts = await readFile('account.json')
        // check if newUser already exists
        const user = resUsers.filter((user) => user.name === inputName)[0];
        // let userAccount
        // find user account
        // userAccount = resAccounts.filter(
        //   (account: AccountModel) => account.accountId === user.accountId
        // )[0]
        // return UserInfo
        return user;
    });
}
