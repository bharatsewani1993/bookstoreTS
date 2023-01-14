"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
class userModel extends sequelize_1.Model {
}
userModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    role: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    active: {
        type: sequelize_1.DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'users',
    timestamps: true,
});
userModel.associate = (db) => {
};
module.exports = userModel;
