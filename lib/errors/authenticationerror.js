"use strict";
class AuthenticationError extends Error {
    constructor(message, status) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'AuthenticationError';
        this.message = message;
        this.status = status || 401;
    }
}
module.exports = AuthenticationError;
//# sourceMappingURL=authenticationerror.js.map