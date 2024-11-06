const { Router } = require("express");

const profileController = require("../controllers/ProfileController");

const router = Router();

router.put("/", profileController.editProfile);
router.get("/getProfileContents", profileController.getProfileContents);
router.get("/getUserPosts", profileController.getUserPosts);
router.get("/getUserReplies", profileController.getUserReplies);
router.get("/getUserLikes", profileController.getUserLikes);

module.exports = router;
