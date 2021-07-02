//external import
const {check, validatonResult} = require("express-validator");
const createHttpError = require("http-errors");
const path = require("path");
const {unlink} = require("fs");

// internal import
const User = require("../../models/People");


// add user
const addUserValidators = [
    check("name")
    .isLength({min: 1})
    .withMessage("Name is required!")
    .isAlpha("en-US", {ignore: " -"})
    .withMessage("Name must not contain anything other alphabet")
    .trim(),
   check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom( async (value) => {
        try {
            
            const user = await User.findOne({email: value});
            if(user){
                throw createHttpError("Email already is use!");
            }

        }catch (err){
            throw createHttpError(err.message);
        }
    }), 
    check("mobile")
    .isMobilePhone("bn-BD", {
        strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom( async (value) => {
        try {
            
            const user = await User.findOne({mobile: value});
            if(user){
                throw createHttpError("Mobile already is use!");
            }

        }catch (err){
            throw createHttpError(err.message);
        }
    }),
   check("password")
    .isStrongPassword()
    .withMessage(
        "Password must be at 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ), 
];

const addUserValidationHandler = function (req, res, next){
    const errors = validatonResult(req);
    const mappedErrors = errors.mapped();
    if(Object.keys(mappedErrors).length === 0){
        next();
    }else{
        // remove uploaded files
        if(req.files.length > 0){
            const {filename} = req.files[0];
            unlink(
                path.join(__dirname, `/../uploads/avatars/${filename}`),
                (err) => {
                    if(err) console.log(err);
                }
            );
        }

        // response the errors
        res.status(500).json({
            errors:mappedErrors,
        });
    }
};


module.exports = {
    addUserValidators,
    addUserValidationHandler,
}