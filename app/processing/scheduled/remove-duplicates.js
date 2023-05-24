const removeDuplicates = (scheduledPaymentRequests) => {
  return scheduledPaymentRequests.reduce((x, y) => {
    const isDuplicate = (currentSchedule) => {
      return x.some((schedule) => {
        return (schedule.paymentRequest.schemeId === currentSchedule.paymentRequest.schemeId &&
          schedule.paymentRequest.frn === currentSchedule.paymentRequest.frn &&
          schedule.paymentRequest.marketingYear === currentSchedule.paymentRequest.marketingYear)
      })
    }

    if (isDuplicate(y)) {
      return x
    } else {
      return [...x, y]
    }
  }, [])
}

module.exports = {
  removeDuplicates
}
