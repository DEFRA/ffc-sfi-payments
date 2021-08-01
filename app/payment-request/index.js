const db = require('../data')
const paymentRequestSchema = require('./payment-request-schema')

async function savePaymentRequest (paymentRequest) {

  const validationResult = paymentRequestSchema.validate(paymentRequest)

  if (validationResult.error) {
    throw new Error(`Payment request is invalid. ${validationResult.error.message}`)
  }

  await db.paymentRequest.create({ 
    sourceSystem: paymentRequest.sourceSystem,
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
    value: paymentRequest.value }).then(result => processInvoiceLines(paymentRequest.invoiceLines, result.paymentRequestId))
}

async function processInvoiceLines(invoiceLines, paymentRequestId) {
  
  if (invoiceLines.length > 0){
    for(const invoiceLine of invoiceLines){
      await db.invoiceLine.create({
        paymentRequestId: paymentRequestId,
        standardCode: invoiceLine.standardCode,
        accountCode: invoiceLine.accountCode,
        fundCode: invoiceLine.fundCode,
        description: invoiceLine.description,
        value: invoiceLine.value
      })
    }
  }
}


module.exports = {
  savePaymentRequest
}
