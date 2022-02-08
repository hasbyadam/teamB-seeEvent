"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Event, { as: "event", foreignKey: "user_id" });
      Users.hasMany(models.Comment, { as: "comment", foreignKey: "user_id" });
    }
  }
  Users.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
    },
  );
  return Users;
};
