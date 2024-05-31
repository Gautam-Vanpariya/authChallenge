const { USER_STATUS } = require("../utils/enums");

module.exports = {
    systemConfig    : {
        HOST            : "http://localhost:3000",
        PORT            : 3000,
        JWT_EXPIRE_IN   : "15d"
    },
    emailConfig: {
        infoMailId: "info@domain.com",
        noreplyMailId: "noreply@domain.com",
        supportMailId: "suport@domain.com",
    },
    devEmail   : "contact2manishyadav@gmail.com",
    defaultUsers: [
        {
            first_name: "ABC",
            last_name: "XYZ",
            email: "abcxyz@gmail.com",
            status: USER_STATUS.ACTIVE,
            password: "password123",
        }
    ],
};

