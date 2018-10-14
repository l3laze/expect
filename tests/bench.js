'use strict'

console.time('Bench')
const max = 1000

function f1Test() {
  let i
  let f1Started = false
  console.time('f1Require')
  const f1 = require('./test.js').fn
  console.timeEnd('f1Require')

  for (i = 0; i < max; i++) {
    if (!f1Started) {
      console.time('f1Run')
      f1Started = true
    }

    f1()
  }
  console.timeEnd('f1Run')
}

function f2Test () {
  let i
  let f2Started = false
  console.time('f2Require')
  const f2 = require('./vanilla-test.js').fn
  console.timeEnd('f2Require')

  for (i = 0; i < max; i++) {
    if (!f2Started) {
      console.time('f2Run')
      f2Started = true
    }

    f2()
  }
  console.timeEnd('f2Run')
}

f1Test()
f2Test()

console.timeEnd('Bench')
