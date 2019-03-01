import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  describe('fail with message set by route', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password' })
    }

    const passport = new Passport()
    passport.use('fail', new Strategy())

    let request, response

    before(function(done) {
      ;(chai as any).connect
        .use(
          'express',
          authenticate(passport, 'fail', {
            failureMessage: 'Wrong credentials',
            failureRedirect: 'http://www.example.com/login',
          }),
        )
        .req(function(req) {
          request = req
          req.session = {}
        })
        .end(function(res) {
          response = res
          done()
        })
        .dispatch()
    })

    it('should not set user', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })

    it('should add message to session', function() {
      expect(request.session.messages).to.have.length(1)
      expect(request.session.messages[0]).to.equal('Wrong credentials')
    })

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login')
    })
  })

  describe('fail with message set by route that is added to messages', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password' })
    }

    const passport = new Passport()
    passport.use('fail', new Strategy())

    let request, response

    before(function(done) {
      ;(chai as any).connect
        .use(
          'express',
          authenticate(passport, 'fail', {
            failureMessage: 'Wrong credentials',
            failureRedirect: 'http://www.example.com/login',
          }),
        )
        .req(function(req) {
          request = req
          req.session = {}
          req.session.messages = ['I exist!']
        })
        .end(function(res) {
          response = res
          done()
        })
        .dispatch()
    })

    it('should not set user', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })

    it('should add message to session', function() {
      expect(request.session.messages).to.have.length(2)
      expect(request.session.messages[0]).to.equal('I exist!')
      expect(request.session.messages[1]).to.equal('Wrong credentials')
    })

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login')
    })
  })

  describe('fail with message set by strategy', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password' })
    }

    const passport = new Passport()
    passport.use('fail', new Strategy())

    let request, response

    before(function(done) {
      ;(chai as any).connect
        .use(
          'express',
          authenticate(passport, 'fail', {
            failureMessage: true,
            failureRedirect: 'http://www.example.com/login',
          }),
        )
        .req(function(req) {
          request = req
          req.session = {}
        })
        .end(function(res) {
          response = res
          done()
        })
        .dispatch()
    })

    it('should not set user', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })

    it('should add message to session', function() {
      expect(request.session.messages).to.have.length(1)
      expect(request.session.messages[0]).to.equal('Invalid password')
    })

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login')
    })
  })

  describe('fail with message set by strategy with extra info', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.fail({ message: 'Invalid password', scope: 'read' })
    }

    const passport = new Passport()
    passport.use('fail', new Strategy())

    let request, response

    before(function(done) {
      ;(chai as any).connect
        .use(
          'express',
          authenticate(passport, 'fail', {
            failureMessage: true,
            failureRedirect: 'http://www.example.com/login',
          }),
        )
        .req(function(req) {
          request = req
          req.session = {}
        })
        .end(function(res) {
          response = res
          done()
        })
        .dispatch()
    })

    it('should not set user', function() {
      /* tslint:disable-next-line */
      expect(request.user).to.be.undefined
    })

    it('should add message to session', function() {
      expect(request.session.messages).to.have.length(1)
      expect(request.session.messages[0]).to.equal('Invalid password')
    })

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login')
    })
  })
})
