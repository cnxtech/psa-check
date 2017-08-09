const assert = require('assert')
const psaCheck = require('../')
const defendants = require('./ncaFactors.json')

defendants.forEach(function (defendant, idx) {
  const risk = psaCheck.ncaRiskScore(defendant, 'scaled')
  console.log(`
    Case #${defendant.case} - NCA factors:
    1. Age at current arrest?: ${defendant.age}
    2. Pending charge?: ${defendant.pendingCharge}
    3. Prior misdemeanor conviction?: ${defendant.priorMisdemeanor}
    4. Prior felony conviction?: ${defendant.priorFelony}
    5. Prior violent conviction?: ${defendant.priorViolentConviction}
    6. Prior failure to appear pretrial in past 2 years?: ${defendant.priorFTA2yr}
    7. Prior sentence to incarceration?: ${defendant.priorIncarceration}

    NCA Risk Score: ${risk}
    `)
  assert.equal(risk, defendant.expectedNcaScore)
})
