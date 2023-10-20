"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class packages extends Model {
    static associate(models) {}

    static getResumeDetails() {
      console.log("getResumeDetails method called");
    }
  }

  packages.init(
    {
      packageName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      packagePriceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      packageDetail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "packages",
    }
  );

  return packages;
};
