const crypto = require("crypto");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const path = require("path");
const validator = require("validator");
console.log("process.env.STRIPE_SECRET_KEY ", process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const sendMail = require("../../helpers/nodeMailer");
const { error } = require("console");
const { resolveSoa } = require("dns");

exports.login = (req, res, next) => {
  try {
    const { User } = req.db.models;
    console.log(User);
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push("Please enter a valid email address.");
    if (validator.isEmpty(req.body.password))
      validationErrors.push("Password cannot be blank.");
    if (validationErrors.length) {
      return res
        .status(400)
        .send({ status: false, message: "Email and Password is required." });
    }
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (user) {
          bcrypt
            .compare(req.body.password, user.password)
            .then(async (doMatch) => {
              if (doMatch) {
                // req.session.isLoggedIn = true;
                // req.session.user = .dataValues;
                // return req.session.save(err => {
                // 	console.log(err);
                // 	res.redirect('/');
                // });
                if (!user.dataValues.isVerified) {
                  return res.status(200).send({
                    status: false,
                    message:
                      "Email veification is required, verify your email and try again.",
                  });
                }
                const token = await jwt.sign(
                  {
                    data: { userId: user.dataValues.id },
                  },
                  process.env.JWT_TOKEN_KEY,
                  { expiresIn: "1h" }
                );

                const refreshToken = await jwt.sign(
                  {
                    data: { userId: user.dataValues.id },
                  },
                  process.env.JWT_REFRESH_TOKEN_KEY,
                  { expiresIn: "7d" }
                );
                const { fullName, id, email } = user.dataValues;

                return res.status(200).send({
                  status: true,
                  message: "Login successfull.",
                  token,
                  refreshToken,
                  user: { fullName, id, email },
                });
              } else {
                return res.status(200).send({
                  status: false,
                  message: "Email or Password is incorrect.",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).send({
                status: false,
                message: "Sorry! Somethig went wrong.",
                err,
              });
            });
        } else {
          return res
            .status(200)
            .send({ status: false, message: "No user found with this email" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500)({
          status: false,
          message: "Sorry! Somethig went wrong.",
          err,
        });
      });
  } catch (err) {
    return res
      .status(400)
      .send({ status: false, message: "Sorry! Somethig went wrong.", err });
  }
};

exports.logout = (req, res, next) => {
  if (res.locals.isAuthenticated) {
    req.session.destroy((err) => {
      return res.redirect("/");
    });
  } else {
    return res.redirect("/login");
  }
};

const HTTP_STATUS = {
  NOT_FOUND: 404,
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
};

exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { User } = req.db.models;
    const { email } = req.body;
    // console.table(email)
    const user = await findUserByEmail(User, email);
    // console.log(user)
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Not Found User", data: user });
    }

    // console.log(user?.isVerified === true)


    if (user.isVerified === true) {
      return res.status(HTTP_STATUS.OK).json({ message: "User is already verified" });
    }
    else {

      const token = await generateVerificationToken(email);
      // console.log(token)
      await user.update({
        verificationToken: token,
      });
      await sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Verify Email",
        text: "reset email",
        html: `<b>Verify email at <a href=${process.env.VERIFY_URL}/verify?verificationToken=${token}>Click Here to verify Email</a></b>`,
      });

      return res.status(HTTP_STATUS.OK).json({ message: "Email Sent Successfully. Check your Mailbox", url: `${process.env.VERIFY_URL}/verify?verificationToken=${token}` });
    }

  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ status: false, error: error.message });
  }
};

async function findUserByEmail(model, email) {

  return await model.findOne({
    where: {
      email,
    },
  });
}

async function generateVerificationToken(email) {
  return await jwt.sign(
    { data: { email } },
    process.env.JWT_VERIFY_TOKEN,
    { expiresIn: process.env.VERIFY_TOKEN_EXPIRY }
  );
}


exports.signUp = (req, res, next) => {
  const { User } = req.db.models;
  console.log(User);

  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return bcrypt
          .hash(req.body.password, 12)
          .then(async (hashedPassword) => {
            const token = await jwt.sign(
              {
                data: { email: req.body.email },
              },
              process.env.JWT_VERIFY_TOKEN,
              { expiresIn: `${process.env.VERIFY_TOKEN_EXPIRY}` }
            );
            const customer = await stripe.customers.create({
              email: req.body.email,
            });

            const user = new User({
              fullName: req.body.fullName,
              email: req.body.email,
              password: hashedPassword,
              verificationToken: token,
              isVerified: 0,
              stripeCustomerId: customer.id,
              userType: "Basic Plan",
            });
            // console.log()
            let a = user.save();
            console.log(a);
            return a;
          })
          .then(async (result) => {
            console.log(result.dataValues.verificationToken);
            await sendMail({
              from: `${process.env.EMAIL}`, // sender address
              to: req.body.email, // list of receivers
              subject: "Verify Email", // Subject line
              text: "reset email", // plain text body
              html: `<b>Verify email at <a href=${process.env.VERIFY_URL
                }/verify?verificationToken=${result.dataValues.verificationToken.toString()}>Click Here to verify Email</a></b>`,
              // html body
            });
            return res.status(200).send({
              status: true,
              message: "User created succcessfully.",
              // testURI: emailResponse.testURI,
            });
          });
      } else {
        return res.status(400).send({
          status: false,
          message: "E-Mail exists already, please pick a different one.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .send({ status: false, message: "Error creating user", err });
    });
};

exports.accountVerify = async (req, res, next) => {

  // console.log("yes and no")
  try {
    const { User } = req.db.models;

    const { verificationToken } = req.query;
    console.log(process.env.JWT_VERIFY_TOKEN);
    // console.log(verificationToken);
    console.log(verificationToken)
    var decoded = await jwt.verify(
      verificationToken,
      process.env.JWT_VERIFY_TOKEN
    );
    console.log('Decoded Token', decoded)




    // console.log(decoded, "Ndde mailer")
    User.findOne({
      where: {
        email: decoded.data.email,
      },
    })
      .then(async (user) => {

        console.log("Haf", user)
        if (user && user.dataValues.verificationToken === verificationToken) {
          let result = await user.update({
            isVerified: true,
            verificationToken: null,
          });
          if (result) {
            // console.log("one")
            res.redirect(process.env.VERIFY_RETURN_URL_SUCCESS);
          } else {
            // console.log("two")

            res.redirect(process.env.VERIFY_RETURN_URL_FAIL);
          }
        } else {
          // console.log("three y")

          // console.log("Count")
          // console.log(process.env.VERIFY_RETURN_URL_FAIL)
          res.redirect(process.env.VERIFY_RETURN_URL_VERIFIED);

        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Something went wrong", err });
  }
};

exports.verified = async (req, res, next) => {
  try {

    res.sendFile(path.join(__dirname, "..", "..", "public", "success1.html"));

  } catch (error) {
    res.status(500).send({ status: false, message: "Internal Server Error" })
  }
}
exports.success = async (req, res, next) => {
  try {
    const { User } = req.db.models;
    res.sendFile(path.join(__dirname, "..", "..", "public", "success.html"));
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Something went wrong", err });
  }
};
exports.fail = async (req, res, next) => {
  try {
    const { User } = req.db.models;
    res.sendFile(path.join(__dirname, "..", "..", "public", "fail.html"));
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Something went wrong", err });
  }
};
exports.forgotPassword = async (req, res, next) => {
  const { User } = req.db.models;

  const validationErrors = [];
  console.log("email", req.body.email);
  try {
    if (!validator.isEmail(req?.body?.email))
      validationErrors.push("Please enter a valid email address.");

    if (validationErrors.length) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid email address" });
    }

    User.findOne({
      where: {
        email: req?.body?.email,
      },
    })
      .then(async (user) => {
        if (user) {
          const token = await jwt.sign(
            {
              data: { email: req.body.email },
            },
            process.env.JWT_RESET_TOKEN,
            { expiresIn: `${process.env.VERIFY_TOKEN_EXPIRY}` }
          );

          user.resetToken = token;
          user.resetTokenExpiry = Date.now() + 3600000;
          const userSave = await user.save();
          if (!userSave) {
            return res
              .status(500)
              .send({ status: false, message: "Something went wrong" });
          }
          let emailResponse = await sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "Reset password Email", // Subject line
            text: "reset email", // plain text body
            html: `<b>Verify email at <a href=${process.env.VERIFY_URL}/resetPassword?verificationToken=${token}>Click Here to reset Password</a></b>`, // html body
          });
          res.status(200).send({
            message: "A link has been sent to your registered email. ",
            status: !!user,
            testURI: emailResponse.testURI,
          });
        } else {
          res.status(200).send({
            message: "A link has been sent to your registered email. ",
            status: !!user,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: false, message: "Something went wrong", err });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { User } = req.db.models;

    const { verificationToken, password } = req.body;
    var decoded = await jwt.verify(
      verificationToken,
      process.env.JWT_RESET_TOKEN
    );
    User.findOne({
      where: {
        email: decoded.data.email,
      },
    })
      .then(async (user) => {
        if (user && user.resetToken === verificationToken) {
          return bcrypt.hash(password, 12).then(async (hashedPassword) => {
            let result = await user.update({
              password: hashedPassword,
              resetToken: null,
              resetTokenExpiry: null,
            });
            if (result) {
              res
                .status(200)
                .send({ message: "Password updated", status: true });
            } else {
              res.status(200).send({
                message: "Err updating password try again",
                status: false,
              });
            }
          });
        } else {
          // res.redirect(process.env.VERIFY_RETURN_URL_FAIL)

          res.status(200).send({ message: "Invalid token", status: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: false, message: "Something went wrong", err });
  }
};
exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  const createdBy = req?.auth?.data?.userId;
  // console.log(createdBy);
  try {
    const { User, Role } = req.db.models;

    // const userId = req?.auth?.data?.userId;
    User.findOne({
      where: {
        id: createdBy,
      },
      // include: [
      //   {
      //     model: Role,
      //     required: false,
      //   },
      // ],
    })
      .then(async (user) => {
        if (user) {
          // res.redirect(process.env.VERIFY_RETURN_URL_FAIL)
          const { fullName, id, email, stripeCustomerId, userType } = user;

          res.status(200).send({
            status: true,
            user: { fullName, id, email, stripeCustomerId, userType },
          });
        } else {
          res
            .status(200)
            .send({ status: false, user: null, message: "User not found" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: false, message: "Something went wrong", err });
  }
};


exports.paymentsuccessurl = async (req, res, next) => {

  try {
    res.sendFile(path.join(__dirname, "..", "..", "public", "paymentSuccess.html"));

    // res.redirect(process.env.STRIPE_PAYMENT_SUCESS);

  } catch (error) {
    res.status(500).send({ status: false, message: "Internal Server Er ror" })
  }

}

exports.paymentfailureurl = async (req, res, next) => {
  try {

    res.sendFile(path.join(__dirname, "..", "..", "public", "PaymentFailure.html"));

    // res.redirect(process.env.STRIPE_PAYMENT_FAILURE);

  } catch (error) {
    res.status(500).send({ status: false, message: "Interna Server  Error" })
  }


}