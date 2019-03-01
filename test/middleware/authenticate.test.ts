import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  it('should be named authenticate', function() {
    const authenticateWithoutArgs = authenticate as any
    expect(authenticateWithoutArgs().name).to.equal('authenticate')
  })

  describe('with unknown strategy', function() {
    const passport = new Passport()

    let request, error

    before(function(d) {
      ;(chai as any).connect
        .use(authenticate(passport, 'foo'))
        .req(function(req) {
          request = req

          req.logIn = function(user, options, done) {
            this.user = user
            done()
          }
        })
        .next(function(err) {
          error = err
          d()
        })
        .dispatch()
    })

    it('should error', function() {
      expect(error).to.be.an.instanceOf(Error)
      expect(error.message).to.equal('Unknown authentication strategy "foo"')
    })

    it('should not set user', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })

    it('should not set authInfo', function() {
      /* tslint:disable-next-line */
      expect(request.authInfo).to.be.undefined
    })
  })
})
