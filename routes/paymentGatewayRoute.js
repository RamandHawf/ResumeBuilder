const express = require("express");
const router = express.Router();
const paymentController = require("../app/controllers/PaymentGatewayController");
//For hosted Links
router.post("/createPayment", paymentController.createpayment);
router.post("/createSubscription", paymentController.createSubscription);
router.put("/stopAutoRenewalSubscription", paymentController.stopAutoRenewal);
router.put(
  "/startAutoRenewalSubscription",
  paymentController.startAutoRenewal
);
router.get("/getAllProductDetails", paymentController.getAllProductDetails);

router.put("/updateSubscription", paymentController.updateSubscription);

router.delete("/cancelSubscription", paymentController.cancelSubscription);

// Get resume by ID

module.exports = router;
