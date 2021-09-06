module.exports = (sequelize, DataTypes) => {
  const completedPaymentRequest = sequelize.define('completedPaymentRequest', {
    completedPaymentRequestId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentRequestId: DataTypes.INTEGER,
    schemeId: DataTypes.INTEGER,
    ledger: DataTypes.STRING,
    sourceSystem: DataTypes.STRING,
    deliveryBody: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    sbi: DataTypes.STRING,
    marketingYear: DataTypes.INTEGER,
    agreementNumber: DataTypes.STRING,
    contractNumber: DataTypes.STRING,
    paymentRequestNumber: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    schedule: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    debtType: DataTypes.STRING,
    recoveryDate: DataTypes.STRING,
    originalSettlementDate: DataTypes.STRING,
    originalInvoiceNumber: DataTypes.STRING,
    invoiceCorrectionReference: DataTypes.STRING,
    value: DataTypes.INTEGER,
    submitted: DataTypes.DATE,
    acknowledged: DataTypes.DATE,
    settled: DataTypes.DATE,
    invalid: DataTypes.BOOLEAN
  },
  {
    tableName: 'completedPaymentRequests',
    freezeTableName: true,
    timestamps: false
  })
  completedPaymentRequest.associate = function (models) {
    completedPaymentRequest.belongsTo(models.paymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'paymentRequest'
    })
    completedPaymentRequest.hasMany(models.completedInvoiceLine, {
      foreignKey: 'completedPaymentRequestId',
      as: 'invoiceLines'
    })
    completedPaymentRequest.belongsTo(models.schedule, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
  }
  return completedPaymentRequest
}
