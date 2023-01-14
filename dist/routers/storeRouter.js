"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bookValidations_1 = require("../validations/bookValidations");
const orderValidations_1 = require("../validations/orderValidations");
const storeController_1 = require("../controller/storeController");
const auth_1 = require("../middlewares/auth");
const constants_1 = require("../constants/constants");
const validate_1 = require("../middlewares/validate");
router.post('/upload-book', (0, auth_1.validateAuth)([constants_1.CONSTANTS.ROLE.SELLER]), (0, validate_1.validate)(bookValidations_1.bookValidations), storeController_1.uploadBook);
router.get('/list', (0, auth_1.validateAuth)([constants_1.CONSTANTS.ROLE.SELLER]), storeController_1.listSellerBooks);
router.get('/', storeController_1.listAllBooks);
router.post('/order', (0, auth_1.validateAuth)([constants_1.CONSTANTS.ROLE.CUSTOMER]), storeController_1.createOrder);
router.delete('/order', (0, auth_1.validateAuth)([constants_1.CONSTANTS.ROLE.CUSTOMER]), (0, validate_1.validate)(orderValidations_1.deleteOrderValidations), storeController_1.deleteOrder);
module.exports = router;
