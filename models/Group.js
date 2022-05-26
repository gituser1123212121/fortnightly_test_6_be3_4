module.exports = (sequelize, Sequelize) => {
  const DataTypes = Sequelize.DataTypes;
  const Group = sequelize.define("Group", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Group;
};
