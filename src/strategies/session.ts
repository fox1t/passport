import pause from 'pause'
import { ExtendedRequest } from '../types/incoming-message'
import { BasicStrategy } from '.'
import Authenticator from '../authenticator'

class SessionStrategy extends BasicStrategy {
  name: string
  _deserializeUser: Function

  constructor(deserializeUser?: Authenticator['deserializeUser'])
  constructor(options: any, deserializeUser?: Authenticator['deserializeUser'])
  constructor(
    options?: Authenticator['deserializeUser'] | any,
    deserializeUser?: Authenticator['deserializeUser'],
  ) {
    super()
    if (typeof options === 'function') {
      deserializeUser = options
      options = undefined as any
    }
    options = options || {}

    this.name = 'session'
    this._deserializeUser = deserializeUser!
  }

  /**
   * Authenticate request based on the current session state.
   *
   * The session authentication strategy uses the session to restore any login
   * state across requests.  If a login session has been established, `req.user`
   * will be populated with the current user.
   *
   * This strategy is registered automatically by Passport.
   *
   * @param {Object} req
   * @param {Object} options
   * @api protected
   */
  authenticate(req: ExtendedRequest, options: { pauseStream?: boolean }) {
    if (!req._passport) {
      return this.error!(new Error('passport.initialize() middleware not in use'))
    }
    options = options || {}

    const self = this
    let su
    if (req._passport.session) {
      su = req._passport.session.user
    }

    if (su || su === 0) {
      // NOTE: Stream pausing is desirable in the case where later middleware is
      //       listening for events emitted from request.  For discussion on the
      //       matter, refer to: https://github.com/jaredhanson/passport/pull/106

      const paused = options.pauseStream ? pause(req) : null
      this._deserializeUser(su, req, function(err: Error, user: any) {
        if (err) {
          return self.error!(err)
        }
        if (!user) {
          delete req._passport.session.user
        } else {
          // TODO: Remove instance access
          const property = req._passport.instance._userProperty || 'user'
          req[property] = user
        }
        self.pass!()
        if (paused) {
          paused.resume()
        }
      })
    } else {
      self.pass!()
    }
  }
}

export default SessionStrategy
