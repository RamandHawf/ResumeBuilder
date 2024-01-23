const express = require('express');
const router = express.Router();
const userDataController = require('../app/controllers/UserDataController');
// const PackageController = require('../app/controllers/PackageController');
// router.get('/login', jobeDetailController.loginPage);
// Create a new resume
router.post('/createUserData', userDataController.createUserData);

// Get user data by ID
router.get('/getAllUserData', userDataController.getUserDataALL);

router.get("/getUserDataById/:id", userDataController.getUserDatabyid);
router.get("/getUserData", userDataController.getUserData);


// Update user data by ID
// router.put('/updateuserdata/:id', userDataController.updateUserData);
router.put('/updateUserData', userDataController.updateUserData);

// Delete user data by ID
// router.delete('/deleteuserdata/:id', userDataController.deleteUserData);

router.delete('/deleteUserData/:id', userDataController.deleteUserData);




module.exports = router;