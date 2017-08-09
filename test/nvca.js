const assert = require('assert')
const psaCheck = require('../')
const defendants = require('./nvcaFactors.json')

defendants.forEach(function (defendant, idx) {
  const risk = psaCheck.isNvcaRisk(defendant, 'scaled')
  console.log(`
    Case #${defendant.case} - NVCA factors:
    1. Age at current arrest?: ${defendant.age}
    2. Pending charge?: ${defendant.pendingCharge}
    3. Current violent offense?: ${defendant.currentViolentOffense}
    4. Prior conviction?: ${defendant.priorFelony}
    5. Prior violent conviction?: ${defendant.priorViolentConviction}

    NVCA Risk: ${risk}
    `)
  assert.equal(risk, defendant.expectedNvcaFlag)
})
