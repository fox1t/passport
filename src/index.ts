import Passport from './authenticator'
import SessionStrategy from './strategies/session'
import Strategy from 'passport-strategy'

/**
 * Export default singleton.
 *
 * @api public
 */
const passport = new Passport()

export = Object.assign(passport, {
  Passport,
  Authenticator: Passport,
  Strategy,
  strategies: {
    SessionStrategy,
  },
})
