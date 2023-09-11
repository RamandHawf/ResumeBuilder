const nodemailer = require("nodemailer");

const sendMail = async (emailBody) => {
  console.log("Email is ", process.env.EMAIL, "Password is :", process.env.PASSWORD);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
     user: process.env.EMAIL,
     pass: process.env.PASSWORD,
    },
   });
  let info = await transporter.sendMail(emailBody);

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
  return {
    status: info.messageId,
    testURI: nodemailer.getTestMessageUrl(info)
  };
}

module.exports = sendMail;
