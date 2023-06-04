const { Router } = require("express");

const messagesController = require("../controllers/MessagesController");

const router = Router();

router.get("/", messagesController.getLatestMessages);
router.get("/dmList", messagesController.getDMList);

module.exports = router;
