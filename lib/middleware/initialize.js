"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initializeFactory(passport) {
    return function initialize(req, res, next) {
        if (passport) {
            req._passport = {
                instance: passport,
            };
            if (req.session && req.session[passport._key]) {
                req._passport.session = req.session[passport._key];
            }
        }
        next();
    };
}
exports.default = initializeFactory;
//# sourceMappingURL=initialize.js.map