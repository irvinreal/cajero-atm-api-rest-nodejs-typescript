"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("./index"));
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
function DBConnection() {
    mongoose_1.default
        .connect(process.env.MONGODB_URI)
        .then(() => {
        index_1.default.listen(PORT);
        console.log(`Server running in PORT: ${PORT}`);
    })
        .catch(err => console.log('__', err));
}
exports.default = DBConnection;
