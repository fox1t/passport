import http from 'http'
import IncomingMessageExt from '../http/request'
import AuthenticationError from '../errors/authenticationerror'
import { ExtendedRequest } from '../types/incoming-message'
import { Response, NextFunction } from 'express'
import Authenticator from '../authenticator'

/**
 * Authenticates requests.
 *
 * Applies the `name`ed strategy (or strategies) to the incoming request, in
 * order to authenticate the request.  If authentication is successful, the user
 * will be logged in and populated at `req.user` and a session will be
 * established by default.  If authentication fails, an unauthorized response
 * will be sent.
 *
 * Options:
 *   - `session`          Save login state in session, defaults to _true_
 *   - `successRedirect`  After successful login, redirect to given URL
 *   - `successMessage`   True to store success message in
 *                        req.session.messages, or a string to use as override
 *                        message for success.
 *   - `successFlash`     True to flash success messages or a string to use as a flash
 *                        message for success (overrides any from the strategy itself).
 *   - `failureRedirect`  After failed login, redirect to given URL
 *   - `failureMessage`   True to store failure message in
 *                        req.session.messages, or a string to use as override
 *                        message for failure.
 *   - `failureFlash`     True to flash failure messages or a string to use as a flash
 *                        message for failures (overrides any from the strategy itself).
 *   - `assignProperty`   Assign the object provided by the verify callback to given property
 *
 * An optional `callback` can be supplied to allow the application to override
 * the default manner in which authentication attempts are handled.  The
 * callback has the following signature, where `user` will be set to the
 * authenticated user on a successful authentication attempt, or `false`
 * otherwise.  An optional `info` argument will be passed, containing additional
 * details provided by the strategy's verify callback - this could be information about
 * a successful authentication or a challenge message for a failed authentication.
 * An optional `status` argument will be passed when authentication fails - this could
 * be a HTTP response code for a remote authentication failure or similar.
 *
 *     app.get('/protected', function(req, res, next) {
 *       passport.authenticate('local', function(err, user, info, status) {
 *         if (err) { return next(err) }
 *         if (!user) { return res.redirect('/signin') }
 *         res.redirect('/account');
 *       })(req, res, next);
 *     });
 *
 * Note that if a callback is supplied, it becomes the application's
 * responsibility to log-in the user, establish a session, and otherwise perform
 * the desired operations.
 *
 * Examples:
 *
 *     passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' });
 *
 *     passport.authenticate('basic', { session: false });
 *
 *     passport.authenticate('twitter');
 *
 * @param {String|Array} name
 * @param {Object} options
 * @param {Function} callback
 * @return {Function}
 * @api public
 */

type FlashObject = { type?: string; message?: string }
type FailureObject = {
  challenge?: string | unknown
  status?: number
  type?: string
}

interface AuthenticateFactoryOptions {
  scope?: string
  failureFlash?: boolean | string | FlashObject
  failureMessage?: boolean | string
  successRedirect?: string
  failureRedirect?: string
  failWithError?: boolean
  successFlash?: boolean | string | FlashObject
  successMessage?: boolean | string
  assignProperty?: string
  successReturnToOrRedirect?: string
  authInfo?: boolean
}

type AuthenticateFactoryCallback = (
  err: null | Error,
  user?: any,
  info?: any,
  statuses?: any | any[],
) => void

export default function authenticateFactory(
  passport: Authenticator,
  name: string | string[],
  options?: AuthenticateFactoryOptions | AuthenticateFactoryCallback,
  callback?: AuthenticateFactoryCallback,
) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  options = options || {}

  let multi = true

  // Cast `name` to an array, allowing authentication to pass through a chain of
  // strategies.  The first strategy to succeed, redirect, or error will halt
  // the chain.  Authentication failures will proceed through each strategy in
  // series, ultimately failing if all strategies fail.
  //
  // This is typically used on API endpoints to allow clients to authenticate
  // using their preferred choice of Basic, Digest, token-based schemes, etc.
  // It is not feasible to construct a chain of multiple strategies that involve
  // redirection (for example both Facebook and Twitter), since the first one to
  // redirect will halt the chain.
  if (!Array.isArray(name)) {
    name = [name]
    multi = false
  }

  return function authenticate(req: ExtendedRequest, res: Response, next: NextFunction) {
    if (
      (http.IncomingMessage.prototype as any).logIn &&
      (http.IncomingMessage.prototype as any).logIn !== IncomingMessageExt.logIn
    ) {
      require('../framework/connect').__monkeypatchNode()
    }

    // accumulator for failures from each strategy in the chain
    const failures: FailureObject[] = []

    function allFailed() {
      if (callback) {
        if (!multi) {
          return callback(null, false, failures[0].challenge, failures[0].status)
        } else {
          const challenges = failures.map(function(f) {
            return f.challenge
          })
          const statuses = failures.map(function(f) {
            return f.status
          })
          return callback(null, false, challenges, statuses)
        }
      }

      // Strategies are ordered by priority.  For the purpose of flashing a
      // message, the first failure will be displayed.
      let failure = failures[0] || {},
        challenge = failure.challenge || {},
        msg
      const authenticateOptions = options as AuthenticateFactoryOptions

      if (authenticateOptions.failureFlash) {
        let flash = authenticateOptions.failureFlash
        if (typeof flash === 'boolean') {
          flash = challenge as FlashObject
        }
        if (typeof flash === 'string') {
          flash = { type: 'error', message: flash }
        }
        ;(flash as FlashObject).type = (flash as FlashObject).type || 'error'

        const type = (flash as FlashObject).type || (challenge as FlashObject).type || 'error'
        msg = (flash as FlashObject).message || (challenge as FlashObject).message || challenge
        if (typeof msg === 'string') {
          req.flash(type, msg)
        }
      }
      if (authenticateOptions.failureMessage) {
        msg = authenticateOptions.failureMessage
        if (typeof msg === 'boolean') {
          msg = (challenge as FlashObject).message || challenge
        }
        if (typeof msg === 'string') {
          req.session.messages = req.session.messages || []
          req.session.messages.push(msg)
        }
      }
      if (authenticateOptions.failureRedirect) {
        return res.redirect(authenticateOptions.failureRedirect)
      }

      // When failure handling is not delegated to the application, the default
      // is to respond with 401 Unauthorized.  Note that the WWW-Authenticate
      // header will be set according to the strategies in use (see
      // actions#fail).  If multiple strategies failed, each of their challenges
      // will be included in the response.
      const rchallenge: string[] = []
      let rstatus
      let status

      for (let j = 0, len = failures.length; j < len; j++) {
        failure = failures[j]
        challenge = failure.challenge
        status = failure.status

        rstatus = rstatus || status
        if (typeof challenge === 'string') {
          rchallenge.push(challenge)
        }
      }

      res.statusCode = rstatus || 401
      if (res.statusCode === 401 && rchallenge.length) {
        res.setHeader('WWW-Authenticate', rchallenge)
      }
      if (authenticateOptions.failWithError) {
        return next(new AuthenticationError(http.STATUS_CODES[res.statusCode]!, rstatus as number))
      }
      res.end(http.STATUS_CODES[res.statusCode])
    }

    ;(function attempt(i) {
      const layer = name[i]
      // If no more strategies exist in the chain, authentication has failed.
      if (!layer) {
        return allFailed()
      }

      // Get the strategy, which will be used as prototype from which to create
      // a new instance.  Action functions will then be bound to the strategy
      // within the context of the HTTP request/response pair.
      const prototype = passport._strategy(layer)
      if (!prototype) {
        return next(new Error('Unknown authentication strategy "' + layer + '"'))
      }

      const strategy = Object.create(prototype)

      // ----- BEGIN STRATEGY AUGMENTATION -----
      // Augment the new strategy instance with action functions.  These action
      // functions are bound via closure the the request/response pair.  The end
      // goal of the strategy is to invoke *one* of these action methods, in
      // order to indicate successful or failed authentication, redirect to a
      // third-party identity provider, etc.

      /**
       * Authenticate `user`, with optional `info`.
       *
       * Strategies should call this function to successfully authenticate a
       * user.  `user` should be an object supplied by the application after it
       * has been given an opportunity to verify credentials.  `info` is an
       * optional argument containing additional user information.  This is
       * useful for third-party authentication strategies to pass profile
       * details.
       *
       * @param {Object} user
       * @param {Object} info
       * @api public
       */
      strategy.success = function(user: object, info: { type: string; message: string }) {
        if (callback) {
          return callback(null, user, info)
        }

        info = info || {}
        let msg

        const authenticateOptions = options as AuthenticateFactoryOptions

        if (authenticateOptions.successFlash) {
          let flash = authenticateOptions.successFlash
          if (typeof flash === 'boolean') {
            flash = info || {}
          }
          if (typeof flash === 'string') {
            flash = { type: 'success', message: flash }
          }
          flash.type = flash.type || 'success'

          const type = flash.type || info.type || 'success'
          msg = flash.message || info.message || info
          if (typeof msg === 'string') {
            req.flash(type, msg)
          }
        }
        if (authenticateOptions.successMessage) {
          msg = authenticateOptions.successMessage
          if (typeof msg === 'boolean') {
            msg = info.message || info
          }
          if (typeof msg === 'string') {
            req.session.messages = req.session.messages || []
            req.session.messages.push(msg)
          }
        }
        if (authenticateOptions.assignProperty) {
          req[authenticateOptions.assignProperty] = user
          return next()
        }

        req.logIn(user, authenticateOptions, function(err) {
          if (err) {
            return next(err)
          }

          function complete() {
            if (authenticateOptions.successReturnToOrRedirect) {
              let url = authenticateOptions.successReturnToOrRedirect
              if (req.session && req.session.returnTo) {
                url = req.session.returnTo
                delete req.session.returnTo
              }
              return res.redirect(url)
            }
            if (authenticateOptions.successRedirect) {
              return res.redirect(authenticateOptions.successRedirect)
            }
            next()
          }

          if (authenticateOptions.authInfo !== false) {
            passport.transformAuthInfo(info, req, function(error: Error, tinfo: any) {
              if (error) {
                return next(error)
              }
              req.authInfo = tinfo
              complete()
            })
          } else {
            complete()
          }
        })
      }

      /**
       * Fail authentication, with optional `challenge` and `status`, defaulting
       * to 401.
       *
       * Strategies should call this function to fail an authentication attempt.
       *
       * @param {String} challenge
       * @param {Number} status
       * @api public
       */
      strategy.fail = function(challenge: string | number | undefined, status?: number) {
        if (typeof challenge === 'number') {
          status = challenge
          challenge = undefined
        }

        // push this failure into the accumulator and attempt authentication
        // using the next strategy
        failures.push({ challenge, status: status! })
        attempt(i + 1)
      }

      /**
       * Redirect to `url` with optional `status`, defaulting to 302.
       *
       * Strategies should call this function to redirect the user (via their
       * user agent) to a third-party website for authentication.
       *
       * @param {String} url
       * @param {Number} status
       * @api public
       */
      strategy.redirect = function(url: string, status: number) {
        // NOTE: Do not use `res.redirect` from Express, because it can't decide
        //       what it wants.
        //
        //       Express 2.x: res.redirect(url, status)
        //       Express 3.x: res.redirect(status, url) -OR- res.redirect(url, status)
        //         - as of 3.14.0, deprecated warnings are issued if res.redirect(url, status)
        //           is used
        //       Express 4.x: res.redirect(status, url)
        //         - all versions (as of 4.8.7) continue to accept res.redirect(url, status)
        //           but issue deprecated versions

        res.statusCode = status || 302
        res.setHeader('Location', url)
        res.setHeader('Content-Length', '0')
        res.end()
      }

      /**
       * Pass without making a success or fail decision.
       *
       * Under most circumstances, Strategies should not need to call this
       * function.  It exists primarily to allow previous authentication state
       * to be restored, for example from an HTTP session.
       *
       * @api public
       */
      strategy.pass = function() {
        next()
      }

      /**
       * Internal error while performing authentication.
       *
       * Strategies should call this function when an internal error occurs
       * during the process of performing authentication; for example, if the
       * user directory is not available.
       *
       * @param {Error} err
       * @api public
       */
      strategy.error = function(err: Error) {
        if (callback) {
          return callback(err)
        }

        next(err)
      }

      // ----- END STRATEGY AUGMENTATION -----

      strategy.authenticate(req, options)
    })(0) // attempt
  }
}
