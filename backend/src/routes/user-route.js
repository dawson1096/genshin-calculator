const express = require("express");
const UserCtrl = require("../controllers/user-ctrl");

const userRouter = express.Router();

userRouter.post("/register", UserCtrl.createUser);
userRouter.post("/login", UserCtrl.loginUser);

userRouter.post("/user", UserCtrl.checkToken, UserCtrl.updateUserData);
userRouter.get("/user", UserCtrl.checkToken, UserCtrl.getUserData);

userRouter.get("/data", UserCtrl.getGeneralData);

userRouter.get("/all-req", UserCtrl.checkToken, UserCtrl.getAllReq);
userRouter.get("/character", UserCtrl.checkToken, UserCtrl.getCalcAllCharReq);
userRouter.get("/character/:name", UserCtrl.checkToken, UserCtrl.getCalcCharReq);
userRouter.get("/character/:name/talent", UserCtrl.checkToken, UserCtrl.getCalcTalentReq);
userRouter.get("/weapon", UserCtrl.checkToken, UserCtrl.getCalcAllWeaponReq);
userRouter.get("/weapon/:name", UserCtrl.checkToken, UserCtrl.getCalcWeaponReq);
userRouter.get("/image", UserCtrl.getImgPath);

module.exports = userRouter;