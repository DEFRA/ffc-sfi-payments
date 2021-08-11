const db = require('../data')
const config = require('../config')
const { AP, AR } = require('../ledgers')

const allocateToBatches = async (created = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const apPaymentRequests = await getPendingPaymentRequests(AP, transaction)
    const arPaymentRequests = await getPendingPaymentRequests(AR, transaction)
    if (apPaymentRequests.length) {
      await allocateToBatch(apPaymentRequests, AP, created, transaction)
    }
    if (arPaymentRequests.length) {
      await allocateToBatch(arPaymentRequests, AR, created, transaction)
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

const getPendingPaymentRequests = async (ledger, transaction) => {
  return db.scheme.findAll({
    transaction,
    lock: true,
    skipLocked: true,
    include: [{
      model: db.completedPaymentRequest,
      as: 'completedPaymentRequests',
      required: true,
      include: [{
        model: db.completedInvoiceLine,
        as: 'invoiceLines',
        required: true
      }],
      where: {
        ledger,
        batchId: null
      },
      order: ['completedPaymentRequestId'],
      limit: config.batchSize
    }]
  })
}

const allocateToBatch = async (schemes, ledger, created, transaction) => {
  for (const scheme of schemes) {
    if (scheme.completedPaymentRequests.length) {
      const sequence = await getAndIncrementSequence(scheme.schemeId, ledger, transaction)
      const batch = await createNewBatch(scheme.schemeId, ledger, sequence, created, transaction)
      await updatePaymentRequests(scheme, batch.batchId, transaction)
    }
  }
}

const getAndIncrementSequence = async (schemeId, ledger, transaction) => {
  const sequence = await getSequence(schemeId, transaction)
  let nextSequence
  if (ledger === AP) {
    nextSequence = sequence.nextAP
    sequence.nextAP = sequence.nextAP + 1
    await updateSequence(sequence, transaction)
    return nextSequence
  }
  nextSequence = sequence.nextAR
  sequence.nextAR = sequence.nextAR + 1
  await updateSequence(sequence, transaction)
  return nextSequence
}

const getSequence = async (schemeId, transaction) => {
  return db.sequence.findByPk(schemeId, { transaction })
}

const updateSequence = async (sequence, transaction) => {
  await db.sequence.update({
    nextAP: sequence.nextAP,
    nextAR: sequence.nextAR
  }, {
    where: { schemeId: sequence.schemeId },
    transaction
  })
}

const createNewBatch = async (schemeId, ledger, sequence, created, transaction) => {
  return db.batch.create({ schemeId, ledger, sequence, created }, { transaction })
}

const updatePaymentRequests = async (scheme, batchId, transaction) => {
  for (const paymentRequest of scheme.completedPaymentRequests) {
    await db.completedPaymentRequest.update({ batchId }, {
      where: {
        completedPaymentRequestId: paymentRequest.completedPaymentRequestId
      },
      transaction
    })
  }
}

module.exports = allocateToBatches
