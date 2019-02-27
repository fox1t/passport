import { Request } from 'express'

class SessionManager {
  _key: string
  _serializeUser: Function

  constructor(options: Function | any, serializeUser: Function) {
    if (typeof options === 'function') {
      serializeUser = options
      options = undefined
    }
    options = options || {}

    this._key = options.key || 'passport'
    this._serializeUser = serializeUser
  }

  logIn(req: Request, user: any, cb: (err?: Error) => void) {
    const self = this
    this._serializeUser(user, req, function(err: Error, obj: any) {
      if (err) {
        return cb(err)
      }
      if (!req._passport.session) {
        req._passport.session = {}
      }
      req._passport.session.user = obj
      if (!req.session) {
        req.session = {}
      }
      req.session[self._key] = req._passport.session
      cb()
    })
  }

  logOut(req: Request, cb?: () => void) {
    if (req._passport && req._passport.session) {
      delete req._passport.session.user
    }
    if (cb) {
      cb()
    }
  }
}

export default SessionManager
