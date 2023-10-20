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
  UserData.hasMany(AIresume, { foreignKey: "userDataId" });
  AIresume.belongsTo(UserData, { foreignKey: "userDataId" });

  UserData.hasMany(Resume, { foreignKey: "userDataId" });
  Resume.belongsTo(UserData, { foreignKey: "userDataId" });

  UserData.hasMany(jobDetail, { foreignKey: "userDataId" });
  jobDetail.belongsTo(UserData, { foreignKey: "userDataId" });

  AIresume.hasMany(aiResumeVariants, { foreignKey: "aiReumeId" });
  aiResumeVariants.belongsTo(AIresume, { foreignKey: "aiResumeId" });

  User.hasOne(UserData, { foreignKey: "userId" });
  UserData.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(models.packageSubscription, {
    foreignKey: "userId", // The foreign key in the associated model (Profile)
  });

  packageSubscription.belongsTo(User, { foreignKey: "userId" });
};
