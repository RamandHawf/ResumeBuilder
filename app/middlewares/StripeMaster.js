const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

exports.checkTrialStatus = async (req, res, next) => {
  try {
    const customerId = req.user.stripeCustomerId; // Replace with how you store the customer ID

    // Retrieve the customer's subscription
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.subscriptions.data.length > 0) {
      const subscription = customer.subscriptions.data[0];

      if (
        subscription.status === "active" &&
        subscription.trial_end <= Math.floor(Date.now() / 1000)
      ) {
        // The trial has ended; you can take appropriate action here
        req.isTrialEnded = true;
      }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error checking trial status" });
  }
};

exports.checkSubscriptionValidity = async (req, res, next) => {
  const { User } = req.db.models;
  const { userId } = req.body; // You can adjust this based on your API reques

  try {
    if (!userId) {
      res
        .status(200)
        .send({ message: false, message: "No userId is provided" });
    } else {
      User.findOne({
        where: {
          id: userId,
        },
      }).then(async (user) => {
        try {
          //   console.log(user);
          console.log(user.dataValues.stripeCustomerId);
          if (user) {
            const subscriptions = await stripe.subscriptions.list({
              customer: user.dataValues.stripeCustomerId,
            });

            console.log("yes", subscriptions);
            const subscription = subscriptions.data[0]; // Assuming the customer has only one subscription

            if (!subscription) {
              res.status(404).json({
                status: false,
                message:
                  "No subscription found for the customer Purchase Subscription .",
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
        } catch (error) {
          res.status(500).send({
            message: "Internal Server Error",
            status: false,
            error: error,
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

//
// const checkSubscriptionValidity = async (req, res, next) => {
//   const { User } = req.db.models;

//   const { userId } = req.body; // You can adjust this based on your API request

//   try {
//     User.findOne({
//       where: {
//         id: userId,
//       },
//     }).then(async (user) => {
//       if (user) {
//         const subscriptions = await stripe.subscriptions.list({
//           customer: user.stripeCustomerId,
//         });

//         const subscription = subscriptions.data[0]; // Assuming the customer has only one subscription

//         if (!subscription) {
//           res.status(404).json({
//             status: false,
//             message: "No subscription found for the customer.",
//           });
//           return;
//         }

//         const currentDate = Math.floor(Date.now() / 1000); // Current date in Unix timestamp

//         if (
//           subscription.cancel_at_period_end &&
//           subscription.current_period_end <= currentDate
//         ) {
//           // The subscription is set to cancel at the end of the current period and it's past the end date
//           res.status(403).json({
//             status: false,
//             message:
//               "Your subscription has ended. Please purchase a new subscription.",
//           });
//         } else {
//           // Store the subscription details in the request for later route handlers
//           req.subscription = subscription;
//           next(); // Proceed to the next route handler
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ status: false, error: error.message });
//   }
// };
