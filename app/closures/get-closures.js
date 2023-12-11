const db = require('../data')

const getClosures = async (open = true) => {
  return db.frnAgreementClosed.findAll({
    include: [{
      model: db.scheme,
      as: 'scheme',
      attributes: []
    }
    ],
    raw: true,
    attributes: ['closedId', [db.Sequelize.col('scheme.schemeId'), 'schemeId'], [db.Sequelize.col('scheme.name'), 'schemeName'], 'frn', 'agreementNumber', 'closureDate']
  })
}

module.exports = {
  getClosures
}
