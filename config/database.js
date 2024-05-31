 const mongoose = require("mongoose");

const USERS_MODEL = require("../models/users.model");
const { defaultUsers } = require("./appSetting");


// connect with Mongoose
exports.connectMongoose = async() => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        await mongoose.connect(process.env.MONGODB_URI, options);
        mongoose.Promise = global.Promise;
        console.info("Database with 'Mongoose' connected successfully...");
        await createDefaultUser();

    } catch (err) {
        console.error("Error while connecting database with 'Mongoose'", err);
    }
};

async function createDefaultUser() {
    const defaultUserList = defaultUsers;
    try {
        for (const defaultUser of defaultUserList) {
            const userInfo = await USERS_MODEL.findOne({ "email": defaultUser.email }).select("_id").lean();
            if (!userInfo) {
                const insertRecord = await USERS_MODEL.create(defaultUser);
                console.info(`:: New User Inserted:: Email[${insertRecord.email}] ::>`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}