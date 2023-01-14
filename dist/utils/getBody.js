"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBody = void 0;
const getBody = (req) => {
    if (req.method === 'GET') {
        return req.query;
    }
    else {
        return req.body;
    }
};
exports.getBody = getBody;
