const db = require('../data')
const { removeHoldByFrn } = require('../holds')
const { CROSS_BORDER } = require('../constants/hold-categories-names')
const { saveInvoiceLines } = require('../inbound/save-invoice-lines')
const { invalidateInvoiceLines } = require('./invalidate-invoice-lines')

const updateRequestsAwaitingCrossBorder = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    const originalPaymentRequest = await db.paymentRequest.findOne({ transaction, where: { invoiceNumber: paymentRequest.invoiceNumber } })

    if (!originalPaymentRequest) {
      throw new Error(`No payment request matching Cross Border invoice number: ${paymentRequest.invoiceNumber}`)
    }

    await db.paymentRequest.update({
      deliveryBody: paymentRequest.deliveryBody,
      value: paymentRequest.value
    }, {
      transaction,
      where: { paymentRequestId: originalPaymentRequest.paymentRequestId }
    })

    await invalidateInvoiceLines(originalPaymentRequest.paymentRequestId, transaction)
    await saveInvoiceLines(paymentRequest.invoiceLines, originalPaymentRequest.paymentRequestId, transaction)
    await removeHoldByFrn(paymentRequest.schemeId, paymentRequest.frn, CROSS_BORDER)
    await transaction.commit()
  } catch (err) {
    console.log(err)
    await transaction.rollback()
  }
}

module.exports = {
  updateRequestsAwaitingCrossBorder
}
