const { Router } = require("express");

const followController = require("../controllers/FollowController");

const router = Router();

router.put("/followUser", followController.followUser);
router.put("/unfollowUser", followController.unfollowUser);
router.get("/getFollowerList", followController.getFollowerList);
router.get("/getFollowingList", followController.getFollowingList);
module.exports = router;
