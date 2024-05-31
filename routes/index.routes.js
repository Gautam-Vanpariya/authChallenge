const router = require("express").Router();

const { requestLogger } = require("../middleware/request.middleware");

router.use("/api/v1", requestLogger, require("./api/index.routes"));

module.exports = router;