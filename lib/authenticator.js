"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const session_1 = __importDefault(require("./strategies/session"));
const sessionmanager_1 = __importDefault(require("./sessionmanager"));
const connect_1 = __importDefault(require("./framework/connect"));
class Authenticator {
    constructor() {
        this._key = 'passport';
        this._strategies = {};
        this._serializers = [];
        this._deserializers = [];
        this._infoTransformers = [];
        this._userProperty = 'user';
        this.init();
    }
    init() {
        this.framework(connect_1.default());
        this.use(new session_1.default(this.deserializeUser.bind(this)));
        this._sm = new sessionmanager_1.default({ key: this._key }, this.serializeUser.bind(this));
    }
    use(name, strategy) {
        if (!strategy) {
            strategy = name;
            name = strategy.name;
        }
        if (!name) {
            throw new Error('Authentication strategies must have a name');
        }
        this._strategies[name] = strategy;
        return this;
    }
    unuse(name) {
        delete this._strategies[name];
        return this;
    }
    framework(fw) {
        this._framework = fw;
        return this;
    }
    initialize(options) {
        options = options || {};
        this._userProperty = options.userProperty || 'user';
        return this._framework.initialize(this, options);
    }
    authenticate(strategy, options, callback) {
        return this._framework.authenticate(this, strategy, options, callback);
    }
    authorize(strategy, options, callback) {
        options = options || {};
        options.assignProperty = 'account';
        const fn = this._framework.authorize || this._framework.authenticate;
        return fn(this, strategy, options, callback);
    }
    session(options) {
        return this.authenticate('session', options);
    }
    serializeUser(fn, req, done) {
        if (typeof fn === 'function') {
            return this._serializers.push(fn);
        }
        const user = fn;
        if (typeof req === 'function') {
            done = req;
            req = undefined;
        }
        const stack = this._serializers;
        (function pass(i, err, obj) {
            if ('pass' === err) {
                err = undefined;
            }
            if (err || obj || obj === 0) {
                return done(err, obj);
            }
            const layer = stack[i];
            if (!layer) {
                return done(new Error('Failed to serialize user into session'));
            }
            function serialized(e, o) {
                pass(i + 1, e, o);
            }
            try {
                const arity = layer.length;
                if (arity === 3) {
                    layer(req, user, serialized);
                }
                else {
                    layer(user, serialized);
                }
            }
            catch (e) {
                return done(e);
            }
        })(0);
    }
    deserializeUser(fn, req, done) {
        if (typeof fn === 'function') {
            return this._deserializers.push(fn);
        }
        const obj = fn;
        if (typeof req === 'function') {
            done = req;
            req = undefined;
        }
        const stack = this._deserializers;
        (function pass(i, err, user) {
            if ('pass' === err) {
                err = undefined;
            }
            if (err || user) {
                return done(err, user);
            }
            if (user === null || user === false) {
                return done(null, false);
            }
            const layer = stack[i];
            if (!layer) {
                return done(new Error('Failed to deserialize user out of session'));
            }
            function deserialized(e, u) {
                pass(i + 1, e, u);
            }
            try {
                const arity = layer.length;
                if (arity === 3) {
                    layer(req, obj, deserialized);
                }
                else {
                    layer(obj, deserialized);
                }
            }
            catch (e) {
                return done(e);
            }
        })(0);
    }
    transformAuthInfo(fn, req, done) {
        if (typeof fn === 'function') {
            return this._infoTransformers.push(fn);
        }
        const info = fn;
        if (typeof req === 'function') {
            done = req;
            req = undefined;
        }
        const stack = this._infoTransformers;
        (function pass(i, err, tinfo) {
            if ('pass' === err) {
                err = undefined;
            }
            if (err || tinfo) {
                return done(err, tinfo);
            }
            const layer = stack[i];
            if (!layer) {
                return done(null, info);
            }
            function transformed(e, t) {
                pass(i + 1, e, t);
            }
            try {
                const arity = layer.length;
                if (arity === 1) {
                    const t = layer(info);
                    transformed(null, t);
                }
                else if (arity === 3) {
                    layer(req, info, transformed);
                }
                else {
                    layer(info, transformed);
                }
            }
            catch (e) {
                return done(e);
            }
        })(0);
    }
    _strategy(name) {
        return this._strategies[name];
    }
}
module.exports = Authenticator;
//# sourceMappingURL=authenticator.js.map