"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const authenticator_1 = __importDefault(require("./authenticator"));
const session_1 = __importDefault(require("./strategies/session"));
const passport_strategy_1 = __importDefault(require("passport-strategy"));
const passport = new authenticator_1.default();
module.exports = Object.assign(passport, {
    Passport: authenticator_1.default,
    Authenticator: authenticator_1.default,
    Strategy: passport_strategy_1.default,
    strategies: {
        SessionStrategy: session_1.default,
    },
});
//# sourceMappingURL=index.js.map