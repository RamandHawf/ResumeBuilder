const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController');
// const PackageController = require('../app/controllers/PackageController');


// router.get('/login', AuthController.loginPage);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/verify', AuthController.accountVerify);
router.get('/fail', AuthController.fail);
router.get('/success', AuthController.success);
router.get('/verified', AuthController.verified);


// router.get('/sign-up', AuthController.signUpPage);
router.post('/signUp', AuthController.signUp);
// router.get('/forgot-password', AuthController.forgotPasswordPage);
router.post('/forgotPassword', AuthController.forgotPassword);
router.post('/resetPassword', AuthController.resetPassword);
router.post('/resendVerificationEmail', AuthController.resendVerificationEmail);
router.get('/stripepaymentsuccess', AuthController.paymentsuccessurl);
router.get('/stripepaymentfailure', AuthController.paymentfailureurl);






module.exports = router;