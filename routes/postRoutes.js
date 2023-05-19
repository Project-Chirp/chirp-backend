const { Router } = require("express");

const postController = require("../controllers/PostController");

const router = Router();

router.get("/", postController.getPosts);
router.post("/", postController.addPost);
router.post("/likePost", postController.likePost);
router.delete("/unlikePost", postController.unlikePost);
router.get("/getOwnTweets", postController.getOwnTweets);
router.get("/getOwnReplies", postController.getOwnReplies);
router.get("/getOwnLikes", postController.getOwnLikes);
router.get("/getTweetCount", postController.getTweetCount);

module.exports = router;
