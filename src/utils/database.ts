import { DataSource } from "typeorm";
import {envSettings} from  '../env/index';
const ENV = envSettings();

export const dataSource = new DataSource({
    type: ENV.type,
    host: ENV.host,
    port: ENV.port,
    username: ENV.username,
    password: ENV.password,
    database: ENV.database,
    entities: ENV.entities,
    logging: ENV.logging,
    synchronize: ENV.synchronize,
})