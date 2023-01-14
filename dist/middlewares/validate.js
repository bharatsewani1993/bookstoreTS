"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const constants_1 = require("../constants/constants");
const getBody_1 = require("../utils/getBody");
const validate = (schema) => (req, res, next) => {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    };
    const body = (0, getBody_1.getBody)(req);
    const { error, value } = schema.validate(body, options);
    if (error) {
        const errorArr = [];
        for (const detail of error.details) {
            const tempObj = {
                [detail.path[0]]: detail.message
            };
            errorArr.push(tempObj);
        }
        return res.status(422).send({
            success: false,
            errors: errorArr,
            message: constants_1.CONSTANTS.MESSAGES.VALIDATION_ERRORS
        });
    }
    Object.assign(req.body, value);
    next();
};
exports.validate = validate;
