import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  describe('success with message set by route', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req, options) {
      const user = { id: '1', username: 'jaredhanson' }
      this.success(user, { message: 'Welcome!' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())

    let request, response

    before(function(d) {
      ;(chai as any).connect
        .use(
          'express',
          authenticate(passport, 'success', {
            successMessage: 'Login complete',
            successRedirect: 'http://www.example.com/account',
          }),
        )
        .req(function(req) {
          request = req
          req.session = {}

          req.logIn = function(user, options, done) {
            this.user = user
            done()
          }
        })
        .end(function(res) {
          response = res
          d()
        })
        .dispatch()
    })

    it('should set user', function() {
      expect(request.user).to.be.an('object')
      expect(request.user.id).to.equal('1')
      expect(request.user.username).to.equal('jaredhanson')
    })

    it('should add message to session', function() {
      expect(request.session.messages).to.have.length(1)
      expect(request.session.messages[0]).to.equal('Login complete')
    })

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account')
    })
  })

  describe('success with message set by route that is added to messages', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req, options) {
      const user = { id: '1', username: 'jaredhanson' }
      this.success(user, { message: 'Welcome!' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())

    let request, response

    before(function(d) {
      ;(chai as any).connect
        .use(
          'express',
          authenticate(passport, 'success', {
            successMessage: 'Login complete',
            successRedirect: 'http://www.example.com/account',
          }),
        )
        .req(function(req) {
          request = req
          req.session = {}
          req.session.messages = ['I exist!']

          req.logIn = function(user, options, done) {
            this.user = user
            done()
          }
        })
        .end(function(res) {
          response = res
          d()
        })
        .dispatch()
    })

    it('should set user', function() {
      expect(request.user).to.be.an('object')
      expect(request.user.id).to.equal('1')
      expect(request.user.username).to.equal('jaredhanson')
    })

    it('should add message to session', function() {
      expect(request.session.messages).to.have.length(2)
      expect(request.session.messages[0]).to.equal('I exist!')
      expect(request.session.messages[1]).to.equal('Login complete')
    })

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account')
    })
  })

  describe('success with message set by strategy', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req, options) {
      const user = { id: '1', username: 'jaredhanson' }
      this.success(user, { message: 'Welcome!' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())

    let request, response

    before(function(d) {
      ;(chai as any).connect
        .use(
          'express',
          authenticate(passport, 'success', {
            successMessage: true,
            successRedirect: 'http://www.example.com/account',
          }),
        )
        .req(function(req) {
          request = req
          req.session = {}

          req.logIn = function(user, options, done) {
            this.user = user
            done()
          }
        })
        .end(function(res) {
          response = res
          d()
        })
        .dispatch()
    })

    it('should set user', function() {
      expect(request.user).to.be.an('object')
      expect(request.user.id).to.equal('1')
      expect(request.user.username).to.equal('jaredhanson')
    })

    it('should add message to session', function() {
      expect(request.session.messages).to.have.length(1)
      expect(request.session.messages[0]).to.equal('Welcome!')
    })

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account')
    })
  })

  describe('success with message set by strategy with extra info', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req, options) {
      const user = { id: '1', username: 'jaredhanson' }
      this.success(user, { message: 'Welcome!', scope: 'read' })
    }

    const passport = new Passport()
    passport.use('success', new Strategy())

    let request, response

    before(function(d) {
      ;(chai as any).connect
        .use(
          'express',
          authenticate(passport, 'success', {
            successMessage: true,
            successRedirect: 'http://www.example.com/account',
          }),
        )
        .req(function(req) {
          request = req
          req.session = {}

          req.logIn = function(user, options, done) {
            this.user = user
            done()
          }
        })
        .end(function(res) {
          response = res
          d()
        })
        .dispatch()
    })

    it('should set user', function() {
      expect(request.user).to.be.an('object')
      expect(request.user.id).to.equal('1')
      expect(request.user.username).to.equal('jaredhanson')
    })

    it('should add message to session', function() {
      expect(request.session.messages).to.have.length(1)
      expect(request.session.messages[0]).to.equal('Welcome!')
    })

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account')
    })
  })
})
