import express from 'express';
const router = express.Router();
import {bookValidations} from '../validations/bookValidations';
import {deleteOrderValidations} from '../validations/orderValidations';
import {uploadBook,listSellerBooks,listAllBooks,createOrder,deleteOrder} from '../controller/storeController';
import {validateAuth} from '../middlewares/auth';
import {CONSTANTS} from '../constants/constants';
import {validate} from '../middlewares/validate';

//upload book  
router.post('/upload-book',validateAuth([CONSTANTS.ROLE.SELLER]),validate(bookValidations),uploadBook)

//get books uploaded by seller
router.get('/list',validateAuth([CONSTANTS.ROLE.SELLER]),listSellerBooks);

//get all books of all sellers...
router.get('/',listAllBooks);

//Create order
router.post('/order',validateAuth([CONSTANTS.ROLE.CUSTOMER]),createOrder);

//Delete order
router.delete('/order',validateAuth([CONSTANTS.ROLE.CUSTOMER]),validate(deleteOrderValidations),deleteOrder);


module.exports = router;