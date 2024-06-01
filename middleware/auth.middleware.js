const jwt = require("jsonwebtoken");
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
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(' ')[1];
    
            // VERIFY TOKEN
            const { userId } = jwt.verify(token, process.env.SECRET_KEY);
    
            //GET USER FROM TOKEN
            const user = await USERS_MODEL.findById(userId).select("-password -reset_token -reset_token_expires_at -registration_token_expire_at -registration_token").lean();
            const loggedInUser = JSON.parse(JSON.stringify(user));
    
            req.loggedInUser = loggedInUser;
            res.locals.loggedInUser = loggedInUser;
            
            next();
        } catch (err) {
            next(err);
        }
    }
    if (!token) {
        res.status(401).json({success: false, message: "Unautorised user or token is ot provided"})
    }
};

exports.isNotLoggedIn = async (req, res, next) => {
    const { session } = req;
    if (session && session.user) {
        return res.redirect("/dashboard");
    }
    next();
};

