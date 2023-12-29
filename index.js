const path = require("path");
// load dependencies
const env = require("dotenv");
env.config();
const express = require("express");
const bodyParser = require("body-parser");
var { expressjwt: jwt } = require("express-jwt");
const cors = require("cors");

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the actual URL of your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Set this to true if you're using cookies or sessions
  })
);
// app.use(
//   cors({
//     origin: "http://15.152.206.151",
//   })
// );

app.set("view engine", "ejs"); // Set EJS as the view engine
console.log(path.join(__dirname, "views"));
app.set("views", path.join(__dirname, "views")); // Set the directory for views

//Loading Routes
const webRoutes = require("./routes/web");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const resumeRoutes = require("./routes/resume");
const jobdetailRoutes = require("./routes/jobdetail");
const userdataRoutes = require("./routes/userdata");
const AiresumeRoutes = require("./routes/airoutes");
const packageSubscription = require("./routes/packageSubscriptionRoutes");
const packagesRoutes = require("./routes/packageRoutes");
const PaymentGatewayRoutes = require("./routes/paymentGatewayRoute");
const aiResumeVariants = require("./routes/aiResumeVariantsRoutes");

const { sequelize } = require("./models/index");
const errorController = require("./app/controllers/ErrorController");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use(
  jwt({
    secret: process.env.JWT_TOKEN_KEY,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/ping",
      "/api/auth/sign-up",
      "/api/auth/login",
      "/api/auth/reset-password",
      "/api/auth/forget-password",
      "/api/auth/verify",
      "/api/test",
      "/api/auth/success",
      "/api/auth/fail",
      "/api/auth/resendVerificationEmail",
      // "/api/gateway/create-payment",
      "/api/gateway/create-subscription",
      "api//getAllProductDetails",
      "api/auth/",
      "/api/auth/stripepaymentsuccess",
      "/api/auth/stripepaymentfailure"
    ],
  })
);
app.use((req, res, next) => {
  req.db = sequelize;
  next();
});
app.use("/api", webRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/userdata", userdataRoutes);
app.use("/api/resumedata", resumeRoutes);
app.use("/api/jobdetail", jobdetailRoutes);
app.use("/api/airesume", AiresumeRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/packages-subscription", packageSubscription);
app.use("/api/gateway", PaymentGatewayRoutes);
app.use("/api/airesume-variants", aiResumeVariants);

sequelize
  //.sync({ force: true })
  .sync({ alter: true })
  // .sync()
  .then(() => {
    app.listen(process.env.PORT);
    //pending set timezone
    console.log("App listening on port " + process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
