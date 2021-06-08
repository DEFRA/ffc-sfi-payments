module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define('payment', {
    paymentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoiceNumber: DataTypes.STRING,
    sbi: DataTypes.INTEGER,
    agreementNumber: DataTypes.STRING,
    paymentRequest: DataTypes.INTEGER,
    paymentAmount: DataTypes.DECIMAL,
    statusId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: 'payments',
    freezeTableName: true
  })
  payment.associate = function (models) {
    payment.hasOne(models.status, {
      foreignKey: 'statusId',
      as: 'status'
    })
  }
  return payment
}
