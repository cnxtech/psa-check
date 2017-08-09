#!/usr/bin/env node

const inquirer = require('inquirer')
const psaCheck = require('../')

const questions = [
  {
    type: 'confirm',
    name: 'pendingCharge',
    message: 'Pending charge at the time of the offense? (FTA/NCA)',
    default: false
  },
  {
    type: 'confirm',
    name: 'currentViolentOffense',
    message: 'Current violent offense?',
    default: false
  },
  {
    type: 'list',
    choices: ['0', '1 or 2', '3 or more'],
    name: 'priorFTA2yr',
    message: 'Prior failure to appear pretrial in past 2 years? (FTA/NCA)',
    default: '0'
  },
  {
    type: 'confirm',
    name: 'priorFTAolder',
    message: 'Prior failure to appear pretrial older than 2 years? (FTA)',
    default: false
  },
  {
    type: 'confirm',
    name: 'priorConviction',
    message: 'Prior conviction? (FTA)',
    default: false
  },
  {
    type: 'input',
    name: 'age',
    message: 'Age at current arrest? (NCA)',
    default: 18
  },
  {
    type: 'confirm',
    name: 'priorMisdemeanor',
    message: 'Prior misdemeanor conviction? (NCA)',
    default: false
  },
  {
    type: 'confirm',
    name: 'priorFelony',
    message: 'Prior felony conviction? (NCA)',
    default: false
  },
  {
    type: 'confirm',
    name: 'priorIncarceration',
    message: 'Prior sentence to incarceration? (NCA)',
    default: false
  },
  {
    type: 'list',
    name: 'priorViolentConviction',
    choices: ['0', '1', '2 or more'],
    message: 'Prior violent conviction? (NCA)',
    default: '0'
  }
]

console.log('Public Safety Assessment check')

inquirer.prompt(questions).then(function (answers) {
  const {
    age,
    priorMisdemeanor,
    priorConviction,
    priorFelony,
    pendingCharge,
    priorIncarceration,
    priorViolentConviction,
    priorFTAolder,
    priorFTA2yr
  } = answers

  const defendant = {
    age,
    priorMisdemeanor,
    priorConviction,
    priorFelony,
    pendingCharge,
    priorIncarceration,
    priorViolentConviction,
    priorFTAolder,
    priorFTA2yr
  }

  const verdict = psaCheck(defendant)
  console.log(`
  PSA Risk scores:
  - Failure to Appear: ${verdict.fta}
  - New Criminal Activity: ${verdict.nca}

  Recommendation: ${verdict.code} - ${verdict.text}
    `)
})
