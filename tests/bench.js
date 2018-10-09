'use strict'

const benchStarted = Date.now()

const f2 = require('./vanilla-test.js').fn
const f2Reqd = Date.now() - benchStarted
console.info('f2 took %dms to require', f2Reqd)

const f1 = require('./test.js').fn
const f1Reqd = Date.now() - (f2Reqd + benchStarted)
console.info('f1 took %dms to require', f1Reqd)

const max = 1000
let i
let f1Started

for (i = 0; i < max; i++) {
  if (!f1Started) {
    f1Started = Date.now()
  }

  f1()
}
const f1Ended = Date.now()
console.info('f1 took %dms to run', f1Ended - f1Started)

let f2Started
for (i = 0; i < max; i++) {
  if (!f2Started) {
    f2Started = Date.now()
  }

  f2()
}
const f2Ended = Date.now()
console.info('f2 took %dms to run', f2Ended - f2Started)

console.info('Finished in %dms', Date.now() - benchStarted)
