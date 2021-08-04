module.exports = (sequelize, DataTypes) => {
  const completedPaymentRequest = sequelize.define('completedPaymentRequest', {
    completedPaymentRequestId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentRequestId: DataTypes.INTEGER,
    schemeId: DataTypes.INTEGER,
    batchId: DataTypes.INTEGER,
    ledger: DataTypes.STRING,
    sourceSystem: DataTypes.STRING,
    deliveryBody: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    sbi: DataTypes.STRING,
    marketingYear: DataTypes.INTEGER,
    agreementNumber: DataTypes.STRING,
    contractNumber: DataTypes.STRING,
    currency: DataTypes.STRING,
    schedule: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    value: DataTypes.INTEGER,
    acknowledged: DataTypes.DATE,
    settled: DataTypes.DATE
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
    completedPaymentRequest.belongsTo(models.batch, {
      foreignKey: 'batchId',
      as: 'batch'
    })
    completedPaymentRequest.belongsTo(models.schedule, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
  }
  return completedPaymentRequest
}
