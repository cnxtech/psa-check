const assert = require('assert')
const psaCheck = require('../')
const defendants = require('./defendants.json')

defendants.forEach(function (defendant, idx) {
  const risk = psaCheck.ncaRiskFactor(defendant)
  console.log(`
    Defendant #${idx + 1} - NCA questions:
    - Age at current arrest?: ${defendant.age}
    - Pending charge?: ${defendant.rapsheet.pendingCharge}
    - Prior conviction?: ${defendant.rapsheet.priorConviction}
    - Prior misdemeanor conviction?: ${defendant.rapsheet.priorMisdemeanor}
    - Prior felony conviction?: ${defendant.rapsheet.priorFelony}
    - Prior violent conviction?: ${defendant.rapsheet.priorViolentConviction}
    - Prior failure to appear pretrial in past 2 years?: ${defendant.rapsheet.priorFTA2yr}
    - Prior sentence to incarceration?: ${defendant.rapsheet.priorIncarceration}
    
    NCA Risk Score: ${risk}
    `)
  assert.equal(risk, defendant.expected.NCA)
})
