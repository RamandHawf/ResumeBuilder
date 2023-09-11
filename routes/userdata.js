const express = require('express');
const router = express.Router();
const userDataController = require('../app/controllers/UserDataController');
// const PackageController = require('../app/controllers/PackageController');
// router.get('/login', jobeDetailController.loginPage);
// Create a new resume
router.post('/createUserData', userDataController.createUserData);

// Get user data by ID
router.get('/getAllUserData', userDataController.getUserData);

router.get('/getUserDatabyId/:id', userDataController.getUserDatabyid);


// Update user data by ID
router.put('/updateUserData/:id', userDataController.updateUserData);

// Delete user data by ID
router.delete('/deleteUserData/:id', userDataController.deleteUserData);





module.exports = router;