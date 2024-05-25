const { Router } = require("express");

const messagesController = require("../controllers/MessagesController");

const router = Router();

router.get("/", messagesController.getConversationList);
router.get("/getModalConversations", messagesController.getModalConversations);
router.get("/followedList", messagesController.getFollowedList);
router.get("/:otherUserId", messagesController.getOtherUser);
router.get("/:currentUserId/:otherUserId", messagesController.getDirectMessage);
router.post("/", messagesController.addMessage);

module.exports = router;
