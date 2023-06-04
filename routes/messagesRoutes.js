const { Router } = require("express");

const messagesController = require("../controllers/MessagesController");

const router = Router();

router.get("/", messagesController.getLatestMessages);
router.get("/dmList", messagesController.getDMList);
router.get("/followedList", messagesController.getFollowedList);

module.exports = router;
