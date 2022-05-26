module.exports = (sequelize, Sequelize) => {
  const DataTypes = Sequelize.DataTypes;
  const GroupMessage = sequelize.define("GroupMessage", {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return GroupMessage;
};
