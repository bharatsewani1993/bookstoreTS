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
exports.deleteOrder = exports.createOrder = exports.listAllBooks = exports.listSellerBooks = exports.uploadBook = void 0;
const sequelize_1 = require("sequelize");
const bookModel_1 = __importDefault(require("../models/bookModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const orderItemsModel_1 = __importDefault(require("../models/orderItemsModel"));
const constants_1 = require("../constants/constants");
const catchMessages_1 = require("../constants/catchMessages");
const uploadBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.body.id;
        const bookTitle = req.body.bookTitle;
        const bookAuthor = req.body.bookAuthor;
        const bookPrice = req.body.bookPrice;
        const category = req.body.category;
        const bookISBN = req.body.bookISBN;
        const bookImage = req.body.bookImage;
        const quantity = req.body.quantity;
        const bookObj = {
            sellerId: sellerId,
            bookTitle: bookTitle,
            bookAuthor: bookAuthor,
            bookPrice: bookPrice,
            category: category,
            bookISBN: bookISBN,
            bookImage: bookImage,
            quantity: quantity
        };
        const results = yield bookModel_1.default.create(bookObj);
        res.status(200).send({
            success: true,
            message: constants_1.CONSTANTS.MESSAGES.BOOK_UPLOADED,
            data: results
        });
    }
    catch (err) {
        console.log(catchMessages_1.CATCH_MESSAGES.BOOK_UPLOAD, err);
        res.status(400).send({
            success: false,
            message: constants_1.CONSTANTS.MESSAGES.BOOK_UPLOADING_FAILED
        });
    }
});
exports.uploadBook = uploadBook;
const listSellerBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.body.id;
        let allBooks = yield bookModel_1.default.findAll({
            where: {
                sellerId: sellerId,
                active: 1,
                quantity: {
                    [sequelize_1.Op.gt]: 0,
                }
            },
            raw: true,
        });
        let remainingQuantity = function (allBooks, quantity) {
            return __awaiter(this, void 0, void 0, function* () {
                return allBooks.reduce(function (total, current) {
                    return total + current[quantity];
                }, 0);
            });
        };
        const remainingQty = yield remainingQuantity(allBooks, 'quantity');
        res.status(200).send({
            success: true,
            message: constants_1.CONSTANTS.MESSAGES.BOOKS_LISTED,
            data: allBooks,
            remainingQty: remainingQty
        });
    }
    catch (err) {
        console.log(catchMessages_1.CATCH_MESSAGES.LIST_SELLER_BOOKS, err);
        res.status(400).send({
            success: false,
            message: constants_1.CONSTANTS.MESSAGES.BOOK_LISTING_FAILED
        });
    }
});
exports.listSellerBooks = listSellerBooks;
const listAllBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        userModel_1.default.hasMany(bookModel_1.default, { foreignKey: 'sellerId' });
        bookModel_1.default.belongsTo(userModel_1.default, { foreignKey: 'id' });
        const page = req.query.page || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const active = 1;
        const allBooks = yield bookModel_1.default.findAndCountAll({
            where: {
                active: active,
            },
            offset: offset,
            limit: limit,
            raw: false,
            include: {
                model: userModel_1.default,
                required: false,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'active', 'password', 'role'],
                },
                order: [['id', 'asc']]
            }
        });
        res.status(200).send({
            success: true,
            data: allBooks,
            message: constants_1.CONSTANTS.MESSAGES.BOOKS_LISTED
        });
    }
    catch (err) {
        console.log(catchMessages_1.CATCH_MESSAGES.LIST_ALL_BOOKS, err);
        res.status(400).send({
            success: false,
            message: constants_1.CONSTANTS.MESSAGES.ALL_BOOK_LISTING_FAILED
        });
    }
});
exports.listAllBooks = listAllBooks;
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.body.id;
        const orderDetails = req.body.orderDetails;
        let bookIdArr = [];
        for (var i = 0; i < orderDetails.length; i++) {
            bookIdArr.push(orderDetails[i].bookId);
        }
        let availableStock = yield bookModel_1.default.findAll({
            where: {
                id: bookIdArr,
                active: 1,
                quantity: {
                    [sequelize_1.Op.gt]: 0,
                }
            },
            order: [
                ['id', 'ASC'],
            ],
            raw: true
        });
        if (bookIdArr.length != availableStock.length) {
            const error = new Error(constants_1.CONSTANTS.MESSAGES.INVALID_ORDER_ITEMS);
            throw error;
        }
        else {
            orderDetails.sort((a, b) => {
                return a.bookId - b.bookId;
            });
            for (let i = 0; i < availableStock.length; i++) {
                if (availableStock[i].quantity >= orderDetails[i].bookQty) {
                    continue;
                }
                else {
                    const error = new Error(constants_1.CONSTANTS.MESSAGES.INVALID_ORDER_ITEMS);
                    throw error;
                }
            }
        }
        let orderObj = {
            customerId: customerId
        };
        order = yield orderModel_1.default.create(orderObj);
        let insertArr = [];
        for (var i = 0; i < orderDetails.length; i++) {
            let tempObj = {
                orderId: order.id,
                bookId: orderDetails[i].bookId,
                qty: orderDetails[i].bookQty
            };
            insertArr.push(tempObj);
        }
        let orderItems = yield orderItemsModel_1.default.bulkCreate(insertArr);
        let remainingQty = [];
        for (let i = 0; i < availableStock.length; i++) {
            let tempRemaining = availableStock[i].quantity - orderDetails[i].bookQty;
            remainingQty.push({ id: orderDetails[i].bookId, quantity: tempRemaining });
        }
        let promiseArr = [];
        for (let i = 0; i < remainingQty.length; i++) {
            promiseArr.push(bookModel_1.default.update({ quantity: remainingQty[i].quantity }, { where: {
                    id: remainingQty[i].id
                } }));
        }
        yield Promise.all(promiseArr);
        res.status(200).send({
            success: true,
            data: orderItems,
            message: constants_1.CONSTANTS.MESSAGES.ORDER_CREATED
        });
    }
    catch (err) {
        console.log(catchMessages_1.CATCH_MESSAGES.CREATE_ORDER, err);
        res.status(400).send({
            success: false,
            message: constants_1.CONSTANTS.MESSAGES.INVALID_ORDER_ITEMS
        });
    }
});
exports.createOrder = createOrder;
const deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.body.id;
        const orderId = req.body.orderId;
        const verifiedOrder = orderModel_1.default.findAll({
            where: {
                customerId: customerId,
                id: orderId,
                active: 1
            },
            raw: true
        });
        if (!verifiedOrder) {
            const error = new Error(constants_1.CONSTANTS.MESSAGES.INVALID_ORDER_ID);
            throw error;
        }
        const orderItems = yield orderItemsModel_1.default.findAll({
            where: {
                orderId: orderId,
                active: 1,
            },
            order: [
                ['bookId', 'asc']
            ],
            raw: true
        });
        yield orderItemsModel_1.default.update({
            active: 0
        }, {
            where: {
                orderId: orderId,
                active: 1
            }
        });
        let bookIdArr = [];
        for (var i = 0; i < orderItems.length; i++) {
            bookIdArr.push(orderItems[i].bookId);
        }
        let availableStock = yield bookModel_1.default.findAll({
            where: {
                id: bookIdArr,
                active: 1,
            },
            order: [
                ['id', 'ASC'],
            ],
            raw: true
        });
        let remainingQty = [];
        for (let i = 0; i < availableStock.length; i++) {
            let newRemaining = availableStock[i].quantity + orderItems[i].qty;
            remainingQty.push({ id: availableStock[i].id, quantity: newRemaining });
        }
        let promiseArr = [];
        for (let i = 0; i < remainingQty.length; i++) {
            promiseArr.push(bookModel_1.default.update({ quantity: remainingQty[i].quantity }, { where: {
                    id: remainingQty[i].id
                } }));
        }
        yield Promise.all(promiseArr);
        yield orderModel_1.default.update({
            active: 0
        }, {
            where: {
                active: 1,
                id: orderId,
                customerId: customerId
            }
        });
        res.status(200).send({
            success: true,
            data: orderItems,
            message: constants_1.CONSTANTS.MESSAGES.ORDER_DELETED
        });
    }
    catch (err) {
        console.log(catchMessages_1.CATCH_MESSAGES.DELETE_ORDER, err);
        res.status(400).send({
            success: false,
            message: constants_1.CONSTANTS.MESSAGES.INVALID_ORDER_ID
        });
    }
});
exports.deleteOrder = deleteOrder;
