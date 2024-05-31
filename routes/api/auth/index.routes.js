const router = require("express").Router();
const API_AUTH_CTRL = require("../../../controllers/auth.controller");

// LOGIN
router.post("/login", API_AUTH_CTRL.login);
// REGSITER
router.post("/register", API_AUTH_CTRL.register);
// FORGOT
router.post("/forgotPassword", API_AUTH_CTRL.forgotPassword);
// RESET
router.post("/resetPassword", API_AUTH_CTRL.resetPassword);

module.exports = router;