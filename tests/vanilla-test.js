'use strict'

const { expect } = require ('./../src/index.js')
function fn () {
  expect('a').to.equal('a')
  expect(3).to.equal(3)
  expect('b').to.not.equal('c')
  expect ('').to.not.loosely.equal(5)
  
  const a = {}
  const b = {}
  
  expect(a).to.equal(a)
  expect(a).to.not.equal(b)
  expect(a).to.not.loosely.equal(b)
  
  expect({}).to.be.an('Object')
  expect(8675309).to.be.a('Number')
  expect('').to.be.a('String')
  expect(false).to.be.a('Boolean')
  expect([]).to.be.an('Array')
  expect({}).to.not.be.an('Array')
  
  expect((function () { return arguments }())).to.be.an('Arguments')
  
  expect({ a: 'b' }).to.have.property('a')
  expect({ a: 'b', c: 'd' }).to.have.property('c')
  expect({ a: 'b', c: 'd' }[ 'c' ]).to.equal('d')
  
  expect([]).to.be.an('Array').and.to.be.an('object')
  
  expect(0).to.be.less.than.or.equal.to(1)
  expect(1).to.be.greater.than.or.equal.to(1)
  expect(1).to.not.be.greater.than.or.equal.to(2)
  
  expect('ass').to.not.equal('hat')
  expect('2').to.not.loosely.equal(5)
}

if (!module.parent) {
  const startedAt = Date.now()
  fn()
  console.info('Finished in %dms', Date.now() - startedAt)
}

module.exports = {
  fn
}