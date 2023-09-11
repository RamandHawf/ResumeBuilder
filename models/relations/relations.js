
module.exports = function(sequelize,DataTypes){
const {User,Role,UserData,AIresume,jobDetail,Resume}=sequelize.models;

Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });
UserData.hasMany(AIresume,{foreignKey: 'userDataId'});
AIresume.belongsTo(UserData,{foreignKey: 'userDataId'});

UserData.hasMany(Resume,{foreignKey: 'userDataId'});
Resume.belongsTo(UserData,{foreignKey: 'userDataId'})

UserData.hasMany(jobDetail,{foreignKey: 'userDataId'});
jobDetail.belongsTo(UserData,{foreignKey: 'userDataId'})

User.hasOne(UserData,{foreignKey: 'userId'});
UserData.belongsTo(User,{foreignKey: 'userId'})

}