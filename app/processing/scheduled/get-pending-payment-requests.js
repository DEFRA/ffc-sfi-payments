const moment = require('moment')
const db = require('../../data')

const getPendingPaymentRequests = async (scheduledPaymentRequests, started, transaction) => {
  if (!scheduledPaymentRequests.length) {
    return []
  }

  const scheduledPropsToCheck = scheduledPaymentRequests.map(spr => ({
    frn: spr.paymentRequest.frn,
    schemeId: spr.paymentRequest.schemeId,
    marketingYear: spr.paymentRequest.marketingYear
  }))

  const replacements = { startedMoment: moment(started).subtract(5, 'minutes').toDate() }
  const conditions = scheduledPropsToCheck.map((sch, idx) => {
    replacements[`frn${idx}`] = sch.frn
    replacements[`schemeId${idx}`] = sch.schemeId
    replacements[`marketingYear${idx}`] = sch.marketingYear
    return `("paymentRequests"."frn" = :frn${idx} AND "paymentRequests"."schemeId" = :schemeId${idx} AND "paymentRequests"."marketingYear" = :marketingYear${idx})`
  })

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
      AND (${conditions.join(' OR ')})
    FOR UPDATE OF "schedule"`, {
    replacements,
    transaction,
    type: db.Sequelize.QueryTypes.SELECT,
    raw: true
  })
}

module.exports = {
  getPendingPaymentRequests
}
