
// NVCA Questions:
// Current violent offense: No = 0; Yes = 2
// Current violent offense & 20 years old or younger: No = 0; Yes = 1
// Pending charge at the time of the offense: No = 0; Yes = 1
// Prior conviction: No = 0; Yes = 1
// Prior violent conviction: 0 = 0; 1 or 2 = 1; 3 or more = 2

function isNvcaRisk (defendant, typeFlag) {
  // merge rapsheet with defendant to flatten it out
  const riskFactors = Object.assign(defendant, defendant.rapsheet)
  const {
    pendingCharge,
    currentViolentOffense,
    priorConviction,
    priorViolentConviction
  } = riskFactors

  let riskFactor = 0
  if (currentViolentOffense) {
    riskFactor += 2
    if (defendant.age < 21) {
      riskFactor++
    }
  }
  if (priorConviction) {
    riskFactor++
  }
  if (pendingCharge) {
    riskFactor++
  }
  if (priorViolentConviction === 1 || priorViolentConviction === 2) {
    riskFactor++
  } else if (priorViolentConviction > 2) {
    riskFactor += 2
  }

  if (typeFlag === 'scaled') {
    return (riskFactor > 3) // 7-point scale
  }
  return riskFactor
}

// return 'Failure to Appear' risk factor
function ftaRiskScore (defendant, typeFlag) {
  // merge rapsheet with defendant to flatten it out
  const riskFactors = Object.assign(defendant, defendant.rapsheet)
  const {
    pendingCharge,
    priorConviction,
    priorFTAolder,
    priorFTA2yr
  } = riskFactors

  let riskFactor = 0
  if (pendingCharge) {
    riskFactor++
  }
  if (priorConviction) {
    riskFactor++
  }
  if (priorFTA2yr === 1) {
    riskFactor += 2
  } else if (priorFTA2yr >= 2) {
    riskFactor += 4
  }
  if (priorFTAolder) {
    riskFactor++
  }

  if (typeFlag === 'scaled') {
    const scale = [1, 2, 3, 4, 4, 5, 5, 6]
    return scale[riskFactor]
  }
  return riskFactor
}

// return 'New Criminal Activity' risk factor
function ncaRiskScore (defendant, typeFlag) {
  const riskFactors = Object.assign(defendant, defendant.rapsheet)
  const {
    pendingCharge,
    priorFTA2yr,
    priorIncarceration,
    priorMisdemeanor,
    priorFelony,
    priorViolentConviction
  } = riskFactors

  let riskFactor = 0

  if (defendant.age < 23) { // 22 or younger
    riskFactor = riskFactor + 2
  }
  if (pendingCharge) {
    riskFactor += 3
  }
  if (priorMisdemeanor) {
    riskFactor++
  }
  if (priorFelony) {
    riskFactor++
  }
  if (priorViolentConviction >= 1) {
    riskFactor++
  } else if (priorViolentConviction > 2) {
    riskFactor += 2
  }
  if (priorFTA2yr === 1) {
    riskFactor++
  } else if (priorFTA2yr >= 2) {
    riskFactor += 2
  }
  if (priorIncarceration) {
    riskFactor += 2
  }

  if (typeFlag === 'scaled') {
    const scale = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6, 6, 6]
    return scale[riskFactor]
  }
  return riskFactor
}

// combine risk factors to get verdict
function verdictFromRatings (fta, nca) {
  // recommendation table FTA/NCA
  const verdictMap = {
    FTA1: ['ROR', 'ROR', null, null, null, null],
    FTA2: ['ROR', 'ROR', 'PML1', 'PML2', 'PML3', null],
    FTA3: [null, 'PML1', 'PML1', 'PML2', 'PML3', 'NRR'],
    FTA4: [null, 'PML1', 'PML1', 'PML2', 'PML3', 'NRR'],
    FTA5: [null, 'PML2', 'PML2', 'PML3', 'PML3+', 'NRR'],
    FTA6: [null, null, null, 'NRR', 'NRR', 'NRR']
  }

  const verdicts = {
    ROR: {
      text: 'release with no conditions',
      markup: 'release with <em>no conditions</em> [ROR]'
    },
    PML1: {
      text: 'release with minimal conditions, defendant is required to report by telephone once per month',
      markup: 'release with minimal conditions, defendant is required to report by telephone <em>once per month</em>'
    },
    PML2: {
      text: 'release with conditions including a curfew and drug testing, defendant is required to report by telephone and in person once per month',
      markup: 'release <em>with conditions</em> including a curfew and drug testing, defendant is required to report by telephone and in person <em>once per month</em> [PML2]'
    },
    PML3: {
      text: 'release with conditions including a curfew and drug testing, defendant is required to report by telephone and in person once every other week',
      markup: 'release <em>with conditions</em> including a curfew and drug testing, defendant is required to report by telephone and in person <em>once every other week</em> [PML3]'
    },
    'PML3+': {
      text: 'release with conditions including electronic monitoring or house arrest and defendant is required to report by telephone and in person once every other week',
      markup: 'release with conditions including <em>electronic monitoring or house arrest</em> and defendant is required to report by telephone and in person <em>once every other week</em> [PML3+]'
    },
    NRR: {
      text: 'no release, and if released, defendant must have electronic monitoring or home detention',
      markup: 'no release, and if released, defendant must have electronic monitoring or home detention [NRR]'
    },
    JD: { text: 'judge\'s discretion', markup: 'judge\'s discretion' }
  }

  const FTA = fta || 1 // fta can be zero, but not for verdicts
  const NCA = nca || 1
  const code = verdictMap['FTA' + FTA][NCA - 1] || 'JD'
  const text = verdicts[code].text
  const markup = verdicts[code].markup
  return { fta, nca, code, text, markup }
}

// psaCheck() default export
module.exports = function (defendant) {
  return verdictFromRatings(ftaRiskScore(defendant, 'scaled'), ncaRiskScore(defendant, 'scaled'))
}

// exports for testing
module.exports.verdictFromRatings = verdictFromRatings
module.exports.ncaRiskScore = ncaRiskScore
module.exports.ftaRiskScore = ftaRiskScore
module.exports.isNvcaRisk = isNvcaRisk
