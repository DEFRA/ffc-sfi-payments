module.exports = (sequelize, DataTypes) => {
  const outbox = sequelize.define('outbox', {
    outboxId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completedPaymentRequestId: DataTypes.INTEGER,
    submitted: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'outbox',
    timestamps: false
  })
  outbox.associate = function (models) {
    outbox.belongsTo(models.completedPaymentRequest, {
      as: 'completedPaymentRequest',
      foreignKey: 'completedPaymentRequestId'
    })
  }
  return outbox
}
