const { Router } = require("express");

const appPostController = require("../Controllers/postController");

const router = Router();

router.get("/", appPostController.getPosts);
router.post("/", appPostController.addPost);
router.post("/likePost", appPostController.likePost);
router.delete("/unlikePost", appPostController.unlikePost);

module.exports = router;
