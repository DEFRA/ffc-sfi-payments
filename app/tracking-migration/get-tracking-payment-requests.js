const db = require('../data')

const getTrackingPaymentRequests = async (limit) => {
  const transaction = await db.sequelize.transaction()
  try {
    const prToSend = await db.paymentRequest.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { sentToTracking: false },
          { sentToTracking: null }
        ],
        received: {
          [db.Sequelize.Op.lte]: new Date('2024-05-23')
        }
      },
      include: [{
        model: db.completedPaymentRequest,
        as: 'completedPaymentRequest',
        required: false
      }],
      limit,
      transaction
    })

    const paymentRequestIds = prToSend.map(pr => pr.id)
    await db.paymentRequest.update(
      { sentToTracking: true },
      {
        where: {
          id: paymentRequestIds
        },
        transaction
      }
    )

    await transaction.commit()
    return prToSend
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = {
  getTrackingPaymentRequests
}
