const express=require("express");
const {registerUser,authUser,allUsers}=require("../Controllers/UserController");
const {protect} =require("../MiddleWare/authMiddleWare");

const router= express.Router();


router.route('/').post(registerUser).get(protect,allUsers);
 router.post('/login',authUser);

module.exports=router;