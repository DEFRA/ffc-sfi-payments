module.exports = (sequelize, DataTypes) => {
  const hold = sequelize.define('hold', {
    holdId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    holdCategoryId: DataTypes.INTEGER,
    frn: DataTypes.BIGINT,
    added: DataTypes.DATE,
    closed: DataTypes.DATE
  },
  {
    tableName: 'holds',
    freezeTableName: true,
    timestamps: false
  })
  hold.associate = (models) => {
    hold.belongsTo(models.holdCategory, {
      foreignKey: 'holdCategoryId',
      as: 'holdCategory'
    })
  }
  return hold
}
