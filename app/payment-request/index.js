const db = require('../data')

async function savePaymentRequest (paymentRequest) {

  let paymentRequestId = null

  await db.paymentRequest.create({ sourceSystem: paymentRequest.sourceSystem,
    deliveryBody: paymentRequest.deliveryBody,
    invoiceNumber: paymentRequest.invoiceNumber,
    frn: paymentRequest.frn,
    sbi: paymentRequest.sbi,
    paymentRequestNumber: paymentRequest.paymentRequestNumber,
    agreementNumber: paymentRequest.agreementNumber,
    contractNumber: paymentRequest.contractNumber,
    currency: paymentRequest.currency,
    schedule: paymentRequest.schedule,
    dueDate: paymentRequest.dueDate,
    value: paymentRequest.value }).then(result => paymentRequestId = result.paymentRequestId)

    return paymentRequestId
}

module.exports = {
  savePaymentRequest
}
