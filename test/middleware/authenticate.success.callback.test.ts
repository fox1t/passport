import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  describe('success with callback', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      const localUser = { id: '1', username: 'jaredhanson' }
      this.success(localUser, { message: 'Hello' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())

    let request, error, user, info

    before(function(done) {
      function callback(e, u, i) {
        error = e
        user = u
        info = i
        done()
      }

      ;(chai as any).connect
        .use(authenticate(passport, 'success', callback))
        .req(function(req) {
          request = req
        })
        .dispatch()
    })

    it('should not error', function() {
      /* tslint:disable-next-line */
      expect(error).to.be.null
    })

    it('should pass user to callback', function() {
      expect(user).to.be.an('object')
      expect(user.id).to.equal('1')
      expect(user.username).to.equal('jaredhanson')
    })

    it('should pass info to callback', function() {
      expect(info).to.be.an('object')
      expect(info.message).to.equal('Hello')
    })

    it('should not set user on request', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })

    it('should not set authInfo on request', function() {
      /* tslint:disable-next-line */
      expect(request.authInfo).to.be.undefined
    })
  })

  describe('success with callback and options passed to middleware', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      const localUser = { id: '1', username: 'jaredhanson' }
      this.success(localUser, { message: 'Hello' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())

    let request, error, user, info

    before(function(done) {
      function callback(e, u, i) {
        error = e
        user = u
        info = i
        done()
      }

      ;(chai as any).connect
        .use(authenticate(passport, 'success', {}, callback))
        .req(function(req) {
          request = req
        })
        .dispatch()
    })

    it('should not error', function() {
      /* tslint:disable-next-line */
      expect(error).to.be.null
    })

    it('should pass user to callback', function() {
      expect(user).to.be.an('object')
      expect(user.id).to.equal('1')
      expect(user.username).to.equal('jaredhanson')
    })

    it('should pass info to callback', function() {
      expect(info).to.be.an('object')
      expect(info.message).to.equal('Hello')
    })

    it('should not set user on request', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })

    it('should not set authInfo on request', function() {
      /* tslint:disable-next-line */
      expect(request.authInfo).to.be.undefined
    })
  })
})
