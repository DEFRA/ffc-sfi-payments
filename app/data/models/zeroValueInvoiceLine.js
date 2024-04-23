module.exports = (sequelize, DataTypes) => {
  const zeroValueInvoiceLine = sequelize.define('zeroValueInvoiceLine', {
    zeroValueInvoiceLineId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completedPaymentRequestId: DataTypes.INTEGER,
    submitted: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'zeroValueInvoiceLine',
    timestamps: false
  })
  zeroValueInvoiceLine.associate = function (models) {
    zeroValueInvoiceLine.belongsTo(models.completedPaymentRequest, {
      as: 'completedPaymentRequest',
      foreignKey: 'completedPaymentRequestId'
    })
  }
  return zeroValueInvoiceLine
}
