"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    }
});
exports.default = (0, mongoose_1.model)('User', userSchema);
