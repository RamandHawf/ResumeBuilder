const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class aiResumeVariants extends Model {
    static associate(models) {
      aiResumeVariants.belongsTo(models.ResumeDetail, {
        foreignKey: "resumeDetailId", // This is the name of the foreign key column in the packageSubscription table
        as: "ResumeDetail", // Alias for the association
      });

      aiResumeVariants.belongsTo(models.jobDetail, {
        foreignKey: "jobDetailId", // This is the name of the foreign key column in the packageSubscription table
        as: "jobDetail", // Alias for the association
      });
    }

    static getaiResumeVariants() {
      console.log("getResumeDetails method called");
    }
  }

  aiResumeVariants.init(
    {
      // ... define attributes for ResumeDetail
      aiResume_VariantLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      aiResume_VariantDetail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "aiResumeVariants",
    }
  );

  return aiResumeVariants;
};
