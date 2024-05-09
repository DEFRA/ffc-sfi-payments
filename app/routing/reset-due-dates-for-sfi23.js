const resetDueDatesForSFI23 = (paymentRequests, previousPaymentRequests, dueDate) => {
  // payments received back from request editor have the adjusted due date based on outstanding schedule.
  // while not generally an issue, it causes issues for recalculation of schedule for SFI23 PPA and advanced payments.
  // in order for correct processing of schedule for SFI23 PPA where an advanced payment is present, we need to ensure our schedule is reset to the original.
  const firstPaymentRequest = previousPaymentRequests?.find(x => x.paymentRequestNumber === 1)
  const advancePayment = previousPaymentRequests?.find(x => x.paymentRequestNumber === 0)
  if (firstPaymentRequest && advancePayment && /^.*2023$/.test(advancePayment?.dueDate)) {
    paymentRequests.forEach(request => {
      request.dueDate = dueDate
    })
  }
}

module.exports = {
  resetDueDatesForSFI23
}
