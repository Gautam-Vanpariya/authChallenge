const DATATABLE_WEB = require("../_helpers/web.dataTable");

const USERS_MODEL = require("../models/users.model");
const USERS_JOI = require("../validations/users.joi");

exports.getloggedInUser = async (req, res) => {
    const { code } = req;
    try {

        const user = await USERS_MODEL.findOne({_id: req.loggedInUser._id, is_deleted: false}).select("-_id first_name last_name email email");
        
        return res.status(code.success).json({ success: true, message: "Data retrived scuccessfully", data: user });
    } catch (err) {
        return res.status(code.internalServerError).json({ success: false, message: "An internal server error occurred.", error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    const { code } = req;
    try {

        const users = await USERS_MODEL.find({is_deleted: false}).select("-_id first_name last_name email email");
        
        return res.status(code.success).json({ success: true, message: "Data retrived scuccessfully", data: users });
    } catch (err) {
        return res.status(code.internalServerError).json({ success: false, message: "An internal server error occurred.", error: err.message });
    }
};



