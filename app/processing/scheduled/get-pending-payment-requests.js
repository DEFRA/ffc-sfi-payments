const moment = require('moment')
const db = require('../../data')

const getPendingPaymentRequests = async (scheduledPaymentRequests, started, transaction) => {
  if (!scheduledPaymentRequests.length) {
    return []
  }

  return db.sequelize.query(`
    SELECT
      "schedule".*,
      "paymentRequests"."frn",
      "paymentRequests"."schemeId",
      "paymentRequests"."marketingYear"
    FROM 
      "schedule"
    INNER JOIN 
      "paymentRequests" ON "schedule"."paymentRequestId" = "paymentRequests"."paymentRequestId"
    WHERE 
      "schedule"."started" > :startedMoment
      AND "schedule"."completed" IS NULL
    FOR UPDATE OF "schedule"`, {
    replacements: { startedMoment: moment(started).subtract(5, 'minutes').toDate() },
    transaction,
    type: db.Sequelize.QueryTypes.SELECT,
    raw: true
  })
}

module.exports = {
  getPendingPaymentRequests
}
