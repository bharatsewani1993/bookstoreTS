import {Sequelize} from "sequelize";
import {envSettings} from '../env/index';
const ENV = envSettings();
 
const sequelize = new Sequelize(ENV.DATABASE_NAME, ENV.DATABASE_USER, ENV.DATABASE_PASSWORD, {
  dialect: 'mysql', //ENV.DIALECT,
  host: ENV.DATABASE_HOST,
  logging: ENV.LOGGING,
});
 
sequelize.authenticate()
    .then(function () {
      console.log("CONNECTED! ");
    })
    .catch(function (err) {
      console.log("SOMETHING went wrong");
    });
 
 
export {sequelize}