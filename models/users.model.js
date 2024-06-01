const mongoose = require("mongoose");
const bcryptJs = require("bcryptjs");

const SALT_HASH = 10;
const { USER_STATUS } = require("../utils/enums");

const schema = new mongoose.Schema({
    // BASIC INFO
    first_name              : { type: String, require: true, trim: true, max: 128, default: null },
    last_name               : { type: String, require: true, trim: true, max: 128, default: null },
    email                   : { type: String, require: true, trim: true, lowercase: true, max: 128, default: null },
    status                  : { type: String, enum: [...Object.values(USER_STATUS)], default: USER_STATUS.ACTIVE },
    // SETTING
    password                : { type: String, require: true, trim: true, default: null },
    reset_token             : { type: String, trim: true, default: null },
    reset_token_expires_at  : { type: Date, default: null },
    registration_token               : { type: String, trim: true, default: null },
    registration_token_expire_at      : { type: Date, default: null },
    // META
    is_deleted              : { type: Boolean, default: false }
},
{
    timestamps             : {
        createdAt   : 'created_at',
        updatedAt   : 'updated_at'
    }
});

schema.index({ created_at: -1 });
schema.index({ email: 1 });

// Encrypt password
schema.pre(/^save|findOneAndUpdate$/, async function (next) {
    try {
        if (this.op === "findOneAndUpdate") {
            const update = this.getUpdate();
            if (update["$set"] && update["$set"].password) {
                update["$set"].password = await bcryptJs.hash(update["$set"].password, SALT_HASH);
                this.setUpdate(update);
            }
        } else if (this.isModified("password")) {
            this.password = await bcryptJs.hash(this.password, SALT_HASH);
        }
        next();
    } catch (err) {
        next(err); // Ensure proper error handling
    }
});

module.exports = mongoose.model("users", schema, "users");
