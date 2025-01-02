"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountController_1 = require("../controllers/accountController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.patch('/deposit', auth_1.auth, accountController_1.deposit);
router.patch('/withdraw', auth_1.auth, accountController_1.withdraw);
router.post('/transfer', auth_1.auth, accountController_1.transfer);
exports.default = router;
