const psaCheck = require('../')

const ftaRatings = [1, 2, 3, 4, 5, 6]
const ncaRatings = [1, 2, 3, 4, 5, 6]

console.log('All FTA/NCA rating scenarios')

ftaRatings.forEach(function (fta) {
  ncaRatings.forEach(function (nca) {
    const verdict = psaCheck.verdictFromRatings(fta, nca)
    console.log(`FTA:${fta}, NCA:${nca} = ${verdict.code}`)
  })
})
