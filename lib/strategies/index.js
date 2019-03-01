"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BasicStrategy {
    authenticate(req, options) {
        throw new Error('Strategy#authenticate must be overridden by subclass');
    }
}
exports.BasicStrategy = BasicStrategy;
exports.default = BasicStrategy;
//# sourceMappingURL=index.js.map