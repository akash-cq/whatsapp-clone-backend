const express = require("express");
const router = express.Router();
const { authentication, isLogin, verify } = require("../middleware/auth");
const controller = require("../controller/controller");
const GroupController = require("../controller/GroupController");

const { loginLimiter, msgLimit } = require("../middleware/limit");
const upload = require("../middleware/multer");

router.post("/signup", isLogin, controller.Registartion);
router.post("/login", loginLimiter, isLogin, controller.UserLoginhandle);
router.get("/getContacts", authentication, controller.ContactsData);
router.get("/getPersonalDetail", authentication, controller.PersonalDetail);
router.get("/user/info/:id", authentication, controller.getInformation);
router.get("/authentication", verify);
router.post("/sendMsg", authentication, controller.MsgHandle);
router.post("/getMsg", authentication, controller.getMsgHandle);
router.put(
  "/upload/profileDp",
  authentication,
  upload.single("dp"),
  controller.uploadProfileDp
);
router.post(
  "/upload/msgFile",
  authentication,
  upload.single("msgFile"),
  controller.uploadMsgFile
);
router.put("/user/bio", authentication, controller.changebio);
// router.get("/download/:file", controller.downloadFile);
router.post("/group/groupcreate", authentication, GroupController.GroupCreation);
router.get("/logout", authentication, controller.logout);
router.get("/group/getgroups", authentication, GroupController.getGroups);
router.post("/group/sendMsgGroup",authentication, GroupController.GroupMsgHandle);
router.post("/group/getgroupmsg", authentication, GroupController.getGroupMsg);
module.exports = router;
