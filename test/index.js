const assert = require('assert')
const psaCheck = require('../')

const defendants = [
  {
    age: 43,
    case: 1,
    crime: 'CARJACKING AND RETAIN DRIVER OR OCCUPANT',
    name: 'REDACTED',
    rapsheet: {
      pendingCharge: true,
      priorConviction: 8,
      priorFTAolder: true,
      priorFTA2yr: 1,
      priorIncarceration: true,
      priorMisdemeanor: true,
      priorViolentConviction: true
    },
    expected: {
      verdict: 'NRR',
      FTA: 5,
      NCA: 6
    }
  },
  {
    age: 42,
    case: 2,
    crime: 'DRUG POSSESSION',
    name: 'REDACTED',
    rapsheet: {
      pendingCharge: false,
      priorConviction: 5,
      priorFTA2yr: 0,
      priorFTAolder: true,
      priorIncarceration: true
    },
    expected: {
      verdict: 'PML1',
      FTA: 2,
      NCA: 3
    }
  },
  {
    age: 27,
    case: 3,
    crime: 'DRUG POSSESSION',
    name: 'REDACTED',
    rapsheet: {
      pendingCharge: true,
      priorConviction: 2,
      priorFTA2yr: 1,
      priorFTAolder: false,
      priorIncarceration: false
    },
    expected: {
      verdict: 'PML2',
      FTA: 4,
      NCA: 4
    }
  },
  {
    age: 43,
    case: 4,
    crime: 'DRUG POSSESSION',
    name: 'REDACTED',
    rapsheet: {
      priorMisdemeanor: true,
      pendingCharge: true,
      priorConviction: 6,
      priorFTA2yr: 0,
      priorFTAolder: true,
      priorIncarceration: true
    },
    expected: {
      verdict: 'NRR',
      FTA: 3,
      NCA: 6
    }
  },
  {
    expectedVerdict: 'ROR',
    age: 60,
    case: 5,
    crime: 'TERRORISTIC THREATS',
    name: 'REDACTED',
    rapsheet: {
      priorMisdemeanor: true,
      pendingCharge: false,
      priorConviction: false,
      priorFTA2yr: 0,
      priorFTAolder: false,
      priorIncarceration: false
    },
    expected: {
      verdict: 'ROR',
      FTA: 1,
      NCA: 1
    }
  },
  {
    age: 21,
    case: 6,
    rapsheet: {
      priorConviction: true,
      pendingCharge: false,
      priorMisdemeanor: true,
      priorIncarceration: true,
      priorViolentConviction: 0,
      priorFTAolder: false,
      priorFTA2yr: 0
    },
    expected: {
      verdict: 'JD',
      FTA: 1,
      NCA: 5
    }
  }
]

defendants.forEach(function (defendant, idx) {
  const FTA = psaCheck.ftaRiskFactor(defendant)
  const NCA = psaCheck.ncaRiskFactor(defendant)
  const verdict = psaCheck(defendant)
  console.log(`
    Defendant #${idx + 1}
    - Age: ${defendant.age}
    - Prior Misdemeanor: ${defendant.rapsheet.priorMisdemeanor}
    - Prior conviction: ${defendant.rapsheet.priorConviction}
    - Pending charge: ${defendant.rapsheet.pendingCharge}
    - Prior incarceration: ${defendant.rapsheet.priorIncarceration}
    - Prior violent conviction: ${defendant.rapsheet.priorIncarceration}
    - Prior FTA: ${defendant.rapsheet.priorFTA2yr}
    
    ~ Recommendation ~
    - FTA score:${FTA} + NCA scrore:${NCA} = ${verdict.code}, ${verdict.text}
    -----------------------------------------
    `)
  assert.equal(verdict.code, defendant.expected.verdict)
  assert.equal(FTA, defendant.expected.FTA)
  assert.equal(NCA, defendant.expected.NCA)
})
