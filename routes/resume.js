const express = require('express');
const router = express.Router();
const resumeController = require('../app/controllers/ResumeController');
// const PackageController = require('../app/controllers/PackageController');


// router.get('/login', jobeDetailController.loginPage);
// Create a new resume
router.post('/createresume', resumeController.createResume);

// Get resume by ID
router.get('/getallresumedata', resumeController.getallresume);

router.get('/getresumedatabyId/:id', resumeController.getResumeById);

// Update resume by ID
router.put('/updateresumedata/:id', resumeController.updateResumeById);

// Delete resume by ID
router.delete('/deleteresume/:id', resumeController.deleteResumeById);





module.exports = router;