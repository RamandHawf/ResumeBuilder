const express = require("express");
const router = express.Router();
const aiResumeVariantsController = require("../app/controllers/AIResumeVariantsController");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

// // Middleware to check subscription validity
const checkSubscriptionValidity = async (req, res, next) => {
  const { User } = req.db.models;

  const { userId } = req.body; // You can adjust this based on your API request

  try {
    User.findOne({
      where: {
        id: userId,
      },
    }).then(async (user) => {
      if (user) {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
        });

        const subscription = subscriptions.data[0]; // Assuming the customer has only one subscription

        if (!subscription) {
          res.status(404).json({
            status: false,
            message: "No subscription found for the customer.",
          });
          return;
        }

        const currentDate = Math.floor(Date.now() / 1000); // Current date in Unix timestamp

        if (
          subscription.cancel_at_period_end &&
          subscription.current_period_end <= currentDate
        ) {
          // The subscription is set to cancel at the end of the current period and it's past the end date
          res.status(403).json({
            status: false,
            message:
              "Your subscription has ended. Please purchase a new subscription.",
          });
        } else {
          // Store the subscription details in the request for later route handlers
          req.subscription = subscription;
          next(); // Proceed to the next route handler
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

router.post(
  "/create-airesumevariants",
  checkSubscriptionValidity,
  aiResumeVariantsController.createAiResumeVariant
);
router.get(
  "/getall-airesumevariants",
  aiResumeVariantsController.getAllAiResumeVariants
);
router.get(
  "/getairesumevariants/:id",
  aiResumeVariantsController.getAiResumeVariantById
);
router.put(
  "/update-airesumevariants/:id",
  aiResumeVariantsController.updateAiResumeVariant
);
router.delete(
  "/deleteairesume-variants/:id",
  aiResumeVariantsController.deleteAiResumeVariant
);

module.exports = router;
