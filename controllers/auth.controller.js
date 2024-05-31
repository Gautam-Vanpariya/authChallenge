const moment = require("moment");
const bcryptJs = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const USERS_MODEL = require("../models/users.model");
const { USER_STATUS } = require("../utils/enums");
const AUTH_JOI = require("../validations/auth.joi");


exports.login = async (req, res) => {
    const { code } = req;
    try {
        // Validation
        const { error: validationError, value: validatedPayload } = AUTH_JOI.login.body.validate(req.body);
        if (validationError) {
            return res.status(code.invalid).json({ success: false, message: validationError.message, error: "Validation Error" });
        }


        const user = await USERS_MODEL.findOne({ "is_deleted": false, "email": validatedPayload.email }).select("email password status").lean();
        if (!user) return res.status(code.invalid).json({ success: false, message: "No account found with provided information" });

        // CREDENTIAL CHECK
        if (!await bcryptJs.compare(validatedPayload.password, user.password)) {
            return res.status(code.invalid).json({ success: false, message: "Invalid credentials details. Please try again." });
        }

        
        if (user.status === USER_STATUS.INACTIVE) {
            return res.status(code.invalid).json({ success: false, message: "Your account is currently inactive. Please contact to administrator for assistance." });
        }

        let redirectUrl = "/dashboard";

        const sessionUser = {
            "_id": user._id,
            "role": user.role,
            "email": user.email,
        };
        req.session.user = sessionUser;

        return res.status(code.success).json({ success: true, message: "Login successfully", data: redirectUrl });
    } catch (err) {
        return res.status(code.internalServerError).json({ success: false, message: "An internal server error occurred.", error: err.message });
    }
};


exports.register = async (req, res) => {
    const { code } = req;
    try {
        const { error: validationError, value: validatedPayload } = AUTH_JOI.register.body.validate(req.body);
        if (validationError) {
            return res.status(code.invalid).json({ success: false, message: validationError.message, error: "Validation Error" });
        }        

        const user = await USERS_MODEL.findOne({ "is_deleted": false, "email": validatedPayload.email }).lean();
        if (user) return res.status(code.invalid).json({ success: false, message: "An account with this email address already exists. Please try a different email address." });

        // CREATE USER
        const newUser = await USERS_MODEL.create(validatedPayload);

        return res.status(code.success).json({ success: true, message: "Registered successfully", data: newUser._id });
    } catch (err) {
        return res.status(code.internalServerError).json({ success: false, message: "An internal server error occurred.", error: err.message });
    }
};



exports.forgotPassword = async (req, res) => {
    const { code } = req;
    try {
        const { error: validationError, value: validatedPayload } = AUTH_JOI.forgotPassword.body.validate(req.body);
        if (validationError) {
            return res.status(code.invalid).json({ success: false, message: validationError.message, error: "Validation Error" });
        }


        const user = await USERS_MODEL.findOne({ "is_deleted": false, "email": validatedPayload.email });
        if (!user) return res.status(code.invalid).json({ success: false, message: "No account found with the provided email address" });

        const linkid = uuidv4();
        const baseUrl = `${req.protocol}://${req.headers.host}`;
        const expireDate = moment.utc().add(2, "hours").toISOString();
        const resetLink = `${baseUrl}/resetPassword/${linkid}`;

        user.reset_token = linkid;
        user.reset_token_expires_at = expireDate;
        await user.save();
        
        
        // sendResetPasswordLink(user.email, resetLink);

        // Note: For bypass, if the mail service is not available, add a reset link in the response.
        return res.status(code.success).json({ success: true, message: "Password reset link sent successfully", data: resetLink });
    } catch (err) {
        return res.status(code.internalServerError).json({ success: false, message: "An internal server error occurred.", error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { code } = req;
    try {
        const { error: validationError, value: validatedPayload } = AUTH_JOI.resetPassword.body.validate(req.body);
        if (validationError) {
            return res.status(code.invalid).json({ success: false, message: validationError.message, error: "Validation Error" });
        }
        

        const user = await USERS_MODEL.findOne({ "is_deleted": false, "reset_token": validatedPayload.linkid });
        if (!user) return res.status(code.notFound).json({ success: false, message: "Invalid Request." });
        

        const passwordExpireAt = moment.utc(user.reset_token_expires_at);
        const currentDate = moment.utc();
        if (currentDate > passwordExpireAt) {
            return res.status(code.invalid).json({ success: false, message: "The password reset link has expired." });
        }

        user.reset_token = null;
        user.reset_token_expires_at = null;
        user.password = validatedPayload.password;

        await user.save();
        return res.status(code.success).json({ success: true, message: "Password reset successfully.", data: null });
    } catch (err) {
        return res.status(code.internalServerError).json({ success: false, message: "An internal server error occurred.", error: err.message });
    }
};

