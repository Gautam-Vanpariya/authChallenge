const createError = require("http-errors");
const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index.routes");
const { responseCode } = require("./middleware/response.middleware");

const app = express();

if(app.get("env") === "production"){
    app.set("trust proxy", 1);
} else {
    app.use(logger("dev"));
}

app.use(responseCode);

// APP  SETUP
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


// APP ROUTE REQUEST
app.use("/", indexRouter);


app.all("*", function (req, res) {
    return res.status(404).json({ success: false, message: "404 page not found." });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    let message = "Something went wrong";
    if(err.status == 401 || req.app.get("env") === "development") {
        message = err.message;
    }
    message = err.message;
    return res.status(401).json({ success: false, message: message, error: err.message });
});

module.exports = app;
