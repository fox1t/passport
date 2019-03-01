import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  describe('error with callback', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.error(new Error('something is wrong'))
    }

    const passport = new Passport()
    passport.use('error', new Strategy())

    let request, error

    before(function(done) {
      function callback(e, u) {
        error = e
        done()
      }

      ;(chai as any).connect
        .use(authenticate(passport, 'error', callback))
        .req(function(req) {
          request = req
        })
        .dispatch()
    })

    it('should pass error to callback', function() {
      expect(error).to.be.an.instanceOf(Error)
      expect(error.message).to.equal('something is wrong')
    })

    it('should pass user as undefined to callback', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })

    it('should not set user on request', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })
  })

  describe('error with callback and options passed to middleware', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.error(new Error('something is wrong'))
    }

    const passport = new Passport()
    passport.use('error', new Strategy())

    let request, error

    before(function(done) {
      function callback(e, u) {
        error = e
        done()
      }

      ;(chai as any).connect
        .use(authenticate(passport, 'error', {}, callback))
        .req(function(req) {
          request = req
        })
        .dispatch()
    })

    it('should pass error to callback', function() {
      expect(error).to.be.an.instanceOf(Error)
      expect(error.message).to.equal('something is wrong')
    })

    it('should pass user as undefined to callback', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })

    it('should not set user on request', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })
  })
})
