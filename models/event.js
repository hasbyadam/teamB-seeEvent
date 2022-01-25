"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Users, {
        as: "createdBy",
        foreignKey: "user_id",
      });
      Event.belongsTo(models.Category, {
        as: "category",
        foreignKey: "category_id",
      });
      Event.hasMany(models.Comment, { as: "comment", foreignKey: "event_id" });
    }
  }
  Event.init(
    {
      title: DataTypes.STRING,
      datetime: DataTypes.DATE,
      detail: DataTypes.TEXT,
      image: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Event",
    },
  );
  return Event;
};
