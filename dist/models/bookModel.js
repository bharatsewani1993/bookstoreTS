"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
class bookModel extends sequelize_1.Model {
}
exports.bookModel = bookModel;
bookModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    sellerId: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
    },
    bookTitle: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    bookAuthor: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    bookPrice: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    category: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    bookISBN: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    bookImage: {
        type: sequelize_1.DataTypes.STRING(5000),
        allowNull: true
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
    },
    active: {
        type: sequelize_1.DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'books',
    timestamps: true,
    underscored: false
});
