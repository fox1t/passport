import initialize from '../middleware/initialize';
import authenticate from '../middleware/authenticate';
interface ConnectMiddlewareObject {
    initialize: typeof initialize;
    authenticate: typeof authenticate;
}
declare function connectMiddleware(): ConnectMiddlewareObject;
declare namespace connectMiddleware {
    var __monkeypatchNode: () => void;
}
export = connectMiddleware;
