import  {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {envSettings} from '../env/index';
import {CONSTANTS} from "../constants/constants";
import {CATCH_MESSAGES} from '../constants/catchMessages';
const ENV = envSettings();

// create authentication token using JWT
const createAuthentication = async (tokenDetails) => {
    const token = jwt.sign(
        tokenDetails,
        ENV.JWT_SECRET_KEY, {
            expiresIn: "2h",
        }
    );
    return token;
}

//validate user role and auth token using JWT
const validateAuth = (roleArr:String[]) => (req:Request, res:Response, next:NextFunction) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).send({
                    success: false,
                    message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
                });
            }
            try {
                const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY);
                req.body.id = decoded.id; 
                req.body.role = decoded.role; 
                if(roleArr.includes(req.body.role)) { 
                    return next();      
                } else {
                    const error = new Error(CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
                    throw error;
                }           
            } catch (error) {
                console.log(CATCH_MESSAGES.VALIDATE_AUTH,error);
                return res.status(401).send({
                    success: false,
                    message: CONSTANTS.MESSAGES.LOGIN_REQUIRED
                });
            }
        } else {
            return res.status(401).send({
                success: false,
                message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
            });
        }
    } catch (error) {
        console.log(CATCH_MESSAGES.VALIDATE_AUTH,error);
        res.status(401).send({
            success: false,
            message: CONSTANTS.MESSAGES.LOGIN_REQUIRED
        });
    }
}


export {createAuthentication,validateAuth}