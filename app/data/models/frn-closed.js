module.exports = (sequelize, DataTypes) => {
  const frnClosed = sequelize.define('frnClosed', {
    frn: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: false }
  },
  {
    tableName: 'frnClosed',
    freezeTableName: true,
    timestamps: false
  })
  return frnClosed
}
