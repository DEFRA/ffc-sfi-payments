const { v4: uuidv4 } = require('uuid')
const db = require('../data')

const resetReferenceId = async (paymentRequestId, transaction) => {
  await db.paymentRequest.update({ referenceId: uuidv4() }, { where: { paymentRequestId }, transaction })
}

module.exports = {
  resetReferenceId
}
