const createMessage = (paymentRequest) => {
  return {
    body: paymentRequest,
    type: 'uk.gov.defra.ffc.pay.processed',
    source: 'ffc-pay-processing'
  }
}

module.exports = createMessage
