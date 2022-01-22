"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Users, {
        as: "users",
        foreignKey: "user_id",
      });
      Comment.belongsTo(models.Event, {
        as: "event",
        foreignKey: "event_id",
      });
    }
  }
  Comment.init(
    {
      description: DataTypes.TEXT,
      user_id: DataTypes.INTEGER,
      event_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Comment",
    },
  );
  return Comment;
};
