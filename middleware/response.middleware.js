
exports.responseCode = (req, res, next) => {
    req.code = {
        success: 200,
        unauthorized: 401, // 401 Unauthorized
        invalid: 403,  // 403 Forbidden
        notFound: 404,  // 404 Not Found
        internalServerError: 501 // 501 Not Implemented
    };
    next();
};


// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses