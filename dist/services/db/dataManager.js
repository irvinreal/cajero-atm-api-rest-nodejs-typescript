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
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.getAmount = getAmount;
exports.setAmount = setAmount;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
function readFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield promises_1.default.readFile(node_path_1.default.join(__dirname, '../../data', file), 'utf8');
        let res;
        try {
            res = JSON.parse(data);
        }
        catch (error) {
            res = [];
        }
        return res;
    });
}
function writeFile(file, content) {
    return __awaiter(this, void 0, void 0, function* () {
        yield promises_1.default.writeFile(node_path_1.default.join(__dirname, '../../data', file), JSON.stringify(content));
    });
}
// Todo: restart data when user close the window
// function restartData(file: string) {
//   fs.writeFileSync(path.join(__dirname, '../data', file), JSON.stringify([]))
// }
function getAmount(userId) { }
function setAmount(userId, amount) { }
