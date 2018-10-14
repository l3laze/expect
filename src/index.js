'use strict'

const { format } = require('util')
const deepEqual = require('./fastDeepEqual.js')
const debug = (typeof process.env.DEBUG !== 'undefined'
  ? require('ebug')('expect')
  : function ignore (...args) {})

const [ red, green, reset ] = [ '\u001B[31m', '\u001B[32m', '\u001B[0m' ]
const passed = format('%s%s %s', green, '\u2713', reset) // Green check mark
const failed = format('%s%s %s', red, '\u2620', reset) // Red skull & crossbones

function humanModifierString (modifier) {
  const activemodifiers = Object.keys(modifier)
    .filter((m) => /deep|loose|strict/.test(m) && modifier[ m ] === true)
    .map((m) => m + 'ly')

  return (modifier.not ? 'not ' : '') + activemodifiers.join(', ')
}

function makeAssertion (that, v2, comparatorName, comparator, inclModifier = true) {
  const result = comparator(that.v1, v2)
  const modifierString = humanModifierString(that.modifier)
  that.retVal.pass = (result === !that.modifier.not)
  that.retVal.message = format('Expected %j to %s%s %j.', that.v1,
    (inclModifier
      ? modifierString + ' '
      : that.modifier.not
        ? 'not '
        : ''), comparatorName, v2)

  that.modifier.deep = false
  that.modifier.loose = false
  that.modifier.not = false
  that.modifier.strict = true

  that.modifier.greater = false
  that.modifier.less = false

  debug('%s %s', (that.retVal.pass ? passed : failed), that.retVal.message)

  return that.retVal
}

function be (that) {
  const beAOrAn = (a, b) => {
    return b.toString().toLowerCase() !== 'arguments'
      ? (typeof a === typeof b || '' + typeof a === '' + b || a.constructor.name.toLowerCase() === b.toLowerCase())
      : Object.prototype.toString.call(a) === '[object Arguments]'
  }

  return {
    a: (v2) => {
      return makeAssertion(that, v2, 'be a', beAOrAn, false)
    },
    an: (v2) => {
      return makeAssertion(that, v2, 'be an', beAOrAn, false)
    },
    get less () {
      that.modifier.less = true
      that.modifier.greater = false

      return this
    },
    get greater () {
      that.modifier.less = false
      that.modifier.greater = true

      return this
    },
    get than () {
      return {
        or: {
          equal: {
            to: (v2) => {
              let [ label, fn ] = (that.modifier.less
                ? [ 'be less than or equal to', (a, b) => a <= b ]
                : [ 'be greater than or equal to', (a, b) => a >= b ])
              return makeAssertion(that, v2, label, fn, false)
            }
          }
        }
      }
    }
  }
}

function have (that) {
  return {
    property: (v2) => makeAssertion(that, v2, 'have property', (a, b) => {
      return a.hasOwnProperty(b)
    }, false),
    length: {
      of: (v2) => makeAssertion(that, v2, 'have length of', (a, b) => {
        return a.length === b
      }, false)
    }
  }
}

function to (that) {
  const equal = (v2) => makeAssertion(that, v2, 'equal', (a, b) => {
    if (that.modifier.loose) {
      return a == b // eslint-disable-line eqeqeq
    } else if (that.modifier.deep) {
      return deepEqual(a, b)
    } else {
      return a === b
    }
  })

  const self = {
    get deeply () {
      that.modifier.deep = true
      that.modifier.loose = false
      that.modifier.strict = false

      return { equal }
    },
    get loosely () {
      that.modifier.deep = false
      that.modifier.loose = true
      that.modifier.strict = false

      return { equal }
    },
    get not () {
      that.modifier.not = true

      return self
    },
    get strictly () {
      that.modifier.deep = false
      that.modifier.loose = false
      that.modifier.strict = true

      return { equal }
    },
    equal
  }

  self.be = be(that)
  self.have = have(that)

  return self
}

function expect (v1) {
  const self = {
    v1,
    modifier: {
      not: false,
      deep: false,
      loose: false,
      strict: true,
      less: false,
      greater: false
    }
  }

  self.retVal = {
    pass: null,
    message: '',
    get and () {
      return self
    },
    get or () {
      return self
    }
  }

  self.to = to(self)

  return self
}

module.exports = {
  expect
}
