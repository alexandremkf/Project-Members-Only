module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User);
  };

  return Message;
};