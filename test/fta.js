const assert = require('assert')
const psaCheck = require('../')
const defendants = require('./ftaFactors.json')

defendants.forEach(function (defendant, idx) {
  const risk = psaCheck.ftaRiskScore(defendant, 'scaled')
  console.log(`
    Case #${defendant.case} - FTA factors:
    1. Pending charge: ${defendant.pendingCharge}
    2. Prior conviction: ${defendant.priorConviction}
    3. Prior failure to appear pretrial in past 2 years: ${defendant.priorFTA2yr}
    4. Prior failure to appear pretrial older than 2 years: ${defendant.priorFTAolder}

    FTA Risk Score: ${risk}
    `)
  assert.equal(risk, defendant.expectedFtaScore)
})
