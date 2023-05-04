module.exports = (sequelize, DataTypes) => {
  const completedInvoiceLine = sequelize.define('completedInvoiceLine', {
    completedInvoiceLineId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completedPaymentRequestId: DataTypes.INTEGER,
    schemeCode: DataTypes.STRING,
    accountCode: DataTypes.STRING,
    fundCode: DataTypes.STRING,
    agreementNumber: DataTypes.STRING,
    description: DataTypes.STRING,
    value: DataTypes.INTEGER,
    convergence: DataTypes.BOOLEAN,
    deliveryBody: DataTypes.STRING
  },
  {
    tableName: 'completedInvoiceLines',
    freezeTableName: true,
    timestamps: false
  })
  completedInvoiceLine.associate = (models) => {
    completedInvoiceLine.belongsTo(models.completedPaymentRequest, {
      foreignKey: 'completedPaymentRequestId',
      as: 'completedPaymentRequest'
    })
  }
  return completedInvoiceLine
}
