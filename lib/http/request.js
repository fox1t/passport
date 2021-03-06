"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logIn(user, options, done) {
    if (typeof options === 'function') {
        done = options;
        options = {};
    }
    options = options || {};
    let property = 'user';
    if (this._passport && this._passport.instance) {
        property = this._passport.instance._userProperty || 'user';
    }
    const session = options.session === undefined ? true : options.session;
    this[property] = user;
    if (session) {
        if (!this._passport) {
            throw new Error('passport.initialize() middleware not in use');
        }
        if (typeof done !== 'function') {
            throw new Error('req#login requires a callback function');
        }
        const self = this;
        this._passport.instance._sm.logIn(this, user, function (err) {
            if (err) {
                self[property] = null;
                return done(err);
            }
            done();
        });
    }
    else {
        if (done) {
            done();
        }
    }
}
exports.logIn = logIn;
function logOut() {
    let property = 'user';
    if (this._passport && this._passport.instance) {
        property = this._passport.instance._userProperty || 'user';
    }
    this[property] = null;
    if (this._passport) {
        this._passport.instance._sm.logOut(this);
    }
}
exports.logOut = logOut;
function isAuthenticated() {
    let property = 'user';
    if (this._passport && this._passport.instance) {
        property = this._passport.instance._userProperty || 'user';
    }
    return this[property] ? true : false;
}
exports.isAuthenticated = isAuthenticated;
function isUnauthenticated() {
    return !this.isAuthenticated();
}
exports.isUnauthenticated = isUnauthenticated;
const req = {
    login: logIn,
    logIn,
    logout: logOut,
    logOut,
    isAuthenticated,
    isUnauthenticated,
};
exports.default = req;
//# sourceMappingURL=request.js.map