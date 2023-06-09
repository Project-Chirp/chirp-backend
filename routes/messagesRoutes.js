const { Router } = require("express");

const messagesController = require("../controllers/MessagesController");

const router = Router();

router.get("/", messagesController.getLatestMessages);
router.get("/:userId1/:userId2", messagesController.getDirectMessage);

module.exports = router;
