"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class packageSubscription extends Model {
    static associate(models) {
      // Define the association to the 'packages' model
      packageSubscription.belongsTo(models.packages, {
        foreignKey: "packageId", // This is the name of the foreign key column in the packageSubscription table
        as: "package", // Alias for the association
      });
    }

    static getResumeDetails() {
      console.log("getResumeDetails method called");
    }
  }

  packageSubscription.init(
    {
      subsciptionStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subscriptionValidity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PurchasedsubscriptionId_Stripe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      packageId: {
        type: DataTypes.INTEGER, // Assuming packages' primary key is an integer
        allowNull: false,
        references: {
          model: "packages", // The name of the referenced model
          key: "id", // The name of the referenced primary key column in the 'packages' table
        },
      },
    },
    {
      sequelize,
      modelName: "packageSubscription",
    }
  );

  return packageSubscription;
};
