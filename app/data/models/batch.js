module.exports = (sequelize, DataTypes) => {
  const batch = sequelize.define('batch', {
    batchId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ledger: DataTypes.STRING,
    sequence: DataTypes.INTEGER,
    published: DataTypes.DATE
  },
  {
    tableName: 'batches',
    freezeTableName: true,
    timestamps: false
  })
  batch.associate = function (models) {
    batch.hasMany(models.completedPaymentRequest, {
      foreignKey: 'batchId',
      as: 'completedPaymentRequests'
    })
  }
  return batch
}
