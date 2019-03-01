import chai, { expect } from 'chai'
import authenticate from '../../src/middleware/authenticate'
import Passport from '../../src/authenticator'

describe('middleware/authenticate', function() {
  describe('redirect', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.redirect('http://www.example.com/idp')
    }

    const passport = new Passport()
    passport.use('redirect', new Strategy())

    let request, response

    before(function(done) {
      ;(chai as any).connect
        .use(authenticate(passport, 'redirect'))
        .req(function(req) {
          request = req
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

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/idp')
      expect(response.getHeader('Content-Length')).to.equal('0')
    })
  })

  describe('redirect with status', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.redirect('http://www.example.com/idp', 303)
    }

    const passport = new Passport()
    passport.use('redirect', new Strategy())

    let request, response

    before(function(done) {
      ;(chai as any).connect
        .use(authenticate(passport, 'redirect'))
        .req(function(req) {
          request = req
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

    it('should redirect', function() {
      expect(response.statusCode).to.equal(303)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/idp')
      expect(response.getHeader('Content-Length')).to.equal('0')
    })
  })

  describe('redirect using framework function', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.redirect('http://www.example.com/idp')
    }

    const passport = new Passport()
    passport.use('redirect', new Strategy())

    let request, response

    before(function(done) {
      ;(chai as any).connect
        .use('express', authenticate(passport, 'redirect'))
        .req(function(req) {
          request = req
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

    it('should redirect', function() {
      expect(response.statusCode).to.equal(302)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/idp')
    })
  })

  describe('redirect with status using framework function', function() {
    function Strategy() {}
    Strategy.prototype.authenticate = function(req) {
      this.redirect('http://www.example.com/idp', 303)
    }

    const passport = new Passport()
    passport.use('redirect', new Strategy())

    let request, response

    before(function(done) {
      ;(chai as any).connect
        .use('express', authenticate(passport, 'redirect'))
        .req(function(req) {
          request = req
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

    it('should redirect', function() {
      expect(response.statusCode).to.equal(303)
      expect(response.getHeader('Location')).to.equal('http://www.example.com/idp')
    })
  })
})
