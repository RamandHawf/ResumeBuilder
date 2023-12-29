const crypto = require("crypto");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const validator = require("validator");

const sendMail = require("../../helpers/nodeMailer");
const { error } = require("console");
const { response } = require("express");
console.log("process.env.STRIPE_SECRET_KEY)", process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

exports.createpayment = async (req, res) => {
  try {
    const { User } = req.db.models;

    const { priceId } = req.body;
    const createdBy = req?.auth?.data?.userId;
    console.log(createdBy)

    const userdata = await User.findOne({
      where: {
        id: createdBy,
      },
    });
    if (!userdata.dataValues.stripeCustomerId) {
      res.status(200).send({ message: "Your Stripe CustomerId Does Not exist" })
    }
    // console.log(userdata.dataValues.stripeCustomerId)

    // res.send("Imee")
    if (userdata.dataValues.stripeCustomerId) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"], // Payment methods allowed (e.g., card)
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription", // 'payment' or 'subscription'
        success_url: `${process.env.URL_SERVER}/api/auth/stripepaymentsuccess`, // Redirect URL after successful payment
        cancel_url: `${process.env.URL_SERVER}/api/auth/stripepaymentfailure`, // Redirect URL if payment is canceled
        customer: userdata.dataValues.stripeCustomerId,
      });

      res.json({ id: session.url });
    }


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.createSubscription = async (req, res, next) => {
  const { packageSubscription, User } = req.db.models;
  const createdBy = req?.auth?.data?.userId;

  try {
    const { priceId, paymentMethodId, customerId, packageId } =
      req.body;

    console.log(req.body);

    if (!priceId || !paymentMethodId || !customerId || !createdBy || !packageId) {
      return res
        .status(400)
        .json({ message: "Provide all Details--Provided Details are empty" });
    }

    // Attach the payment method to the customer
    stripe.paymentMethods
      .attach(paymentMethodId, {
        customer: customerId,
      })
      .then((paymentMethod) => {
        // Step 1: Attach the payment method
        console.log("Payment method attached:", paymentMethod);

        return stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      })
      .then((customer) => {
        // Step 2: Update the customer with the default payment method
        console.log("Customer updated:", customer);

        return stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          default_payment_method: paymentMethodId,
        });
      })
      .then((subscription) => {
        // Step 3: Create a subscription
        console.log("Subscription created:", subscription);
        packageSubscription
          .create({
            userId: createdBy,
            subsciptionStatus: subscription.status,
            packageId: packageId,
            PurchasedsubscriptionId_Stripe: subscription.id,
          })
          .then(async (resp) => {

            res.status(200).send({
              status: true,
              message: "Subscription Purchased Successfully",
              data: resp,
            });
          })
          .catch((err) => {
            res
              .status(500)
              .send({ message: "Internal Server Error", error: err });
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ status: false, error: err });
      });
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
    } else {
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
    }
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
    } else {
      stripe.subscriptions
        .update(subscriptionId, {
          cancel_at_period_end: false,
        })
        .then((updateSubscription) => {
          console.log(updateSubscription);
          res.status(200).json({
            message: "Auto-renewal started",
            subscription: updateSubscription,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ status: false, error: err });
        });
    }
  } catch (error) {
    console.error("Error starting auto-renewal:", error);
    res
      .status(500)
      .json({ message: "Failed to start auto-renewal", error: error.message });
  }
}
  ;

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
    } else {
      const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          items: [{ price: newPriceId }],
        }
      );
      updatedSubscription
        ? res.status(400).send({ message: "Not Updated Successfully" })
        : res.status(200).json(updatedSubscription);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    if (!subscriptionId) {
      res.status(400).send({ message: "Provide Subscription Id!" });
    } else {
      const canceledSubscription = await stripe.subscriptions.del(
        subscriptionId
      );

      res.status(200).json({ message: "Subscription canceled successfully" });
    }
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
