import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  describe('error', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.error(new Error('something is wrong'))
    }

    const passport = new Passport()
    passport.use('error', new Strategy())

    let request, error

    before(function(done) {
      ;(chai as any).connect
        .use(authenticate(passport, 'error'))
        .req(function(req) {
          request = req
        })
        .next(function(err) {
          error = err
          done()
        })
        .dispatch()
    })

    it('should error', function() {
      expect(error).to.be.an.instanceOf(Error)
      expect(error.message).to.equal('something is wrong')
    })

    it('should not set user', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })
  })
})
