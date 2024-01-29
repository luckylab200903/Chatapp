const express=require("express")
const { sendmessage, allMessages } = require("../controllers/messageController")
const { protect } = require("../middlewares/authMiddleware")
const router=express.Router()



router.route("/").post(protect,sendmessage)
router.route("/:chatId").get(protect,allMessages)
module.exports=router