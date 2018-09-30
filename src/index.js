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
    message: format('Expected %j to %s%s %j.', that.v1, (inclMode ? modeString + ' ' : that.mode.not ? 'not ' : ''), comparatorName, v2)
  }

  that.mode.deep = false
  that.mode.loose = false
  that.mode.not = false
  that.mode.strict = true

  console.debug('%s %s', (retVal.pass ? passed : failed), retVal.message)

  return retVal
}

function be (that, parent) {
  const self = {
    a: (v2) => {
      const first = v2.charAt(0).toLowerCase()
      const vowStart = (first === 'a' || first === 'e' || first === 'i' || first === 'o' || first === 'u' || first === 'y')
      const cname = (vowStart ? 'be an' : 'be a')
      return makeAssertion(that, v2, cname, (a, b) => {
        return a.constructor.name === b
      }, false)
    },
  }

  return self
}

function have (that, parent) {
  const self = {
    property: (v2) => makeAssertion(that, v2, 'have property', (a, b) => {
      return a.hasOwnProperty(b)
    }, false),
  }

  return self
}

function to (that) {
  const self = {
    equal: (v2) => makeAssertion(that, v2, 'equal', (a, b) => {
      if (that.mode.loose) return a == b
      else if (that.mode.deep) return a === b
      // strict by default
      else return a === b
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
    },
    get and () {
      that.mode.and = true
      that.mode.or = false
    },
    set and (v) {
      that.mode.and = !!v
      that.mode.or = false
    },
    get or () {
      that.mode.and = false
      that.mode.or = true
    },
    set or (v) {
      that.mode.and = false
      that.mode.or = !!v
    }
  }

  self.be = be(that, self)
  self.have = have(that, self)

  return self
}

function expect (v1) {
  const self = {
    v1,
    mode: {
      and: false,
      not: false,
      deep: false,
      loose: false,
      or: false,
      strict: true
    },
  }

  self.to = to(self)
  self.humanModeString = humanModeString.bind(self)

  return self
}

module.exports = {
  expect
}