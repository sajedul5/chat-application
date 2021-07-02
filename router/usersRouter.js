// external import
const express = require("express");



// internal imports
const {getUsers, addUser} = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const { addUserValidators, addUserValidationHandler} = require("../middlewares/users/usersValidators");

const router = express.Router();

//users page
router.get("/", decorateHtmlResponse("Users"), getUsers);

// add user
router.post("/", avatarUpload, addUserValidators, addUserValidationHandler, addUser);


module.exports = router;