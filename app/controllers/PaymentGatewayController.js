const crypto = require("crypto");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const validator = require("validator");

const sendMail = require("../../helpers/nodeMailer");
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

exports.createsubscription = async (req, res, next) => {
  try {
    const { email, priceId, paymentMethodId } = req.body;

    // Create a new customer
    const customer = await stripe.customers.create({
      email: email,
      // Add other customer information as needed
    });

    console.log("Customer created:", customer);

    // Create a Payment Method
    //   const paymentMethod = await stripe.paymentMethods.create({
    //     type: 'card',
    //     card: {
    //       number: '4242424242424242', // Replace with the actual card number
    //       exp_month: 12,              // Replace with the expiration month
    //       exp_year: 2025,             // Replace with the expiration year
    //       cvc: '123',                 // Replace with the CVC
    //     },
    //   });

    //   console.log('Payment method created:', paymentMethod);

    // Attach the Payment Method to the Customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id, // Replace with the customer's ID
    });

    console.log("Payment method attached to customer");

    // Create a subscription for the new customer
    const subscription = await stripe.subscriptions.create({
      customer: customer.id, // Use the newly created customer's ID
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
    });

    console.log("Subscription created:", subscription);

    res.json({ subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.createsubscription = async (req, res, next) => {
//     try {
//       const { email, priceId } = req.body;

//       // Create a new customer
//       const customer = await stripe.customers.create({
//         email: email,
//         // Add other customer information as needed
//       });

//       console.log('Customer created:', customer);

//       // Create a Payment Method using a test token (e.g., 'tok_visa')
//       const paymentMethod = await stripe.paymentMethods.create({
//         type: 'card',
//         card: {
//           token: 'tok_visa', // Use a test token provided by Stripe
//         },
//       });

//       console.log('Payment method created:', paymentMethod);

//       // Attach the Payment Method to the Customer
//       await stripe.paymentMethods.attach(paymentMethod.id, {
//         customer: customer.id, // Replace with the customer's ID
//       });

//       console.log('Payment method attached to customer');

//       // Create a subscription for the new customer
//       const subscription = await stripe.subscriptions.create({
//         customer: customer.id, // Use the newly created customer's ID
//         items: [{ price: priceId }],
//       });

//       console.log('Subscription created:', subscription);

//       res.json({ subscription });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };
