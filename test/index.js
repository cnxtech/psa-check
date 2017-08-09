const assert = require('assert')
const psaCheck = require('../')
const defendants = require('./defendants.json')

defendants.forEach(function (defendant, idx) {
  const FTA = psaCheck.ftaRiskScore(defendant, 'scaled')
  const NCA = psaCheck.ncaRiskScore(defendant, 'scaled')
  const verdict = psaCheck(defendant)
  console.log(`
    Case #${defendant.case}
    - Crime: ${defendant.crime}
    - Scores: [ FTA:${FTA}, NCA:${NCA} ]
    - Recommendation ${verdict.code}, ${verdict.text}
    -----------------------------------------
    `)
  assert.equal(FTA, defendant.expected.FTA)
  assert.equal(NCA, defendant.expected.NCA)
  assert.equal(verdict.code, defendant.expected.verdict)
})
