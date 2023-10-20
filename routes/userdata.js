const express = require('express');
const router = express.Router();
const userDataController = require('../app/controllers/UserDataController');
// const PackageController = require('../app/controllers/PackageController');
// router.get('/login', jobeDetailController.loginPage);
// Create a new resume
router.post('/createuserdata', userDataController.createUserData);

// Get user data by ID
router.get('/getalluserdata', userDataController.getUserData);

router.get("/getuserdatabyid/:id", userDataController.getUserDatabyid);


// Update user data by ID
router.put('/updateuserdata/:id', userDataController.updateUserData);

// Delete user data by ID
router.delete('/deleteuserdata/:id', userDataController.deleteUserData);





module.exports = router;