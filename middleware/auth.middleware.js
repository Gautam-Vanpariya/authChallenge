const USERS_MODEL = require("../models/users.model");

const errorResponseHandler = (req, res, message, redirectUrl = "/login", code = 401) => {
    const { baseUrl, session } = res.req;
    if (baseUrl.includes("/api/")) {
        return res.status(code).json({ success: false, message });
    } else {
        if (session.user) req.flash("error", message);
        return res.redirect(redirectUrl);
    }
};

exports.isAuth = async (req, res, next) => {
    const { session } = req;
    try {
        if (!session || !session.user) {
            return errorResponseHandler(req, res, "Your session has expired. Please log in again.", "/login");
        }

        const user = await USERS_MODEL.findOne({ _id: session.user._id }).select("-password -reset-token -reset_token_expires_at").lean();
        if (!user) {
            delete req.loggedInUser;
            req.session.destroy();
            return errorResponseHandler(req, res, "Invalid credentials. Please check your email and password and try again.", "/login");
        }

        const loggedInUser = JSON.parse(JSON.stringify(user));

        req.loggedInUser = loggedInUser;
        res.locals.loggedInUser = loggedInUser;
        
        next();
    } catch (err) {
        next(err);
    }
};

exports.isNotLoggedIn = async (req, res, next) => {
    const { session } = req;
    if (session && session.user) {
        return res.redirect("/dashboard");
    }
    next();
};

