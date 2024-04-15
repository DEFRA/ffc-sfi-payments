const db = require('../../data')
const { processingConfig } = require('../../config')

const getScheduledPaymentRequests = async (started, transaction) => {
  // This is written as a raw query for performance reasons
  const schedules = await db.sequelize.query(`
    WITH "plannedSchedules" AS (
      SELECT DISTINCT ON ("paymentRequests"."frn", "paymentRequests"."schemeId", "paymentRequests"."marketingYear")
        "schedule"."scheduleId",
        "paymentRequests"."frn",
        "paymentRequests"."schemeId",
        "paymentRequests"."marketingYear",
        "paymentRequests"."paymentRequestNumber"
      FROM 
        "schedule"
      INNER JOIN 
        "paymentRequests" ON "schedule"."paymentRequestId" = "paymentRequests"."paymentRequestId"
      INNER JOIN 
        "schemes" ON "paymentRequests"."schemeId" = "schemes"."schemeId"
      INNER JOIN 
        "invoiceLines" ON "paymentRequests"."paymentRequestId" = "invoiceLines"."paymentRequestId"
      WHERE 
        "schemes"."active" = true
        AND "schedule"."planned" <= NOW()
        AND "schedule"."completed" IS NULL
        AND ("schedule"."started" IS NULL OR "schedule"."started" <= NOW() - INTERVAL '5 minutes')
        AND NOT EXISTS (
          SELECT 1
          FROM 
            "holds"
          INNER JOIN 
            "holdCategories" ON "holds"."holdCategoryId" = "holdCategories"."holdCategoryId"
          WHERE "holds"."closed" IS NULL
          AND "paymentRequests"."frn" = "holds"."frn"
          AND "schemes"."schemeId" = "holdCategories"."schemeId"
        )
        AND NOT EXISTS (
          SELECT 1
          FROM "autoHolds"
          INNER JOIN "autoHoldCategories"
            ON "autoHolds"."autoHoldCategoryId" = "autoHoldCategories"."autoHoldCategoryId"
          WHERE "autoHolds"."closed" IS NULL
          AND "paymentRequests"."frn" = "autoHolds"."frn"
          AND "schemes"."schemeId" = "autoHoldCategories"."schemeId"
          AND "paymentRequests"."marketingYear" = "autoHolds"."marketingYear"
        )
        AND NOT EXISTS (
          SELECT 1
          FROM "schedule" "s2"
          INNER JOIN "paymentRequests" "p2"
          ON "s2"."paymentRequestId" = "p2"."paymentRequestId"
          WHERE
            "paymentRequests"."frn" = "p2"."frn"
            AND "paymentRequests"."schemeId" = "p2"."schemeId"
            AND "paymentRequests"."marketingYear" = "p2"."marketingYear"
            AND "s2"."started" > NOW() - INTERVAL '5 minutes'
            AND "s2"."completed" IS NULL
        )
      ORDER BY
        "paymentRequests"."frn",
        "paymentRequests"."schemeId",
        "paymentRequests"."marketingYear",
        "paymentRequests"."paymentRequestNumber",
        "schedule"."planned"
      LIMIT :processingCap
    )
    UPDATE "schedule"
    SET "started" = NOW()
    FROM "plannedSchedules"
    WHERE "schedule"."scheduleId" = "plannedSchedules"."scheduleId"
    RETURNING "schedule"."scheduleId"
    `, {
    replacements: {
      processingCap: processingConfig.processingCap
    },
    raw: true
  })

  const scheduledPaymentRequests = await db.schedule.findAll({
    transaction,
    include: [{
      model: db.paymentRequest,
      as: 'paymentRequest',
      include: [{
        model: db.invoiceLine,
        as: 'invoiceLines',
        required: true,
        where: {
          invalid: { [db.Sequelize.Op.ne]: true }
        }
      }, {
        model: db.scheme,
        as: 'scheme'
      }]
    }],
    where: {
      scheduleId: {
        [db.Sequelize.Op.in]: [...schedules[0].map(x => x.scheduleId)]
      }
    }
  })

  return scheduledPaymentRequests.map(x => x.get({ plain: true })).filter(x => x.paymentRequest)
}

module.exports = {
  getScheduledPaymentRequests
}
