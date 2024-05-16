const { Router } = require("express");

const messagesController = require("../controllers/MessagesController");

const router = Router();

router.get("/", messagesController.getConversationList);
router.get("/getModalConversations", messagesController.getModalConversations);
router.get("/followedList", messagesController.getFollowedList);
router.get("/:userId2", messagesController.getOtherUser);
router.get("/:userId1/:userId2", messagesController.getDirectMessage);
router.post("/", messagesController.addMessage);

module.exports = router;
