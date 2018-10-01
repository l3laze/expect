'use strict'

const { format } = require('util')

const [ red, green, reset ] = [ '\u001B[31m', '\u001B[32m', '\u001B[0m' ]
const passed = format('%s%s %s', green, '\u2713', reset) // Green check mark
const failed = format('%s%s %s', red, '\u2620', reset) // Red skull & crossbones

function humanModeString () {
  const activeModes = Object.keys(this.mode)
    .filter((m) => /deep|loose|strict/.test(m) && this.mode[ m ] === true)
    .map((m) => m + 'ly')

  return (this.mode.not ? 'not ' : '') + activeModes.join(', ')
}

function deepEqual (v1, v2) {
  return v1 === v2
}

function makeAssertion (that, v2, comparatorName, comparator, inclMode = true) {
  const result = comparator(that.v1, v2)
  const modeString = that.humanModeString()
  const retVal = {
    pass: (result === !that.mode.not),
    message: format('Expected %j to %s%s %j.', that.v1,
      (inclMode
        ? modeString + ' '
        : that.mode.not
          ? 'not '
          : ''), comparatorName, v2),
    get and () {
      return that
    },
    set and (v) {
      return that
    },
    get or () {
      return that
    },
    set or (v) {
      return that
    }
  }

  that.mode.deep = false
  that.mode.loose = false
  that.mode.not = false
  that.mode.strict = true

  console.debug('%s %s', (retVal.pass ? passed : failed), retVal.message)

  return retVal
}

function be (that) {
  const beAOrAn = (a, b) => {
    return b !== 'Arguments'
      ? (typeof a === typeof b || typeof a === b || a.constructor.name.toLowerCase() === b.toLowerCase())
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
      that.mode.less = true
      that.mode.greater = false

      return this
    },
    set less (v) {
      that.mode.less = !!v
      that.mode.greater = false

      return this
    },
    get greater () {
      that.mode.less = false
      that.mode.greater = true

      return this
    },
    set greater (v) {
      that.mode.less = false
      that.mode.greater = !!v

      return this
    },
    get equal () {
      that.mode.equal = true

      return this
    },
    set equal (v) {
      that.mode.equal = !!v

      return this
    },
    get than () {
      return {
        or: {
          equal: {
            to: (v2) => {
              let [ label, fn ] = (that.mode.less
                ? [ 'be less than or equal to', (a, b) => a <= b ]
                : [ 'be greater than or equal to', (a, b) => a >= b ])
              return makeAssertion(that, v2, label, fn, false)
            }
          }
        }
      }
    },
    set than (v2) {
      let [ label, fn ] = (that.mode.less
        ? [ 'be less than', (a, b) => a < b ]
        : [ 'be greater than', (a, b) => a > b ])
      return makeAssertion(that, v2, label, fn, false)
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
      }, false),
    }
  }
}

function to (that) {
  const self = {
    equal: (v2) => makeAssertion(that, v2, 'equal', (a, b) => {
      if (that.mode.loose) {
        return a == b
      }
      else if (that.mode.deep) {
        return a === b
      } else {
        return a === b
      }
    }),
    get deeply () {
      that.mode.deep = true
      that.mode.loose = false
      that.mode.strict = false

      return self
    },
    set deeply (v) {
      that.mode.deep = !!v
      that.mode.loose = false
      that.mode.strict = false

      return self
    },
    get loosely () {
      that.mode.deep = false
      that.mode.loose = true
      that.mode.strict = false

      return self
    },
    set loosely (v) {
      that.mode.deep = false
      that.mode.loose = !!v
      that.mode.strict = false

      return self
    },
    get not () {
      that.mode.not = true

      return self
    },
    set not (v) {
      that.mode.not = !!v

      return self
    },
    get strictly () {
      that.mode.deep = false
      that.mode.loose = false
      that.mode.strict = true

      return self
    },
    set strictly (v) {
      that.mode.deep = false
      that.mode.loose = false
      that.mode.strict = !!v

      return self
    }
  }

  self.be = be(that)
  self.have = have(that)

  return self
}

function expect (v1) {
  const self = {
    v1,
    mode: {
      not: false,
      deep: false,
      loose: false,
      strict: true,
      less: false,
      greater: false,
      equal: false
    },
  }

  self.to = to(self)
  self.humanModeString = humanModeString.bind(self)

  return self
}

module.exports = {
  expect
}