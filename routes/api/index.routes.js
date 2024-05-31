const router = require("express").Router();
const { isAuth } = require("../../middleware/auth.middleware");


router.use("/auth", require("./auth/index.routes"));

//  AUTH REQUEST
router.use("/users", require("./users/index.routes"));


module.exports = router;