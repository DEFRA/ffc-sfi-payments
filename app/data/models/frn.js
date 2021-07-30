module.exports = (sequelize, DataTypes) => {
  return sequelize.define('frn', {
    sbi: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    frn: DataTypes.BIGINT
  },
  {
    tableName: 'frns',
    freezeTableName: true,
    timestamps: false
  })
}
