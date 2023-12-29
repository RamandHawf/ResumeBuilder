const packageSubscription = require("../packageSubscription");

module.exports = function (sequelize, DataTypes) {
  const {
    User,
    Role,
    UserData,
    AIresume,
    jobDetail,
    Resume,
    aiResumeVariants,
  } = sequelize.models;

  Role.hasMany(User, { foreignKey: "role_id" });
  User.belongsTo(Role, { foreignKey: "role_id" });
  User.hasMany(AIresume, { foreignKey: "userId" });
  AIresume.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(Resume, { foreignKey: "userId" });
  Resume.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(jobDetail, { foreignKey: "userId" });
  jobDetail.belongsTo(User, { foreignKey: "userId" });

  AIresume.hasMany(aiResumeVariants, { foreignKey: "aiReumeId" });
  aiResumeVariants.belongsTo(AIresume, { foreignKey: "aiResumeId" });

  // User.hasOne(UserData, { foreignKey: "userId" });
  // UserData.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(models.packageSubscription, {
    foreignKey: "userId", // The foreign key in the associated model (Profile)
  });

  packageSubscription.belongsTo(User, { foreignKey: "userId" });
};
