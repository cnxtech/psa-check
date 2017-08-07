const assert = require('assert')
const psaCheck = require('../')
const defendants = require('./defendants.json')

defendants.forEach(function (defendant, idx) {
  const risk = psaCheck.ftaRiskFactor(defendant)
  console.log(`
    Defendant #${idx + 1} - FTA questions:
    - Pending charge: ${defendant.rapsheet.pendingCharge}
    - Prior conviction: ${defendant.rapsheet.priorConviction}
    - Prior failure to appear pretrial in past 2 years: ${defendant.rapsheet.priorFTA2yr}
    - Prior failure to appear pretrial older than 2 years: ${defendant.rapsheet.priorFTAolder}
    
    FTA Risk Score: ${risk}
    `)
  assert.equal(risk, defendant.expected.FTA)
})
