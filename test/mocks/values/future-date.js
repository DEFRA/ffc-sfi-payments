const currentDate = new Date()
const futureDate = new Date(currentDate)
futureDate.setDate(currentDate.getDate() + 5)

module.exports = {
  FUTURE_DATE: futureDate
}
