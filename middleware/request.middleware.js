function shouldLogRequest(req) {
    return req.originalUrl && !isStaticOrAssetsUrl(req.originalUrl);
}

function isStaticOrAssetsUrl(url) {
    return url.includes("/static/") || url.includes("/assets/");
}

function getCurrentDateTime() {
    return new Date().toLocaleString(undefined, { timeZone: "Asia/Kolkata" });
}

function logIfNotEmpty(label, data) {
    if (!isEmptyObject(data)) {
        console.log(`\n${label}   : `);
        console.log(data);
    }
}

function logRequestBody(body) {
    if (!isEmptyObject(body)) {
        console.log("\nBODY   : ");
        const sensitiveFields = ["password", "confirm_password"];
        const sanitizedBody = sanitizeSensitiveFields(body, sensitiveFields);
        console.log(sanitizedBody);
    }
}

function sanitizeSensitiveFields(data, sensitiveFields) {
    const sanitizedData = { ...data };
    for (const field of sensitiveFields) {
        if (sanitizedData[field]) {
            sanitizedData[field] = "*****";
        }
    }
    return sanitizedData;
}

function isEmptyObject(value) {
    return Object.keys(value).length === 0 && value.constructor === Object;
}


// Print request data with header info
exports.requestLogger = async (req, res, next) => {
    if (shouldLogRequest(req)) {
        console.log("\x1b[36m%s\x1b[0m", "\n##############################################");
        console.log("METHOD       :", req.method);
        console.log("HEADER       :", req.headers["user-agent"]);
        console.log("URL          :", req.originalUrl);
        console.log("DATE TIME    :", getCurrentDateTime());

        logIfNotEmpty("QUERY", req.query);
        logIfNotEmpty("PARAMS", req.params);
        logRequestBody(req.body);
        console.log("\x1b[36m%s\x1b[0m", "\n##############################################");
    }
    next();
};
