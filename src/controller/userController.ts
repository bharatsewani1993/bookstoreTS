import {Sequelize} from 'sequelize';
import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import {CONSTANTS} from "../constants/constants";
import {CATCH_MESSAGES} from '../constants/catchMessages';
import {sequelize} from '../utils/database';

import bookModel from '../models/bookModel';
import userModel from '../models/userModel';
import orderModel from '../models/orderModel';
import orderItemsModel from '../models/orderItemsModel';

import {createAuthentication} from '../middlewares/auth';

//Common signup for seller and customer
const signUp = async (req:Request, res:Response, next:NextFunction) => {
    try {
      const firstName = req.body.firstName;    
      const lastName = req.body.lastName;        
      const email = req.body.email;
      const phoneNumber = req.body.phoneNumber;      
      const termsAndCondition = req.body.termsAndCondition;
      const role = req.body.role;
      let password = req.body.password;   

      password = await bcrypt.hash(password, 10);
  
      const userObj = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        termsAndCondition: termsAndCondition,
        password: password,
        role:role
      };
  
      const duplicateEmail = await userModel.findOne({
        where: {
          email: email,
        },
      });
  
      if (!duplicateEmail) {
        const result = await userModel.create(userObj); 
         
        userModel.prototype.toJSON = function () {
          var values = Object.assign({}, this.get());
          delete values.password;
          return values;
        };       

        res.status(200).send({
          success: true,
          message: CONSTANTS.MESSAGES.USER_CREATED,
          data:  result
        });

      } else {
        res.status(422).send({
          success: false,
          message: CONSTANTS.MESSAGES.EMAIL_ALREADY_REGISTERED,
        });
      }
    } catch (err:unknown) {
      console.log(err);
      res.status(401).send({
        success: false,
        message: CONSTANTS.MESSAGES.USER_CREATION_FAILED,
      });
    }
  };
  
  //common sign-in for seller and customer
const signIn = async (req:Request, res:Response, next:NextFunction) => {
      try {
          const email = req.body.email;
          const password = req.body.password;
  
          const user = await userModel.findOne({
              where: {
                  email: email,
                  active: 1,
              }
          });
  
          if (user) {
              const match = await bcrypt.compare(password, user.password);
              if (match) {
                  const authObj = {
                    id:user.id,
                    role:user.role
                  }
                  let authToken = await createAuthentication(authObj);
                  res.status(200).send({
                      success: true,
                      authToken: authToken,
                      message:CONSTANTS.MESSAGES.LOGGED_IN,
                  });  
              } else {
                const error = new Error(CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
                throw error;
              } 
          }  else {
            const error = new Error(CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
            throw error;
          } 
      } catch (error:unknown) {
          console.log(error);
          res.status(400).send({
              success: false,
              message: CONSTANTS.MESSAGES.INVALID_CREDENTIALS
          });
      }
}

const getOrders = async (req:Request,res:Response,next:NextFunction) => {
  try {
      const customerId = req.body.id;

      const orderDetails = await sequelize.query(`select orders.id as 'orderId', orders.customerId as 'customerId',orders.createdAt,
      orderitems.bookId as 'BookId', orderitems.qty as 'BookQuantity',
      books.bookTitle,books.category,books.bookAuthor,
      books.bookImage,books.bookISBN,books.bookPrice
      from orders 
      INNER JOIN orderitems
      on orders.id = orderitems.orderId
      INNER JOIN books
      on books.id = orderitems.bookId
      inner join users
      on users.id = orders.customerId
      where customerId = ${customerId} AND orders.active = 1`,{
        replacements: {customerId: customerId},
        type: sequelize.QueryTypes.SELECT,
        raw:true  
      });      
      
      res.status(200).send({
        success: true,
        data: orderDetails,
        message:CONSTANTS.MESSAGES.ORDER_LISTED,
      });     
     
  } catch (error:unknown) {
      console.log(CATCH_MESSAGES.GET_ORDERS, error);
      res.status(400).send({
          success: false,
          message: CONSTANTS.MESSAGES.FAILED_TO_LIST_ORDERS
      });
  }
}
  

export {signUp,signIn,getOrders}