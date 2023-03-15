const { Router } = require("express");

const appUserController = require("../Controllers/appUserController");

const router = Router();

router.get("/", appUserController.getAppUsers);
router.post("/", appUserController.addUser);
// router.get("/:user_id", appUserController.getUserById);
router.get("/basicUserInfo", appUserController.getBasicUserInfo);
router.put("/basicUserInfo", appUserController.addBasicUserInfo);

module.exports = router;
