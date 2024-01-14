const express=require("express");
const {protect}= require("../MiddleWare/authMiddleWare");
const {sendMessage,allMessages}=require("../Controllers/MessageController");
const router=express.Router();

router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,allMessages);

module.exports=router;