const { Router } = require("express");

const followController = require("../controllers/FollowController");

const router = Router();

router.put("/followUser", followController.followUser);
router.put("/unfollowUser", followController.unfollowUser);

module.exports = router;
