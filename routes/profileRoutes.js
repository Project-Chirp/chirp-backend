const { Router } = require("express");

const profileController = require("../controllers/ProfileController");

const router = Router();

router.get("/getUserPosts", profileController.getUserPosts);
router.get("/getUserReplies", profileController.getUserReplies);
router.get("/getUserLikes", profileController.getUserLikes);
router.get("/getProfileContents", profileController.getProfileContents);
router.get("/getFollowStatus", profileController.getFollowStatus);
router.put("/followUser", profileController.followUser);
router.put("/unfollowUser", profileController.unfollowUser);

module.exports = router;
