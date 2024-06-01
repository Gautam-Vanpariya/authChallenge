const router = require("express").Router();
const API_AUTH_CTRL = require("../../../controllers/auth.controller");
const { isAuth } = require("../../../middleware/auth.middleware");

// REGSITER
router.post("/register", API_AUTH_CTRL.register);
// LOGIN
router.post("/login", API_AUTH_CTRL.login);
// CHANGE PASSWORD
router.post("/changePassword", isAuth, API_AUTH_CTRL.changeUserPassword);
// FORGOT
router.post("/forgotPassword", API_AUTH_CTRL.forgotPassword);
// RESET
router.post("/resetPassword", API_AUTH_CTRL.resetPassword);

module.exports = router;