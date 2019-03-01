import { expect } from 'chai'
import Authenticator from '../src/authenticator'

describe('Authenticator', function() {
  describe('#framework', function() {
    describe('with an authenticate function used for authorization', function() {
      const passport = new Authenticator()
      passport.framework({
        initialize: function() {
          return function() {}
        },
        authenticate: function(_, name, options) {
          return function() {
            return 'authenticate(): ' + name + ' ' + options.assignProperty
          }
        },
      })

      const rv = passport.authorize('foo')()
      it('should call authenticate', function() {
        expect(rv).to.equal('authenticate(): foo account')
      })
    })

    describe('with an authorize function used for authorization', function() {
      const passport = new Authenticator()
      passport.framework({
        initialize: function() {
          return function() {}
        },
        authenticate: function(_, name, options) {
          return function() {
            return 'authenticate(): ' + name + ' ' + options.assignProperty
          }
        },
        authorize: function(_, name, options) {
          return function() {
            return 'authorize(): ' + name + ' ' + options.assignProperty
          }
        },
      })

      const rv = passport.authorize('foo')()
      it('should call authorize', function() {
        expect(rv).to.equal('authorize(): foo account')
      })
    })
  })
})
