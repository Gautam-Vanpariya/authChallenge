const DATATABLE_WEB = require("../_helpers/web.dataTable");

const USERS_MODEL = require("../models/users.model");
const USERS_JOI = require("../validations/users.joi");


exports.getUserDataTableList = async (req, res) => {
    let { body } = req;
    try {
        // DEFAULT
        const modelObj = USERS_MODEL;
        let sorting = { "createdAt": -1 };
        let searchFields = { "regex": ["first_name", "last_name", "email"] };

        let condition = { is_deleted: false};
        let projection = { "__v": 0, "updated_at": 0 };
        let populate = [];
        
        // DATE RANGE FILTER
        if(body.startDate && body.endDate){
            condition.createdAt = { "$gte": new Date(body.startDate), "$lt": new Date(body.endDate) };
        }

        // FILTER
        const statusFilter = body.statusFilter;
        if (statusFilter !== "ALL") condition.status = statusFilter;

        // FINAL Query
        let dbQuery = {
            "conditionQuery": condition,
            "searchFields": searchFields,
            "projectionQuery": projection,
            "sortingQuery": sorting,
            "populateQuery": populate
        };
        const afterSaveCB = null;
        DATATABLE_WEB.fetchDatatableRecordsWithMongoosePopulate(req, res, modelObj, dbQuery, afterSaveCB);
    }catch (err) {
        console.log("CATCH ::fn[getUserDataTableList]:::>", err);
        return res.send({ success: false, message: "Something went wrong", error: err.message, data: [] });
    }
};

exports.editUserDetials = async (req, res) => {
    const { code, params } = req;
    try {
        const userId = params.id;
        
        // validation
        const { error: validationError, value: validatedPayload } = USERS_JOI.editUserDetials.body.validate(req.body);
        if (validationError) {
            return res.status(code.invalid).json({ success: false, message: validationError.message });
        }
        const requestedEmail = validatedPayload.email;

        const user = await USERS_MODEL.findOne({ "_id": userId }).lean();
        if (!user) return res.status(code.invalid).json({ success: false, message: "User not found." });

        if(user.email !== requestedEmail){
            const docCount = await USERS_MODEL.countDocuments({ "email": requestedEmail });
            if (docCount === 1) {
                return res.status(code.invalid).json({ success: false, message: "Oops! Email id is already taken. Please try a different one." });
            }
        }
        
        await USERS_MODEL.findOneAndUpdate({ "_id": user._id }, { "$set": validatedPayload });

        return res.status(code.success).json({ success: true, message: "Updated successfully.", data: null });
    } catch (err) {
        return res.status(code.internalServerError).json({ success: false, message: "An internal server error occurred.", error: err.message });
    }
};

exports.bulkDeleteUsers = async (req, res) => {
    const { loggedInUser, code } = req;
    try {
        const userId = loggedInUser._id;
        const { actionList } = req.body;

        // Check if any documents match the given condition
        const conditionQuery = { "_id": { "$in": actionList } };
        const docCount = await USERS_MODEL.countDocuments(conditionQuery);
        if (docCount === 0) {
            return res.status(code.invalid).json({ success: false, message: "Ensure you have selected at least one row." });
        }

        // Update documents
        const updatePayload = { "$set": { "is_deleted": true } };
        await USERS_MODEL.updateMany(conditionQuery, updatePayload);

        return res.status(code.success).json({ success: true, message: "Users deleted successfully.", data: null });
    } catch (err) {
        return res.status(code.internalServerError).json({ success: false, message: "An internal server error occurred.", error: err.message });
    }
};

