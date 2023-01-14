"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userValidations_1 = require("../validations/userValidations");
const userController_1 = require("../controller/userController");
const constants_1 = require("../constants/constants");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
router.post('/sign-up', (0, validate_1.validate)(userValidations_1.signUpValidations), userController_1.signUp);
router.post('/sign-in', (0, validate_1.validate)(userValidations_1.signInValidations), userController_1.signIn);
router.get('/orders', (0, auth_1.validateAuth)([constants_1.CONSTANTS.ROLE.CUSTOMER]), userController_1.getOrders);
module.exports = router;
