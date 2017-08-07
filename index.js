
// helper function to scope to a 6-point scale
function clamp (number, lower = 0, upper = 6) {
  if (number === number) { // eslint-disable-line
    if (upper !== undefined) {
      number = number <= upper ? number : upper
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower
    }
  }
  return number
}

// return 'Failure to Appear' risk factor
function ftaRiskFactor (defendant) {
  const {
    pendingCharge,
    priorConviction,
    priorFTAolder,
    priorFTA2yr
  } = defendant.rapsheet

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
  return clamp(riskFactor)
}

// return 'New Criminal Activity' risk factor
function ncaRiskFactor (defendant) {
  const {
    pendingCharge,
    priorFTAolder,
    priorFTA2yr,
    priorIncarceration,
    priorMisdemeanor,
    priorFelony,
    priorViolentConviction
  } = defendant.rapsheet

  let riskFactor = 0

  if (defendant.age < 23) {
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
  if (priorFTAolder) {
    riskFactor++
  }
  if (priorIncarceration) {
    riskFactor += 2
  }
  return clamp(riskFactor)
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
  return verdictFromRatings(ftaRiskFactor(defendant), ncaRiskFactor(defendant))
}

// exports for testing
module.exports.verdictFromRatings = verdictFromRatings
module.exports.ncaRiskFactor = ncaRiskFactor
module.exports.ftaRiskFactor = ftaRiskFactor
