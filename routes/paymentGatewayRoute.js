const express = require('express');
const router = express.Router();
const resumeController = require('../app/controllers/PaymentGatewayController');
// const PackageController = require('../app/controllers/PackageController');


// router.get('/login', jobeDetailController.loginPage);
// Create a new resume
router.post('/create-subscription', resumeController.createpayment);

// Get resume by ID







module.exports = router;