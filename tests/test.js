'use strict'

const expect = require('chai').expect

function fn () {
  expect('a').to.equal('a')
  expect(3).to.equal(3)
  expect('b').to.not.equal('c')
  expect ('').to.not.equal(5)
  
  const a = {}
  const b = {}
  
  expect(a).to.equal(a)
  expect(a).to.not.equal(b)
  expect(a).to.not.equal(b)
  
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
  
  expect([]).to.be.an('Array').and.to.be.an('array')
  
  expect(0).to.be.below(1)
  expect(1).to.be.least(1)
  expect(1).to.not.be.least(2)
  
  expect('ass').to.not.equal('hat')
  expect('2').to.not.equal(5)

  expect({ a: 1 }).to.deep.equal({ a: 1 })
  expect(new Uint8Array([ 1, 2, 3 ])).to.deep.equal(new Uint8Array([ 1, 2, 3 ]))
  expect(Buffer.from([ 1, 2, 3 ])).to.deep.equal(Buffer.from([ 1, 2, 3 ]))
}

if (!module.parent) {
  console.time(__filename)
  fn()
  console.timeEnd(__filename)
}

module.exports = {
  fn
}
