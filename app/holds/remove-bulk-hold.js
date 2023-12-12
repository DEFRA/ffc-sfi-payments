const db = require('../data')
const { REMOVED } = require('../constants/hold-statuses')
const { sendHoldEvent } = require('../event')

const removeBulkHold = async (data) => {
  for (let i = 0; i < data.length; i++) {
    const hold = await db.hold.findOne({ where: { frn: data[i], closed: null }, raw: true })
    if (hold) {
      const holdClosed = new Date()
      await db.hold.update({ closed: holdClosed }, { where: { frn: data[i], closed: null } })
      await sendHoldEvent({ ...hold, closed: holdClosed }, REMOVED)
    }  
  }
}

module.exports = { removeBulkHold }
