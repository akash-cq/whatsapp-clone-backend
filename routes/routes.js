const express = require("express");
const router = express.Router();
const {authentication, verify} = require("../middleware/auth")
const controller = require("../controller/controller")
router.post("/signup",controller.Registartion)
router.post("/login",controller.UserLoginhandle)
router.get("/getContacts",authentication, controller.ContactsData)
router.get("/getPersonalDetail",authentication, controller.PersonalDetail);
router.get("/user/info/:id", authentication, controller.getInformation);
router.get("/authentication", verify);
router.post("/sendMsg",authentication,controller.MsgHandle)
router.post("/getMsg", authentication, controller.getMsgHandle);
module.exports = router
