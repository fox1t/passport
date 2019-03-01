import { expect } from 'chai'

import Authenticator from '../src/authenticator'

describe('Authenticator', function() {
  describe('#use', function() {
    describe('with instance name', function() {
      class Strategy {
        name = 'default'
        authenticate(req) {}
      }

      const authenticator = new Authenticator()
      authenticator.use(new Strategy())

      it('should register strategy', function() {
        expect(authenticator._strategies['default']).to.be.an('object')
      })
    })

    describe('with registered name', function() {
      class Strategy {
        authenticate(req) {}
      }

      const authenticator = new Authenticator()
      authenticator.use('foo', new Strategy())

      it('should register strategy', function() {
        expect(authenticator._strategies['foo']).to.be.an('object')
      })
    })

    describe('with registered name overridding instance name', function() {
      class Strategy {
        name = 'default'
        authenticate(req) {}
      }

      const authenticator = new Authenticator()
      authenticator.use('bar', new Strategy())

      it('should register strategy', function() {
        expect(authenticator._strategies['bar']).to.be.an('object')
        /* tslint:disable-next-line */
        expect(authenticator._strategies['default']).to.be.undefined
      })
    })

    it('should throw if lacking a name', function() {
      class Strategy {
        authenticate(req) {}
      }

      expect(function() {
        const authenticator = new Authenticator()
        authenticator.use(new Strategy())
      }).to.throw(Error, 'Authentication strategies must have a name')
    })
  })

  describe('#unuse', function() {
    class Strategy {
      authenticate(req) {}
    }

    const authenticator = new Authenticator()
    authenticator.use('one', new Strategy())
    authenticator.use('two', new Strategy())

    expect(authenticator._strategies['one']).to.be.an('object')
    expect(authenticator._strategies['two']).to.be.an('object')

    authenticator.unuse('one')

    it('should unregister strategy', function() {
      /* tslint:disable-next-line */
      expect(authenticator._strategies['one']).to.be.undefined
      expect(authenticator._strategies['two']).to.be.an('object')
    })
  })

  describe('#serializeUser', function() {
    describe('without serializers', function() {
      const authenticator = new Authenticator()
      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('Failed to serialize user into session')
      })

      it('should not serialize user', function() {
        /* tslint:disable-next-line */
        expect(obj).to.be.undefined
      })
    })

    describe('with one serializer', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(user, done) {
        done(null, user.id)
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should serialize user', function() {
        expect(obj).to.equal('1')
      })
    })

    describe('with one serializer that serializes to 0', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(user, done) {
        done(null, 0)
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should serialize user', function() {
        expect(obj).to.equal(0)
      })
    })

    describe('with one serializer that serializes to false', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(user, done) {
        done(null, false)
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('Failed to serialize user into session')
      })

      it('should not serialize user', function() {
        /* tslint:disable-next-line */
        expect(obj).to.be.undefined
      })
    })

    describe('with one serializer that serializes to null', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(user, done) {
        done(null, null)
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('Failed to serialize user into session')
      })

      it('should not serialize user', function() {
        /* tslint:disable-next-line */
        expect(obj).to.be.undefined
      })
    })

    describe('with one serializer that serializes to undefined', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(user, done) {
        done(null, undefined)
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('Failed to serialize user into session')
      })

      it('should not serialize user', function() {
        /* tslint:disable-next-line */
        expect(obj).to.be.undefined
      })
    })

    describe('with one serializer that encounters an error', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(user, done) {
        done(new Error('something went wrong'))
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('something went wrong')
      })

      it('should not serialize user', function() {
        /* tslint:disable-next-line */
        expect(obj).to.be.undefined
      })
    })

    describe('with one serializer that throws an exception', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(user, done) {
        throw new Error('something went horribly wrong')
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('something went horribly wrong')
      })

      it('should not serialize user', function() {
        /* tslint:disable-next-line */
        expect(obj).to.be.undefined
      })
    })

    describe('with three serializers, the first of which passes and the second of which serializes', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser((user, done) => {
        done('pass')
      })
      authenticator.serializeUser(function(user, done) {
        done(null, 'two')
      })
      authenticator.serializeUser(function(user, done) {
        done(null, 'three')
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should serialize user', function() {
        expect(obj).to.equal('two')
      })
    })

    describe('with three serializers, the first of which passes and the second of which does not serialize by no argument', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(user, done) {
        done('pass')
      })
      authenticator.serializeUser(function(user, done) {
        done(null)
      })
      authenticator.serializeUser(function(user, done) {
        done(null, 'three')
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should serialize user', function() {
        expect(obj).to.equal('three')
      })
    })

    describe('with three serializers, the first of which passes and the second of which does not serialize by undefined', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(user, done) {
        done('pass')
      })
      authenticator.serializeUser(function(user, done) {
        done(null, undefined)
      })
      authenticator.serializeUser(function(user, done) {
        done(null, 'three')
      })

      let error, obj

      before(function(done) {
        authenticator.serializeUser({ id: '1', username: 'jared' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should serialize user', function() {
        expect(obj).to.equal('three')
      })
    })

    describe('with one serializer that takes request as argument', function() {
      const authenticator = new Authenticator()
      authenticator.serializeUser(function(req, user, done) {
        if (req.url !== '/foo') {
          return done(new Error('incorrect req argument'))
        }
        done(null, user.id)
      })

      let error, obj

      before(function(done) {
        const req = { url: '/foo' } as any

        authenticator.serializeUser({ id: '1', username: 'jared' }, req, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should serialize user', function() {
        expect(obj).to.equal('1')
      })
    })
  })

  describe('#deserializeUser', function() {
    describe('without deserializers', function() {
      const authenticator = new Authenticator()
      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('Failed to deserialize user out of session')
      })

      it('should not deserialize user', function() {
        /* tslint:disable-next-line */
        expect(user).to.be.undefined
      })
    })

    describe('with one deserializer', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done(null, obj.username)
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should deserialize user', function() {
        expect(user).to.equal('jared')
      })
    })

    describe('with one deserializer that deserializes to false', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done(null, false)
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should invalidate session', function() {
        /* tslint:disable-next-line */
        expect(user).to.be.false
      })
    })

    describe('with one deserializer that deserializes to null', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done(null, null)
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should invalidate session', function() {
        /* tslint:disable-next-line */
        expect(user).to.be.false
      })
    })

    describe('with one deserializer that deserializes to undefined', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done(null, undefined)
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('Failed to deserialize user out of session')
      })

      it('should not deserialize user', function() {
        /* tslint:disable-next-line */
        expect(user).to.be.undefined
      })
    })

    describe('with one deserializer that encounters an error', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done(new Error('something went wrong'))
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('something went wrong')
      })

      it('should invalidate session', function() {
        /* tslint:disable-next-line */
        expect(user).to.be.undefined
      })
    })

    describe('with one deserializer that throws an exception', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        throw new Error('something went horribly wrong')
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('something went horribly wrong')
      })

      it('should invalidate session', function() {
        /* tslint:disable-next-line */
        expect(user).to.be.undefined
      })
    })

    describe('with three deserializers, the first of which passes and the second of which deserializes', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done('pass')
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null, 'two')
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null, 'three')
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should deserialize user', function() {
        expect(user).to.equal('two')
      })
    })

    describe('with three deserializers, the first of which passes and the second of which does not deserialize by no argument', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done('pass')
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null)
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null, 'three')
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should deserialize user', function() {
        expect(user).to.equal('three')
      })
    })

    describe('with three deserializers, the first of which passes and the second of which does not deserialize by undefined', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done('pass')
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null, undefined)
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null, 'three')
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should deserialize user', function() {
        expect(user).to.equal('three')
      })
    })

    describe('with three deserializers, the first of which passes and the second of which invalidates session by false', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done('pass')
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null, false)
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null, 'three')
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should invalidate session', function() {
        /* tslint:disable-next-line */
        expect(user).to.be.false
      })
    })

    describe('with three deserializers, the first of which passes and the second of which invalidates session by null', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(obj, done) {
        done('pass')
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null, null)
      })
      authenticator.deserializeUser(function(obj, done) {
        done(null, 'three')
      })

      let error, user

      before(function(done) {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should invalidate session', function() {
        /* tslint:disable-next-line */
        expect(user).to.be.false
      })
    })

    describe('with one deserializer that takes request as argument', function() {
      const authenticator = new Authenticator()
      authenticator.deserializeUser(function(req, obj, done) {
        if (req.url !== '/foo') {
          return done(new Error('incorrect req argument'))
        }
        done(null, obj.username)
      })

      let error, user

      before(function(done) {
        const req = { url: '/foo' } as any

        authenticator.deserializeUser({ id: '1', username: 'jared' }, req, function(err, u) {
          error = err
          user = u
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should deserialize user', function() {
        expect(user).to.equal('jared')
      })
    })
  })

  describe('#transformAuthInfo', function() {
    describe('without transforms', function() {
      const authenticator = new Authenticator()
      let error, obj

      before(function(done) {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should not transform info', function() {
        expect(Object.keys(obj)).to.have.length(2)
        expect(obj.clientId).to.equal('1')
        expect(obj.scope).to.equal('write')
      })
    })

    describe('with one transform', function() {
      const authenticator = new Authenticator()
      authenticator.transformAuthInfo(function(info, done) {
        done(null, { clientId: info.clientId, client: { name: 'Foo' } })
      })

      let error, obj

      before(function(done) {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should not transform info', function() {
        expect(Object.keys(obj)).to.have.length(2)
        expect(obj.clientId).to.equal('1')
        expect(obj.client.name).to.equal('Foo')
        /* tslint:disable-next-line */
        expect(obj.scope).to.be.undefined
      })
    })

    describe('with one transform that encounters an error', function() {
      const authenticator = new Authenticator()
      authenticator.transformAuthInfo(function(info, done) {
        done(new Error('something went wrong'))
      })

      let error, obj

      before(function(done) {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('something went wrong')
      })

      it('should not transform info', function() {
        /* tslint:disable-next-line */
        expect(obj).to.be.undefined
      })
    })

    describe('with one transform that throws an exception', function() {
      const authenticator = new Authenticator()
      authenticator.transformAuthInfo(function(info, done) {
        throw new Error('something went horribly wrong')
      })

      let error, obj

      before(function(done) {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('something went horribly wrong')
      })

      it('should not transform info', function() {
        /* tslint:disable-next-line */
        expect(obj).to.be.undefined
      })
    })

    describe('with one sync transform', function() {
      const authenticator = new Authenticator()
      authenticator.transformAuthInfo(function(info) {
        return { clientId: info.clientId, client: { name: 'Foo' } }
      })

      let error, obj

      before(function(done) {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should not transform info', function() {
        expect(Object.keys(obj)).to.have.length(2)
        expect(obj.clientId).to.equal('1')
        expect(obj.client.name).to.equal('Foo')
        /* tslint:disable-next-line */
        expect(obj.scope).to.be.undefined
      })
    })

    describe('with three transform, the first of which passes and the second of which transforms', function() {
      const authenticator = new Authenticator()
      authenticator.transformAuthInfo(function(info, done) {
        done('pass')
      })
      authenticator.transformAuthInfo(function(info, done) {
        done(null, { clientId: info.clientId, client: { name: 'Two' } })
      })
      authenticator.transformAuthInfo(function(info, done) {
        done(null, { clientId: info.clientId, client: { name: 'Three' } })
      })

      let error, obj

      before(function(done) {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should not transform info', function() {
        expect(Object.keys(obj)).to.have.length(2)
        expect(obj.clientId).to.equal('1')
        expect(obj.client.name).to.equal('Two')
        /* tslint:disable-next-line */
        expect(obj.scope).to.be.undefined
      })
    })

    describe('with one transform that takes request as argument', function() {
      const authenticator = new Authenticator()
      authenticator.transformAuthInfo(function(req, info, done) {
        if (req.url !== '/foo') {
          return done(new Error('incorrect req argument'))
        }
        done(null, { clientId: info.clientId, client: { name: 'Foo' } })
      })

      let error, obj

      before(function(done) {
        const req = { url: '/foo' } as any

        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, req, function(err, o) {
          error = err
          obj = o
          done()
        })
      })

      it('should not error', function() {
        /* tslint:disable-next-line */
        expect(error).to.be.null
      })

      it('should not transform info', function() {
        expect(Object.keys(obj)).to.have.length(2)
        expect(obj.clientId).to.equal('1')
        expect(obj.client.name).to.equal('Foo')
        /* tslint:disable-next-line */
        expect(obj.scope).to.be.undefined
      })
    })
  })
})
