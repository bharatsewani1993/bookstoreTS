"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const index_1 = require("../env/index");
const ENV = (0, index_1.envSettings)();
const sequelize = new sequelize_1.default(ENV.DATABASE_NAME, ENV.DATABASE_USER, ENV.DATABASE_PASSWORD, {
    dialect: ENV.DIALECT,
    host: ENV.DATABASE_HOST,
    logging: ENV.LOGGING,
});
exports.sequelize = sequelize;
sequelize.authenticate()
    .then(function () {
    console.log("CONNECTED! ");
})
    .catch(function (err) {
    console.log("SOMETHING went wrong");
});
