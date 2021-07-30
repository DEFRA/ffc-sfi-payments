module.exports = (sequelize, DataTypes) => {
  const schedule = sequelize.define('schedule', {
    scheduleId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentRequestId: DataTypes.INTEGER,
    planned: DataTypes.DATE,
    started: DataTypes.DATE,
    completed: DataTypes.DATE
  },
  {
    tableName: 'schedule',
    freezeTableName: true,
    timestamps: false
  })
  schedule.associate = function (models) {
    schedule.belongsTo(models.paymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'paymentRequest'
    })
  }
  return schedule
}
