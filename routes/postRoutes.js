const { Router } = require("express");

const postController = require("../controllers/PostController");

const router = Router();

router.get("/", postController.getPosts);
router.post("/", postController.addPost);
router.post("/likePost", postController.likePost);
router.delete("/unlikePost", postController.unlikePost);
router.get("/fetchPost", postController.getPost);
router.get("/fetchReplies", postController.getReplies);

module.exports = router;
