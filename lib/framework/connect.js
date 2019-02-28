"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const http_1 = __importDefault(require("http"));
const request_1 = __importDefault(require("../http/request"));
const initialize_1 = __importDefault(require("../middleware/initialize"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
function connectMiddleware() {
    connectMiddleware.__monkeypatchNode();
    return {
        initialize: initialize_1.default,
        authenticate: authenticate_1.default,
    };
}
connectMiddleware.__monkeypatchNode = function () {
    http_1.default.IncomingMessage.prototype.login = http_1.default.IncomingMessage.prototype.logIn =
        request_1.default.logIn;
    http_1.default.IncomingMessage.prototype.logout = http_1.default.IncomingMessage.prototype.logOut =
        request_1.default.logOut;
    http_1.default.IncomingMessage.prototype.isAuthenticated = request_1.default.isAuthenticated;
    http_1.default.IncomingMessage.prototype.isUnauthenticated = request_1.default.isUnauthenticated;
};
module.exports = connectMiddleware;
//# sourceMappingURL=connect.js.map