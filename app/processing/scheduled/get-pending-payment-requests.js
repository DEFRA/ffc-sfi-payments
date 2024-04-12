const moment = require('moment')
const db = require('../../data')

const getPendingPaymentRequests = async (scheduledPaymentRequests, started, transaction) => {
  if (!scheduledPaymentRequests.length) {
    return []
  }

  const allPending = await db.sequelize.query(`
    SELECT
      "schedule".*,
      "paymentRequests"."frn",
      "paymentRequests"."schemeId",
      "paymentRequests"."marketingYear",
      "paymentRequests"."paymentRequestNumber"
    FROM 
      "schedule"
    INNER JOIN 
      "paymentRequests" ON "schedule"."paymentRequestId" = "paymentRequests"."paymentRequestId"
    WHERE 
      ("schedule"."started" > :startedMoment OR "schedule"."started" IS NULL)
      AND "schedule"."planned" <= :started
      AND "schedule"."completed" IS NULL
    `, {
    replacements: { startedMoment: moment(started).subtract(5, 'minutes').toDate(), started },
    transaction,
    type: db.Sequelize.QueryTypes.SELECT,
    raw: true
  })

  return allPending.filter(x =>
    !scheduledPaymentRequests.some(y => y.scheduleId === x.scheduleId))
}

module.exports = {
  getPendingPaymentRequests
}
