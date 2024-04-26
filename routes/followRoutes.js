const { Router } = require("express");

const followController = require("../controllers/FollowController");

const router = Router();

router.put("/followUser", followController.followUser);
router.put("/unfollowUser", followController.unfollowUser);
router.get("/getFollowStatus", followController.getFollowStatus);
module.exports = router;
