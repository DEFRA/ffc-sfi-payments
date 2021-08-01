module.exports = (sequelize, DataTypes) => {
  const batch = sequelize.define('batch', {
    batchId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeId: DataTypes.INTEGER,
    ledger: DataTypes.STRING,
    sequence: DataTypes.INTEGER,
    created: DataTypes.DATE,
    started: DataTypes.DATE,
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
      as: 'paymentRequests'
    })
    batch.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
  }
  return batch
}
