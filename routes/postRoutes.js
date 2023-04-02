const { Router } = require("express");

const postController = require("../controllers/postController");

const router = Router();

router.get("/", postController.getPosts);
router.post("/", postController.addPost);
router.post("/likePost", postController.likePost);
router.delete("/unlikePost", postController.unlikePost);

module.exports = router;
