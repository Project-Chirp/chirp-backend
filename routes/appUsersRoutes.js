const { Router } = require("express");

const appUserController = require("../Controllers/appUserController");

const router = Router();

router.get("/", appUserController.getAppUsers);
router.post("/", appUserController.addUser);
router.get("/:user_id", appUserController.getUserById);

module.exports = router;
