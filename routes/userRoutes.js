const { Router } = require("express");

const userController = require("../controllers/UserController");

const router = Router();

router.get("/", userController.getUserInfo);
router.put("/:userId", userController.updateUserInfo);
router.get("/searchUsers", userController.searchUsers);

module.exports = router;
