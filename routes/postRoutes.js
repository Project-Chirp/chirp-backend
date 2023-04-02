const { Router } = require("express");

const postController = require("../controllers/postController");

const router = Router();

router.get("/", postController.getPosts);
router.post("/", postController.addPost);

module.exports = router;
