module.exports = (sequelize, DataTypes) => {
  const hold = sequelize.define('hold', {
    holdId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    holdCategoryId: DataTypes.INTEGER,
    applied: DataTypes.DATE,
    removed: DataTypes.DATE
  },
  {
    tableName: 'holds',
    freezeTableName: true,
    timestamps: false
  })
  hold.associate = function (models) {
    hold.belongsTo(models.holdCategory, {
      foreignKey: 'holdCategoryId',
      as: 'holdCategory'
    })
  }
  return hold
}
