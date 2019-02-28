import http from 'http'

import IncomingMessageExt from '../http/request'
import initialize from '../middleware/initialize'
import authenticate from '../middleware/authenticate'

interface ConnectMiddlewareObject {
  initialize: typeof initialize
  authenticate: typeof authenticate
}

/**
 * Framework support for Connect/Express.
 *
 * This module provides support for using Passport with Express.  It exposes
 * middleware that conform to the `fn(req, res, next)` signature and extends
 * Node's built-in HTTP request object with useful authentication-related
 * functions.
 *
 * @return {Object}
 * @api protected
 */
function connectMiddleware(): ConnectMiddlewareObject {
  // HTTP extensions.
  connectMiddleware.__monkeypatchNode()

  return {
    initialize,
    authenticate,
  }
}

connectMiddleware.__monkeypatchNode = function() {
  http.IncomingMessage.prototype.login = http.IncomingMessage.prototype.logIn =
    IncomingMessageExt.logIn
  http.IncomingMessage.prototype.logout = http.IncomingMessage.prototype.logOut =
    IncomingMessageExt.logOut
  http.IncomingMessage.prototype.isAuthenticated = IncomingMessageExt.isAuthenticated
  http.IncomingMessage.prototype.isUnauthenticated = IncomingMessageExt.isUnauthenticated
}

export = connectMiddleware
