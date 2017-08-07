const assert = require('assert')
const psaCheck = require('../')
const defendants = require('./defendants.json')

defendants.forEach(function (defendant, idx) {
  const FTA = psaCheck.ftaRiskFactor(defendant)
  const NCA = psaCheck.ncaRiskFactor(defendant)
  const verdict = psaCheck(defendant)
  console.log(`
    Defendant #${idx + 1}
    - Crime: ${defendant.crime}
    - Scores: [ FTA:${FTA}, NCA:${NCA} ]
    - Recommendation ${verdict.code}, ${verdict.text}
    -----------------------------------------
    `)
  assert.equal(verdict.code, defendant.expected.verdict)
  assert.equal(FTA, defendant.expected.FTA)
  assert.equal(NCA, defendant.expected.NCA)
})
