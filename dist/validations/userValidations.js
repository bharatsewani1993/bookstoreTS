"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidations = exports.signUpValidations = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_password_1 = require("joi-password");
const CONSTANTS = require("../constants/constants");
const signUpValidations = joi_1.default.object().keys({
    firstName: joi_1.default.string().required().max(200),
    lastName: joi_1.default.string().required().max(200),
    email: joi_1.default.string().email().required(),
    phoneNumber: joi_1.default.string().required().regex(/^[0-9]{10}$/).messages({
        'string.pattern.base': CONSTANTS.MESSAGES.TEN_DIGIT_NUMBER_ALLOW
    }),
    password: joi_password_1.joiPassword.string().min(8)
        .max(200)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),
    confirmPassword: joi_1.default
        .any()
        .equal(joi_1.default.ref(CONSTANTS.MESSAGES.PASSWORD))
        .required()
        .label(CONSTANTS.MESSAGES.CONFIRM_PASSWORD)
        .options({
        messages: {
            "any.only": CONSTANTS.MESSAGES.PASSWORD_DOES_NOT_MATCH,
        },
    }),
    role: joi_1.default.string().required().valid('customer', 'seller')
});
exports.signUpValidations = signUpValidations;
const signInValidations = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    password: joi_password_1.joiPassword.required(),
});
exports.signInValidations = signInValidations;
