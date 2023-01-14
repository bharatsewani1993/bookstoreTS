import joi from "joi";

//check if user is uploading a valid base64 image..
const validImage = (value:string,helper:joi.CustomHelpers) => {
  let bufferObj = Buffer.from(value, "base64");
  if(bufferObj){
    return value;
  } else {
    return helper.message({"error":"Please upload a valid image"});
  }
}

//validation for book...
const bookValidations = joi.object().keys({
  bookTitle:joi.string().required().max(200),
  bookAuthor:joi.string().required().max(200),  
  bookPrice:joi.number().required(),
  quantity:joi.number().required().min(1).max(99999),
  category: joi.string().required().max(200),
  bookISBN: joi.string().required().max(10),
  bookImage:joi.string().required().custom(validImage)
});

export{bookValidations};