type mysql = 'mysql';

export interface ENV {
    //database related configurations
    type:mysql,
    host:string,
    port:number,
    username:string,
    password:string,
    database:string,
    entities:string[],
    logging: boolean,
    synchronize: boolean,
    //project related configurations
    STAGE:string,
    PORT: number,
    JWT_SECRET_KEY:string,
}