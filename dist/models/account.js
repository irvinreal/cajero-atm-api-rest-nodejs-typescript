"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountSchema = void 0;
const mongoose_1 = require("mongoose");
exports.accountSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    amount: {
        type: mongoose_1.Schema.Types.Decimal128,
        default: 0,
    },
});
exports.default = (0, mongoose_1.model)('Account', exports.accountSchema);
