const { Router } = require("express");

const profileController = require("../controllers/ProfileController");

const router = Router();

router.get("/getOwnTweets", profileController.getOwnTweets);
router.get("/getOwnReplies", profileController.getOwnReplies);
router.get("/getOwnLikes", profileController.getOwnLikes);
router.get("/getProfileContents", profileController.getProfileContents);

module.exports = router;
