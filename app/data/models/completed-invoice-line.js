module.exports = (sequelize, DataTypes) => {
  const completedInvoiceLine = sequelize.define('completedInvoiceLine', {
    completedInvoiceLineId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completedPaymentRequestId: DataTypes.INTEGER,
    standardCode: DataTypes.STRING,
    schemeCode: DataTypes.STRING,
    accountCode: DataTypes.STRING,
    fundCode: DataTypes.STRING,
    description: DataTypes.STRING,
    value: DataTypes.INTEGER
  },
  {
    tableName: 'completedInvoiceLines',
    freezeTableName: true,
    timestamps: false
  })
  completedInvoiceLine.associate = function (models) {
    completedInvoiceLine.belongsTo(models.completedPaymentRequest, {
      foreignKey: 'completedPaymentRequestId',
      as: 'completedPaymentRequest'
    })
  }
  return completedInvoiceLine
}
