const { Router } = require("express");

const postController = require("../controllers/postController");

const router = Router();

router.get("/", postController.getPosts);
router.post("/", postController.addPost);
router.post("/likePost", appPostController.likePost);
router.delete("/unlikePost", appPostController.unlikePost);

module.exports = router;
