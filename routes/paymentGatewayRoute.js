const express = require("express");
const router = express.Router();
const paymentController = require("../app/controllers/PaymentGatewayController");

router.post("/create-subscription", paymentController.createSubscription);
router.put("/stop-autorenewal-subscription", paymentController.stopAutoRenewal);
router.put(
  "/start-autorenewal-subscription",
  paymentController.startAutoRenewal
);
router.get("/getAllProductDetails", paymentController.getAllProductDetails);

router.put("/updateSubscription", paymentController.updateSubscription);

router.delete("/cancelSubscription", paymentController.cancelSubscription);

// Get resume by ID

module.exports = router;
