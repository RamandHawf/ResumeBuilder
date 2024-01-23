const { sequelize } = require("../../models/index");
// Create User Data
exports.createUserData = async (req, res) => {
  const { UserData } = req.db.models;
  const createdBy = req?.auth?.data?.userId;

  try {
    const { designation, address, phone_no, city, country, } = req.body;
    // console.log(req.body);

    const userdatabyuserid = await UserData.findOne({
      where: {
        userId: createdBy
      }
    })
    // console.log(userdatabyuserid?.dataValues)

    if (userdatabyuserid?.dataValues) {
      return res.status(201).send({
        status: true,
        message: "User data is already created.",
        userData: userdatabyuserid
        // userData: newUserData.toJSON(),
      });
    }


    const newUserData = await UserData.create({
      designation: designation,
      address: address,
      phone_no: phone_no,
      city: city,
      country: country,
      userId: createdBy,
    });

    return res.status(201).send({
      status: true,
      message: "User data created successfully.",
      userData: newUserData
      // userData: newUserData.toJSON(),
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
  // const { id } = req.params;
  const createdBy = req?.auth?.data?.userId;
  const id = req.params.id
  try {
    const userData = await UserData.findByPk(id);

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
  const createdBy = req?.auth?.data?.userId;


  // console.log("The Id is :", id);
  try {

    const { User, Role } = req.db.models;

    // const userId = req?.auth?.data?.userId;
    const user = await User.findOne({
      attributes: [
        "id",
        "fullName",
        "email",
        "isVerified"],

      where: {
        id: createdBy,
      },
      include: [
        {
          model: UserData,
          // required: false,
        },
      ],
    })


    // const userData = await UserData.findAll(
    //   {
    //     where: {
    //       userId: createdBy
    //     }
    //   }
    // );
    return res.status(200).send({
      status: true,
      user,
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



exports.getUserDataALL = async (req, res) => {
  const { UserData } = req.db.models;
  const { id } = req.params;
  const createdBy = req?.auth?.data?.userId;


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
    const { designation, address, phone_no, city, country, } = req.body;

    // const { id } = req.params;

    const createdBy = req?.auth?.data?.userId;


    const updatedUserData = await UserData.update(
      {
        designation: designation,
        address: address, phone_no: phone_no, city: city, country: country,
      },
      {
        where: { userId: createdBy },
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

  const { UserData } = req.db.models;

  // const createdBy = req?.auth?.data?.userId;
  try {
    const userData = await UserData.findByPk(req.params.id);
    if (!userData) {
      return res.status(404).json({ error: 'UserData not found' });
    }

    await userData.destroy();
    res.json({ message: 'UserData deleted successfully' });
  } catch (error) {
    console.error('Error deleting UserData:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
















// try {
//   // Delete Onion
//   await UserData.destroy({ where: { id }, transaction });

//   // Delete related rows in Table1 and Table2
//   await ResumeDetail.destroy({ where: { userDataId: id }, transaction });
//   await AIresume.destroy({ where: { userDataId: id }, transaction });
//   await jobDetail.destroy({ where: { userDataId: id }, transaction });

//   await transaction.commit(); // Commit the transaction

//   return res.status(200).json({
//     status: true,
//     message: "UserData and related rows deleted successfully.",
//   });


// } catch (error) {
//   await transaction.rollback(); // Rollback the transaction in case of error
//   console.error("Error deleting UserData and related rows:", error);
//   return res.status(500).json({
//     status: false,
//     message: "An error occurred while deleting UserData and related rows.",
//     error,
//   });
// }