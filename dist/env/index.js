"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSettings = void 0;
const local_1 = __importDefault(require("./local"));
const development_1 = __importDefault(require("./development"));
const production_1 = __importDefault(require("./production"));
const stage_1 = __importDefault(require("./stage"));
const envSettings = () => {
    switch (process.env.APP_ENV) {
        case 'local':
            return local_1.default;
        case 'dev':
            return development_1.default;
        case 'production':
            return production_1.default;
        case 'stage':
            return stage_1.default;
        default:
            return local_1.default;
    }
};
exports.envSettings = envSettings;
