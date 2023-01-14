"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderValidations = void 0;
const joi_1 = __importDefault(require("joi"));
const deleteOrderValidations = joi_1.default.object().keys({
    orderId: joi_1.default.number().integer().required().max(9999999)
});
exports.deleteOrderValidations = deleteOrderValidations;
