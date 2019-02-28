"use strict";
module.exports = function initializeFactory(passport) {
    return function initialize(req, res, next) {
        req._passport = {
            instance: passport,
        };
        if (req.session && req.session[passport._key]) {
            req._passport.session = req.session[passport._key];
        }
        next();
    };
};
//# sourceMappingURL=initialize.js.map