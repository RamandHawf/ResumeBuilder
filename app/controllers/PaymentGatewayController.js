const crypto = require("crypto");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const validator = require("validator");

const sendMail = require("../../helpers/nodeMailer");
console.log("process.env.STRIPE_SECRET_KEY)", process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

exports.createpayment = async (req, res) => {
  try {
    const { priceId } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Payment methods allowed (e.g., card)
      line_items: [
        {
          // TODO: replace this with the `price` of the product you want to sell
          // price: '{{PRICE_ID}}',
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription", // 'payment' or 'subscription'
      success_url: "http://localhost:3000/success", // Redirect URL after successful payment
      cancel_url: "http://localhost:3000/cancel", // Redirect URL if payment is canceled
    });

    res.json({ id: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSubscription = async (req, res, next) => {
  try {
    const { priceId, paymentMethodId, customerId } = req.body;

    console.log(req.body);

    if (!priceId || !paymentMethodId || !customerId) {
      return res
        .status(400)
        .json({ message: "Provide all Details--Provided Details are empty" });
    }

    // Attach the payment method to the customer
    const rest = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set the payment method as the default for the customer
    const rest2 = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
    });
    console.log("Response of Payement Method aTTACH");
    console.log(rest);

    console.log(
      "Response of Customer Update for the data of PaymentMethod to default"
    );
    console.log(rest2);

    console.log("Subscription created:", subscription);

    res.status(200).send({ subscription });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to stop auto-renewal for a subscription
exports.stopAutoRenewal = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ message: "Subscription ID is required" });
    }

    const canceledSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    res.status(200).json({
      message: "Auto-renewal stopped",
      subscription: canceledSubscription,
    });
  } catch (error) {
    console.error("Error stopping auto-renewal:", error);
    res
      .status(500)
      .json({ message: "Failed to stop auto-renewal", error: error.message });
  }
};

// Endpoint to start auto-renewal for a subscription
exports.startAutoRenewal = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ message: "Subscription ID is required" });
    }

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: false,
      }
    );

    res.status(200).json({
      message: "Auto-renewal started",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Error starting auto-renewal:", error);
    res
      .status(500)
      .json({ message: "Failed to start auto-renewal", error: error.message });
  }
};

exports.getAllProductDetails = async (req, res) => {
  try {
    const products = await stripe.products.list();

    res.status(200).json(products.data);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      message: "Failed to fetch product details",
      error: error.message,
    });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { subscriptionId, newPriceId } = req.body;

    if (!subscriptionId || !newPriceId) {
      res
        .status(400)
        .send({ message: "Provide ProductPriceId and SubscriptionId!" });
    }

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [{ price: newPriceId }],
      }
    );

    res.status(200).json(updatedSubscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    if (!subscriptionId) {
      res.status(400).send({ message: "Provide Subscription Id!" });
    }

    const canceledSubscription = await stripe.subscriptions.del(subscriptionId);

    res.status(200).json({ message: "Subscription canceled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// stripe.products
//   .create({
//     name: "Your Product Name", // Replace with your product name
//     type: "service", // Change to 'good' or 'service' based on your use case
//   })
//   .then((product) => {
//     console.log("Product created:", product);

//     // Create a one-time payment (price without recurring)
//     return stripe.prices.create({
//       unit_amount: 999, // Replace with the price in cents
//       currency: "usd", // Change the currency as needed
//       recurring: null, // Set recurring to null for a one-time payment
//       product: product.id, // ID of the product created earlier
//     });
//   })
//   .then((price) => {
//     console.log("Price created:", price);
//   })
//   .catch((error) => {
//     console.error("Error creating product and price:", error);
//   });

// stripe.products.create({
//   name: 'Your Product Name', // Replace with your product name
//   type: 'service', // Change to 'good' or 'service' based on your use case
// })
//   .then(product => {
//     console.log('Product created:', product);

//     // Create a fixed-price subscription plan
//     return stripe.prices.create({
//       unit_amount: 999, // Replace with the subscription price in cents
//       currency: 'usd', // Change the currency as needed
//       recurring: {
//         interval: 'month', // Billing interval
//         interval_count: 1, // Set to 1 for monthly
//       },
//       nickname: 'Monthly Subscription', // Set the nickname for your subscription
//       product: product.id, // ID of the product created earlier
//     });
//   })
//   .then(price => {
//     console.log('Price created:', price);
//   })
//   .catch(error => {
//     console.error('Error creating product and price:', error);
//   });xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxz xx
//   });xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxz
