"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookValidations = void 0;
const joi = __importStar(require("joi"));
const validImage = (value, helper) => {
    let bufferObj = Buffer.from(value, "base64");
    if (bufferObj) {
        return value;
    }
    else {
        return helper.message({ "error": "Please upload a valid image" });
    }
};
const bookValidations = joi.object().keys({
    bookTitle: joi.string().required().max(200),
    bookAuthor: joi.string().required().max(200),
    bookPrice: joi.number().required(),
    quantity: joi.number().required().min(1).max(99999),
    category: joi.string().required().max(200),
    bookISBN: joi.string().required().max(10),
    bookImage: joi.string().required().custom(validImage)
});
exports.bookValidations = bookValidations;
