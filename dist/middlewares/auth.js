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
exports.validateAuth = exports.createAuthentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../env/index");
const constants_1 = require("../constants/constants");
const catchMessages_1 = require("../constants/catchMessages");
const ENV = (0, index_1.envSettings)();
const createAuthentication = (tokenDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign(tokenDetails, ENV.JWT_SECRET_KEY, {
        expiresIn: "2h",
    });
    return token;
});
exports.createAuthentication = createAuthentication;
const validateAuth = (roleArr) => (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).send({
                    success: false,
                    message: constants_1.CONSTANTS.MESSAGES.LOGIN_REQUIRED,
                });
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, ENV.JWT_SECRET_KEY);
                req.body.id = decoded.id;
                req.body.role = decoded.role;
                if (roleArr.includes(req.body.role)) {
                    return next();
                }
                else {
                    const error = new Error(constants_1.CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
                    throw error;
                }
            }
            catch (error) {
                console.log(catchMessages_1.CATCH_MESSAGES.VALIDATE_AUTH, error);
                return res.status(401).send({
                    success: false,
                    message: constants_1.CONSTANTS.MESSAGES.LOGIN_REQUIRED
                });
            }
        }
        else {
            return res.status(401).send({
                success: false,
                message: constants_1.CONSTANTS.MESSAGES.LOGIN_REQUIRED,
            });
        }
    }
    catch (error) {
        console.log(catchMessages_1.CATCH_MESSAGES.VALIDATE_AUTH, error);
        res.status(401).send({
            success: false,
            message: constants_1.CONSTANTS.MESSAGES.LOGIN_REQUIRED
        });
    }
};
exports.validateAuth = validateAuth;
