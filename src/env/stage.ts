import {ENV} from '../types/env';
export let configurations: ENV;

configurations = {
    //database configurations
    type:"mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Qwerty@123",
    database: "bookstore_typescript",
    entities: ["src/models/*.js"],
    logging: true,
    synchronize: true,
    //project related configurations
    STAGE: 'LOCAL',
    PORT: 3000,
    JWT_SECRET_KEY: 'uSwiXJKUePYeqiYvAtyEXOT4MVZjSL8k',
}