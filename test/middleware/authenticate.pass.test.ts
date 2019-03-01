import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  describe('pass', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.pass()
    }

    const passport = new Passport()
    passport.use('pass', new Strategy())

    let request, error

    before(function(done) {
      ;(chai as any).connect
        .use(authenticate(passport, 'pass'))
        .req(function(req) {
          request = req
        })
        .next(function(err) {
          error = err
          done()
        })
        .dispatch()
    })

    it('should not error', function() {
      /* tslint:disable-next-line */
      expect(error).to.be.undefined
    })

    it('should not set user', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })
  })
})
