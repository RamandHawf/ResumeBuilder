const express = require('express');
const router = express.Router();
const jobeDetailController = require('../app/controllers/JobDetailController');
// const PackageController = require('../app/controllers/PackageController');


// router.get('/login', jobeDetailController.loginPage);
router.post('/createjobDetail', jobeDetailController.createJobDetail);
router.get('/getJobDetailById/:id', jobeDetailController.getJobDetailById);
router.get('/getAllJobDetail', jobeDetailController.getAllJobDetail);

router.put('/updateJobDetail/:id', jobeDetailController.updateJobDetail);
router.delete('/deleteJobDetail/:id', jobeDetailController.deleteJobDetail);





module.exports = router;