const router = require("express").Router();
const API_USERS_CTRL = require("../../../controllers/users.controller");
const { isAuth } = require("../../../middleware/auth.middleware");

// Update profile
router.get("/myPofile", isAuth, API_USERS_CTRL.getloggedInUser);
router.get("/list",isAuth,  API_USERS_CTRL.getAllUsers);


module.exports = router;