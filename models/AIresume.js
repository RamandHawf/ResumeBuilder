"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AIresume extends Model {
    static associate(models) {
      AIresume.hasMany(models.aiResumeVariants, { foreignKey: "aiResumeId" });
      models.aiResumeVariants.belongsTo(AIresume, { foreignKey: "aiResumeId" });
    }

    static getResumeDetails() {
      console.log("getResumeDetails method called");
    }
  }

  AIresume.init(
    {
      AIresumeLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      AIresumeDetail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // jobDetailId: {
      //   type: DataTypes.INTEGER, // Assuming packages' primary key is an integer
      //   allowNull: false,
      //   references: {
      //     model: "jobDetail", // The name of the referenced model
      //     key: "id", // The name of the referenced primary key column in the 'packages' table
      //   },
      // },
      // resumeDetailId: {
      //   type: DataTypes.INTEGER, // Assuming packages' primary key is an integer
      //   allowNull: false,
      //   references: {
      //     model: "ResumeDetail", // The name of the referenced model
      //     key: "id", // The name of the referenced primary key column in the 'packages' table
      //   },
      // },
    },
    {
      sequelize,
      modelName: "AIresume",
    }
  );

  return AIresume;
};
