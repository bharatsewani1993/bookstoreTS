import express from 'express';
const router = express.Router();
import {signUpValidations,signInValidations} from '../validations/userValidations';
import {signUp,signIn,getOrders} from '../controller/userController';
import {CONSTANTS} from "../constants/constants";
import {validate} from '../middlewares/validate';
import {validateAuth} from '../middlewares/auth';

//user signup  
router.post('/sign-up',validate(signUpValidations),signUp);

//user login  
router.post('/sign-in',validate(signInValidations),signIn);

//list all orders of user.
router.get('/orders',validateAuth([CONSTANTS.ROLE.CUSTOMER]),getOrders);

module.exports = router;