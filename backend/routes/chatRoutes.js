const express=require("express");
const { protect } = require("../MiddleWare/authMiddleWare");
const {accessChat}=require("../Controllers/chatController");
const {fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}=require("../Controllers/chatController");
const router=express.Router();

router.route("/").post(protect,accessChat);
router.route("/").get(protect,fetchChats);
router.route("/group").post(protect,createGroupChat);
router.route("/rename").put(protect,renameGroup);
router.route("/groupremove").put(protect,removeFromGroup);
router.route("/groupadd").put(protect,addToGroup);

module.exports=router;