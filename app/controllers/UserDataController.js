const {sequelize} = require("../../models/index");
// Create User Data
exports.createUserData = async (req, res) => {
  const { UserData } = req.db.models;

  try {
    const { designation, account_no, userId } = req.body;
    console.log(req.body);

    const newUserData = await UserData.create({
      designation: designation,
      account_no: account_no,
      userId: userId,
    });

    return res.status(201).send({
      status: true,
      message: "User data created successfully.",
      userData: newUserData.toJSON(),
    });
  } catch (error) {
    console.error("Error creating user data:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while creating the user data.",
      error: error.message,
    });
  }
};

// Read User Data

exports.getUserDatabyid = async (req, res) => {
  const { UserData } = req.db.models;
  const { id } = req.params;
  try {
    const userData = await UserData.findOne({
      where: {
        id: id,
      },
    });
    return res.status(200).send({
      status: true,
      userData,
    });
  } catch (error) {
    console.error("Error getting user data:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while getting user data.",
      error: error.message,
    });
  }
};

exports.getUserData = async (req, res) => {
  const { UserData } = req.db.models;
  const { id } = req.params;
  console.log("The Id is :", id);
  try {
    const userData = await UserData.findAll();
    return res.status(200).send({
      status: true,
      userData,
    });
  } catch (error) {
    console.error("Error getting user data:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while getting user data.",
      error: error.message,
    });
  }
};

// Update User Data
exports.updateUserData = async (req, res) => {
  const { UserData } = req.db.models;

  try {
    const { designation, account_no } = req.body;
    const { id } = req.params;

    const updatedUserData = await UserData.update(
      {
        designation: designation,
        account_no: account_no,
      },
      {
        where: { id },
      }
    );

    if (updatedUserData[0] === 0) {
      return res.status(404).send({
        status: false,
        message: "User data not found.",
      });
    }

    return res.status(200).send({
      status: true,
      message: "User data updated successfully.",
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while updating user data.",
      error: error.message,
    });
  }
};

// Delete User Data
exports.deleteUserData = async (req, res) => {
  const { UserData, jobDetail, ResumeDetail, AIresume } = req.db.models;
  const { id } = req.params;
  const transaction = await sequelize.transaction(); // Start a transactionaa

  try {
    // Delete Onion
    await UserData.destroy({ where: { id }, transaction });

    // Delete related rows in Table1 and Table2
    await ResumeDetail.destroy({ where: { userDataId: id }, transaction });
    await AIresume.destroy({ where: { userDataId: id }, transaction });
    await jobDetail.destroy({ where: { userDataId: id }, transaction });

     await transaction.commit(); // Commit the transaction
  
  return res.status(200).json({
    status: true,
    message: "UserData and related rows deleted successfully.",
  });

    
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction in case of error
    console.error("Error deleting UserData and related rows:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while deleting UserData and related rows.",
      error,
    });
  }
};
