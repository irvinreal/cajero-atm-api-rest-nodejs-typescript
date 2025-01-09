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
exports.createUser = createUser;
const get_id_plugin_1 = require("../../plugins/get-id.plugin");
const dataManager_1 = require("./dataManager");
function createUser(newUser) {
    return __awaiter(this, void 0, void 0, function* () {
        // bring info from db
        const resUsers = yield (0, dataManager_1.readFile)('user.json');
        const resAccounts = yield (0, dataManager_1.readFile)('account.json');
        // check if newUser already exists
        const user = resUsers.filter((user) => user.name === newUser.name)[0];
        if (user) {
            throw new Error('User already exist.');
        }
        // generate credentials
        const userId = (0, get_id_plugin_1.getUUID)();
        const accountId = (0, get_id_plugin_1.getUUID)();
        // user object to save
        const userToSave = {
            userId: userId,
            name: newUser.name,
            password: newUser.password,
            accountId: accountId
        };
        // account object to save
        const accountToSave = {
            accountId: accountId,
            userId: userId,
            amount: newUser.amount
        };
        const newUsersArr = [...resUsers, userToSave];
        const newAccountsArr = [...resAccounts, accountToSave];
        try {
            (0, dataManager_1.writeFile)('user.json', newUsersArr);
            (0, dataManager_1.writeFile)('account.json', newAccountsArr);
            console.log('User created succesfully.');
        }
        catch (error) {
            console.log('An error ocurred.');
        }
        return;
    });
}
