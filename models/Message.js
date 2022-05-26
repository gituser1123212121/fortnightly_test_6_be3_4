module.exports = (sequelize, Sequelize) => {
  const DataTypes = Sequelize.DataTypes;
  const Message = sequelize.define("Message", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sentOn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isGroupMessage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  return Message;
};
