#!/usr/bin/env node

const inquirer = require('inquirer')
const psaCheck = require('../')

const questions = [
  {
    type: 'input',
    name: 'age',
    message: 'Age at current arrest?',
    default: 18
  },
  {
    type: 'confirm',
    name: 'pendingCharge',
    message: 'Pending charge at the time of the offense?',
    default: false
  },
  {
    type: 'confirm',
    name: 'priorMisdemeanor',
    message: 'Prior misdemeanor conviction?',
    default: false
  },
  {
    type: 'confirm',
    name: 'priorConviction',
    message: 'Prior conviction (felony or misdemeanor)?',
    default: false
  },
  {
    type: 'confirm',
    name: 'priorIncarceration',
    message: 'Prior sentence to incarceration?',
    default: false
  },
  {
    type: 'list',
    name: 'priorViolentConviction',
    choices: ['0', '1', '2 or more'],
    message: 'Prior violent conviction?',
    default: '0'
  },
  {
    type: 'confirm',
    name: 'priorFTAolder',
    message: 'Prior failure to appear pretrial older than 2 years?',
    default: false
  },
  {
    type: 'list',
    choices: ['0', '1 or 2', '3 or more'],
    name: 'priorFTA2yr',
    message: 'Prior failure to appear pretrial in past 2 years?',
    default: '0'
  }
]

console.log('Public Safety Assessment check')

inquirer.prompt(questions).then(function (answers) {
  const {
    age,
    priorMisdemeanor,
    priorConviction,
    pendingCharge,
    priorIncarceration,
    priorViolentConviction,
    priorFTAolder,
    priorFTA2yr
  } = answers

  const defendant = {
    age,
    rapsheet: {
      priorMisdemeanor,
      priorConviction,
      pendingCharge,
      priorIncarceration,
      priorViolentConviction,
      priorFTAolder,
      priorFTA2yr
    }
  }

  const verdict = psaCheck(defendant)
  console.log(`
  PSA Risk scores:
  - Failure to Appear: ${verdict.fta}
  - New Criminal Activity: ${verdict.nca}
  
  Recommendation: ${verdict.code} - ${verdict.text}
    `)
})
