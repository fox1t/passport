"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pause_1 = __importDefault(require("pause"));
const _1 = require(".");
class SessionStrategy extends _1.BasicStrategy {
    constructor(options, deserializeUser) {
        super();
        if (typeof options === 'function') {
            deserializeUser = options;
            options = undefined;
        }
        options = options || {};
        this.name = 'session';
        this._deserializeUser = deserializeUser;
    }
    authenticate(req, options) {
        if (!req._passport) {
            return this.error(new Error('passport.initialize() middleware not in use'));
        }
        options = options || {};
        const self = this;
        let su;
        if (req._passport.session) {
            su = req._passport.session.user;
        }
        if (su || su === 0) {
            const paused = options.pauseStream ? pause_1.default(req) : null;
            this._deserializeUser(su, req, function (err, user) {
                if (err) {
                    return self.error(err);
                }
                if (!user) {
                    delete req._passport.session.user;
                }
                else {
                    const property = req._passport.instance._userProperty || 'user';
                    req[property] = user;
                }
                self.pass();
                if (paused) {
                    paused.resume();
                }
            });
        }
        else {
            self.pass();
        }
    }
}
exports.default = SessionStrategy;
//# sourceMappingURL=session.js.map