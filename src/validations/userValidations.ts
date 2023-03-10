import joi from "joi";
import {joiPassword} from "joi-password";

const CONSTANTS = require("../constants/constants");

//signup validations..
const signUpValidations = joi.object().keys({
  firstName:joi.string().required().max(200),
  lastName:joi.string().required().max(200),  
  email:joi.string().email().required(),
  phoneNumber: joi.string().required().regex(/^[0-9]{10}$/).messages({
    'string.pattern.base': CONSTANTS.MESSAGES.TEN_DIGIT_NUMBER_ALLOW
  }),
  password: joiPassword.string().min(8)
    .max(200)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
  confirmPassword: joi
    .any()
    .equal(joi.ref(CONSTANTS.MESSAGES.PASSWORD))
    .required()
    .label(CONSTANTS.MESSAGES.CONFIRM_PASSWORD)
    .options({
      messages: {
        "any.only": CONSTANTS.MESSAGES.PASSWORD_DOES_NOT_MATCH,
      },
    }),
    role: joi.string().required().valid('customer','seller')
});

//sign-in validation..
const signInValidations = joi.object().keys({
  email: joi.string().email().required(),
  password: joiPassword.required(),
});

export {signUpValidations, signInValidations}