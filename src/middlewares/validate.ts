import {Request, Response, NextFunction} from 'express';
import {CONSTANTS} from '../constants/constants';
import {getBody} from '../utils/getBody';

const validate = (schema:any) => (req:Request, res:Response, next:NextFunction) => {

  // schema options
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  //from where to get the data
  const body = getBody(req); 

  //validate the data
  const {
    error,
    value
  } = schema.validate(body, options);
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
      message: CONSTANTS.MESSAGES.VALIDATION_ERRORS
    });
  }
  Object.assign(req.body, value);    
  next();  
}

export {validate};
