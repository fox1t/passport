import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  describe('success with info', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      const user = { id: '1', username: 'jaredhanson' }
      this.success(user, { clientId: '123', scope: 'read' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())

    let request, error

    before(function(d) {
      ;(chai as any).connect
        .use(authenticate(passport, 'success'))
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

    it('should not error', function() {
      /* tslint:disable-next-line */
      expect(error).to.be.undefined
    })

    it('should set user', function() {
      expect(request.user).to.be.an('object')
      expect(request.user.id).to.equal('1')
      expect(request.user.username).to.equal('jaredhanson')
    })

    it('should set authInfo', function() {
      expect(request.authInfo).to.be.an('object')
      expect(Object.keys(request.authInfo)).to.have.length(2)
      expect(request.authInfo.clientId).to.equal('123')
      expect(request.authInfo.scope).to.equal('read')
    })
  })

  describe('success with info that is transformed', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      const user = { id: '1', username: 'jaredhanson' }
      this.success(user, { clientId: '123', scope: 'read' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())
    passport.transformAuthInfo(function(info, done) {
      done(null, { clientId: info.clientId, client: { name: 'Foo' }, scope: info.scope })
    })

    let request, error

    before(function(d) {
      ;(chai as any).connect
        .use(authenticate(passport, 'success'))
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

    it('should not error', function() {
      /* tslint:disable-next-line */
      expect(error).to.be.undefined
    })

    it('should set user', function() {
      expect(request.user).to.be.an('object')
      expect(request.user.id).to.equal('1')
      expect(request.user.username).to.equal('jaredhanson')
    })

    it('should set authInfo', function() {
      expect(request.authInfo).to.be.an('object')
      expect(Object.keys(request.authInfo)).to.have.length(3)
      expect(request.authInfo.clientId).to.equal('123')
      expect(request.authInfo.client.name).to.equal('Foo')
      expect(request.authInfo.scope).to.equal('read')
    })
  })

  describe('success with info, but transform that encounters an error', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      const user = { id: '1', username: 'jaredhanson' }
      this.success(user, { clientId: '123', scope: 'read' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())
    passport.transformAuthInfo(function(info, done) {
      done(new Error('something went wrong'))
    })

    let request, error

    before(function(d) {
      ;(chai as any).connect
        .use(authenticate(passport, 'success'))
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
      expect(error.message).to.equal('something went wrong')
    })

    it('should set user', function() {
      expect(request.user).to.be.an('object')
      expect(request.user.id).to.equal('1')
      expect(request.user.username).to.equal('jaredhanson')
    })

    it('should not set authInfo', function() {
      /* tslint:disable-next-line */
      expect(request.authInfo).to.be.undefined
    })
  })

  describe('success with info, but option that disables info', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      const user = { id: '1', username: 'jaredhanson' }
      this.success(user, { clientId: '123', scope: 'read' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())

    let request, error

    before(function(d) {
      ;(chai as any).connect
        .use(authenticate(passport, 'success', { authInfo: false }))
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

    it('should not error', function() {
      /* tslint:disable-next-line */
      expect(error).to.be.undefined
    })

    it('should set user', function() {
      expect(request.user).to.be.an('object')
      expect(request.user.id).to.equal('1')
      expect(request.user.username).to.equal('jaredhanson')
    })

    it('should not set authInfo', function() {
      /* tslint:disable-next-line */
      expect(request.authInfo).to.be.undefined
    })
  })
})
