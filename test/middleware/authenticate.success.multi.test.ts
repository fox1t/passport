import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  describe('with multiple strategies, the first of which succeeds', function() {
    function StrategyA() {}
    StrategyA.prototype.authenticate = function(req) {
      this.success({ username: 'bob-a' })
    }

    function StrategyB() {}
    StrategyB.prototype.authenticate = function(req) {
      this.success({ username: 'bob-b' })
    }

    const passport = new Passport()
    passport.use('a', new StrategyA())
    passport.use('b', new StrategyB())

    let request, error

    before(function(d) {
      ;(chai as any).connect
        .use(authenticate(passport, ['a', 'b']))
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
      expect(request.user.username).to.equal('bob-a')
    })
  })

  describe('with multiple strategies, the second of which succeeds', function() {
    function StrategyA() {}
    StrategyA.prototype.authenticate = function(req) {
      this.fail('A challenge')
    }

    function StrategyB() {}
    StrategyB.prototype.authenticate = function(req) {
      this.success({ username: 'bob-b' })
    }

    const passport = new Passport()
    passport.use('a', new StrategyA())
    passport.use('b', new StrategyB())

    let request, error

    before(function(d) {
      ;(chai as any).connect
        .use(authenticate(passport, ['a', 'b']))
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
      expect(request.user.username).to.equal('bob-b')
    })
  })
})
