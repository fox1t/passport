const chai = require('chai')

chai.use(require('chai-connect-middleware'))
chai.use(require('chai-passport-strategy'))

require('ts-node').register({
  project: 'test/tsconfig.test.json',
})
