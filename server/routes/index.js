
const express = require("express")

const router = express.Router();

const {registeredUser} = require("../controlles/RegisteredUser")
const {checkEmail}  = require("../controlles/checkEmail");
const { checkPassword } = require("../controlles/checkPassword");
const { userDetails } = require("../controlles/userDetails");
const { logout } = require("../controlles/logout");
const { updateUserDetails } = require("../controlles/updateUserDetails");
const { searchUser } = require("../controlles/searchUser");

//create API
router.post("/registered",registeredUser);
// check email
router.post("/email",checkEmail);
// checkpassword
router.post("/password",checkPassword)
//getData
router.get("/user-details",userDetails)
//logout user
router.get("/logout",logout)
//update user profile
router.post("/update-user",updateUserDetails)
//Search user 
router.post("/search-user",searchUser)


module.exports = router;
