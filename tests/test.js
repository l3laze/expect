'use strict'

const { expect } = require ('./../src/index.js')
const startedAt = Date.now()

console.info('Should pass')

expect('a').to.equal('a')
expect(3).to.equal(3)
expect('b').to.not.equal('c')
expect ('').to.not.loosely.equal(5)
expect ('').to.not.equal(5)

const a = {}
const b = {}

expect(a).to.equal(a)
expect(a).to.not.equal(b)
expect(a).to.not.loosely.equal(b)

expect({}).to.be.a('Object')
expect({}).to.not.be.a('Array')
expect(8675309).to.be.a('Number')

expect({a: 'b'}).to.have.property('a')

console.info('Should fail')

expect('ass').to.equal('hat')
expect('2').to.loosely.equal(5)

