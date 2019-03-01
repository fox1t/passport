"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const request_1 = __importDefault(require("../http/request"));
const authenticationerror_1 = __importDefault(require("../errors/authenticationerror"));
function authenticateFactory(passport, name, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    options = options || {};
    let multi = true;
    if (!Array.isArray(name)) {
        name = [name];
        multi = false;
    }
    return function authenticate(req, res, next) {
        if (http_1.default.IncomingMessage.prototype.logIn &&
            http_1.default.IncomingMessage.prototype.logIn !== request_1.default.logIn) {
            require('../framework/connect').__monkeypatchNode();
        }
        const failures = [];
        function allFailed() {
            if (callback) {
                if (!multi) {
                    return callback(null, false, failures[0].challenge, failures[0].status);
                }
                else {
                    const challenges = failures.map(function (f) {
                        return f.challenge;
                    });
                    const statuses = failures.map(function (f) {
                        return f.status;
                    });
                    return callback(null, false, challenges, statuses);
                }
            }
            let failure = failures[0] || {}, challenge = failure.challenge || {}, msg;
            const authenticateOptions = options;
            if (authenticateOptions.failureFlash) {
                let flash = authenticateOptions.failureFlash;
                if (typeof flash === 'boolean') {
                    flash = challenge;
                }
                if (typeof flash === 'string') {
                    flash = { type: 'error', message: flash };
                }
                ;
                flash.type = flash.type || 'error';
                const type = flash.type || challenge.type || 'error';
                msg = flash.message || challenge.message || challenge;
                if (typeof msg === 'string') {
                    req.flash(type, msg);
                }
            }
            if (authenticateOptions.failureMessage) {
                msg = authenticateOptions.failureMessage;
                if (typeof msg === 'boolean') {
                    msg = challenge.message || challenge;
                }
                if (typeof msg === 'string') {
                    req.session.messages = req.session.messages || [];
                    req.session.messages.push(msg);
                }
            }
            if (authenticateOptions.failureRedirect) {
                return res.redirect(authenticateOptions.failureRedirect);
            }
            const rchallenge = [];
            let rstatus;
            let status;
            for (let j = 0, len = failures.length; j < len; j++) {
                failure = failures[j];
                challenge = failure.challenge;
                status = failure.status;
                rstatus = rstatus || status;
                if (typeof challenge === 'string') {
                    rchallenge.push(challenge);
                }
            }
            res.statusCode = rstatus || 401;
            if (res.statusCode === 401 && rchallenge.length) {
                res.setHeader('WWW-Authenticate', rchallenge);
            }
            if (authenticateOptions.failWithError) {
                return next(new authenticationerror_1.default(http_1.default.STATUS_CODES[res.statusCode], rstatus));
            }
            res.end(http_1.default.STATUS_CODES[res.statusCode]);
        }
        ;
        (function attempt(i) {
            const layer = name[i];
            if (!layer) {
                return allFailed();
            }
            const prototype = passport._strategy(layer);
            if (!prototype) {
                return next(new Error('Unknown authentication strategy "' + layer + '"'));
            }
            const strategy = Object.create(prototype);
            strategy.success = function (user, info) {
                if (callback) {
                    return callback(null, user, info);
                }
                info = info || {};
                let msg;
                const authenticateOptions = options;
                if (authenticateOptions.successFlash) {
                    let flash = authenticateOptions.successFlash;
                    if (typeof flash === 'boolean') {
                        flash = info || {};
                    }
                    if (typeof flash === 'string') {
                        flash = { type: 'success', message: flash };
                    }
                    flash.type = flash.type || 'success';
                    const type = flash.type || info.type || 'success';
                    msg = flash.message || info.message || info;
                    if (typeof msg === 'string') {
                        req.flash(type, msg);
                    }
                }
                if (authenticateOptions.successMessage) {
                    msg = authenticateOptions.successMessage;
                    if (typeof msg === 'boolean') {
                        msg = info.message || info;
                    }
                    if (typeof msg === 'string') {
                        req.session.messages = req.session.messages || [];
                        req.session.messages.push(msg);
                    }
                }
                if (authenticateOptions.assignProperty) {
                    req[authenticateOptions.assignProperty] = user;
                    return next();
                }
                req.logIn(user, authenticateOptions, function (err) {
                    if (err) {
                        return next(err);
                    }
                    function complete() {
                        if (authenticateOptions.successReturnToOrRedirect) {
                            let url = authenticateOptions.successReturnToOrRedirect;
                            if (req.session && req.session.returnTo) {
                                url = req.session.returnTo;
                                delete req.session.returnTo;
                            }
                            return res.redirect(url);
                        }
                        if (authenticateOptions.successRedirect) {
                            return res.redirect(authenticateOptions.successRedirect);
                        }
                        next();
                    }
                    if (authenticateOptions.authInfo !== false) {
                        passport.transformAuthInfo(info, req, function (error, tinfo) {
                            if (error) {
                                return next(error);
                            }
                            req.authInfo = tinfo;
                            complete();
                        });
                    }
                    else {
                        complete();
                    }
                });
            };
            strategy.fail = function (challenge, status) {
                if (typeof challenge === 'number') {
                    status = challenge;
                    challenge = undefined;
                }
                failures.push({ challenge, status: status });
                attempt(i + 1);
            };
            strategy.redirect = function (url, status) {
                res.statusCode = status || 302;
                res.setHeader('Location', url);
                res.setHeader('Content-Length', '0');
                res.end();
            };
            strategy.pass = function () {
                next();
            };
            strategy.error = function (err) {
                if (callback) {
                    return callback(err);
                }
                next(err);
            };
            strategy.authenticate(req, options);
        })(0);
    };
}
exports.default = authenticateFactory;
//# sourceMappingURL=authenticate.js.map