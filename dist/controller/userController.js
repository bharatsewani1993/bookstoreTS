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
exports.getOrders = exports.signIn = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../constants/constants");
const catchMessages_1 = require("../constants/catchMessages");
const database_1 = require("../utils/database");
const userModel_1 = __importDefault(require("../models/userModel"));
const auth_1 = require("../middlewares/auth");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const termsAndCondition = req.body.termsAndCondition;
        const role = req.body.role;
        let password = req.body.password;
        password = yield bcryptjs_1.default.hash(password, 10);
        const userObj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            termsAndCondition: termsAndCondition,
            password: password,
            role: role
        };
        const duplicateEmail = yield userModel_1.default.findOne({
            where: {
                email: email,
            },
        });
        if (!duplicateEmail) {
            const result = yield userModel_1.default.create(userObj);
            userModel_1.default.prototype.toJSON = function () {
                var values = Object.assign({}, this.get());
                delete values.password;
                return values;
            };
            res.status(200).send({
                success: true,
                message: constants_1.CONSTANTS.MESSAGES.USER_CREATED,
                data: result
            });
        }
        else {
            res.status(422).send({
                success: false,
                message: constants_1.CONSTANTS.MESSAGES.EMAIL_ALREADY_REGISTERED,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(401).send({
            success: false,
            message: constants_1.CONSTANTS.MESSAGES.USER_CREATION_FAILED,
        });
    }
});
exports.signUp = signUp;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = yield userModel_1.default.findOne({
            where: {
                email: email,
                active: 1,
            }
        });
        if (user) {
            const match = yield bcryptjs_1.default.compare(password, user.password);
            if (match) {
                const authObj = {
                    id: user.id,
                    role: user.role
                };
                let authToken = yield (0, auth_1.createAuthentication)(authObj);
                res.status(200).send({
                    success: true,
                    authToken: authToken,
                    message: constants_1.CONSTANTS.MESSAGES.LOGGED_IN,
                });
            }
            else {
                const error = new Error(constants_1.CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
                throw error;
            }
        }
        else {
            const error = new Error(constants_1.CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
            throw error;
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: constants_1.CONSTANTS.MESSAGES.INVALID_CREDENTIALS
        });
    }
});
exports.signIn = signIn;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.body.id;
        const orderDetails = yield database_1.sequelize.query(`select orders.id as 'orderId', orders.customerId as 'customerId',orders.createdAt,
      orderitems.bookId as 'BookId', orderitems.qty as 'BookQuantity',
      books.bookTitle,books.category,books.bookAuthor,
      books.bookImage,books.bookISBN,books.bookPrice
      from orders 
      INNER JOIN orderitems
      on orders.id = orderitems.orderId
      INNER JOIN books
      on books.id = orderitems.bookId
      inner join users
      on users.id = orders.customerId
      where customerId = ${customerId} AND orders.active = 1`, {
            replacements: { customerId: customerId },
            type: database_1.sequelize.QueryTypes.SELECT,
            raw: true
        });
        res.status(200).send({
            success: true,
            data: orderDetails,
            message: constants_1.CONSTANTS.MESSAGES.ORDER_LISTED,
        });
    }
    catch (error) {
        console.log(catchMessages_1.CATCH_MESSAGES.GET_ORDERS, error);
        res.status(400).send({
            success: false,
            message: constants_1.CONSTANTS.MESSAGES.FAILED_TO_LIST_ORDERS
        });
    }
});
exports.getOrders = getOrders;
