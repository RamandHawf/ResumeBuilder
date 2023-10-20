const express = require("express");
const router = express.Router();
const packageSubscriptionController = require("../app/controllers/packageSubscriptionController");

// Create a new package subscription
router.post("/", packageSubscriptionController.createPackageSubscription);

// Retrieve all package subscriptions
router.get("/", packageSubscriptionController.findAllPackageSubscription);

// Retrieve a single package subscription by ID
router.get("/:id", packageSubscriptionController.findOnePackageSubscription);

// Update a package subscription by ID
router.put("/:id", packageSubscriptionController.updatePackageSubscription);

// Delete a package subscription by ID
router.delete("/:id", packageSubscriptionController.deletePackageSubscription);

module.exports = router;
