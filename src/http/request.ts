/**
 * Initiate a login session for `user`.
 *
 * Options:
 *   - `session`  Save login state in session, defaults to _true_
 *
 * Examples:
 *
 *     req.logIn(user, { session: false });
 *
 *     req.logIn(user, function(err) {
 *       if (err) { throw err; }
 *       // session saved
 *     });
 *
 * @param {User} user
 * @param {Object} options
 * @param {Function} done
 * @api public
 */
function logIn(user: object, options: any, done: (err?: Error) => void) {
  if (typeof options === 'function') {
    done = options
    options = {}
  }
  options = options || {}

  let property = 'user'
  if (this._passport && this._passport.instance) {
    property = this._passport.instance._userProperty || 'user'
  }
  const session = options.session === undefined ? true : options.session

  this[property] = user
  if (session) {
    if (!this._passport) {
      throw new Error('passport.initialize() middleware not in use')
    }
    if (typeof done !== 'function') {
      throw new Error('req#login requires a callback function')
    }

    const self = this
    this._passport.instance._sm.logIn(this, user, function(err: Error) {
      if (err) {
        self[property] = null
        return done(err)
      }
      done()
    })
  } else {
    if (done) {
      done()
    }
  }
}

/**
 * Terminate an existing login session.
 *
 * @api public
 */
function logOut() {
  let property = 'user'
  if (this._passport && this._passport.instance) {
    property = this._passport.instance._userProperty || 'user'
  }

  this[property] = null
  if (this._passport) {
    this._passport.instance._sm.logOut(this)
  }
}

/**
 * Test if request is authenticated.
 *
 * @return {Boolean}
 * @api public
 */
function isAuthenticated() {
  let property = 'user'
  if (this._passport && this._passport.instance) {
    property = this._passport.instance._userProperty || 'user'
  }

  return this[property] ? true : false
}

/**
 * Test if request is unauthenticated.
 *
 * @return {Boolean}
 * @api public
 */
function isUnauthenticated() {
  return !this.isAuthenticated()
}

const req = {
  login: logIn,
  logIn,
  logout: logOut,
  logOut,
  isAuthenticated,
  isUnauthenticated,
}

export = req
